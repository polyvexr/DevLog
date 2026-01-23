import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { lazy, Suspense, useContext } from "react";
import { AuthContext } from "./context/AuthContext";
import { SidebarProvider } from "./context/SidebarProvider";
import AuthenticatedLayout from "./components/AuthenticatedLayout";
import FullPageLoader from "./components/FullPageLoader";

// Eagerly loaded pages (critical path)
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import NotFound from "./pages/NotFound";

// Lazy loaded pages (code splitting)
const LinkPlatform = lazy(() => import("./pages/LinkPlatform"));
const LeetCodeDetails = lazy(() => import("./pages/LeetCodeDetails"));
const CodeforcesDetails = lazy(() => import("./pages/CodeforcesDetails"));
const GitHubDetails = lazy(() => import("./pages/GitHubDetails"));
const CodeChefDetails = lazy(() => import("./pages/CodeChefDetails"));
const AtCoderDetails = lazy(() => import("./pages/AtCoderDetails"));
const AdminDashboard = lazy(() => import("./pages/AdminDashboard"));
const ForgotPassword = lazy(() => import("./pages/ForgotPassword"));
const ResetPassword = lazy(() => import("./pages/ResetPassword"));
const Profile = lazy(() => import("./pages/Profile"));
const Contests = lazy(() => import("./pages/Contests"));
const PublicProfile = lazy(() => import("./pages/PublicProfile"));

// Private route wrapper with auth check and layout
const PrivateRoute = ({ children }) => {
  const { token, loading } = useContext(AuthContext);

  if (loading) return <FullPageLoader />;

  return token ? (
    <SidebarProvider>
      <AuthenticatedLayout>
        <Suspense fallback={<FullPageLoader />}>
          {children}
        </Suspense>
      </AuthenticatedLayout>
    </SidebarProvider>
  ) : (
    <Navigate to="/login" />
  );
};

// Admin route wrapper with role check
const AdminRoute = ({ children }) => {
  const { token, isAdmin, loading } = useContext(AuthContext);

  if (loading) return <FullPageLoader />;
  if (!token) return <Navigate to="/login" />;
  if (!isAdmin) return <Navigate to="/" />;

  return (
    <SidebarProvider>
      <AuthenticatedLayout>
        <Suspense fallback={<FullPageLoader />}>
          {children}
        </Suspense>
      </AuthenticatedLayout>
    </SidebarProvider>
  );
};

// Public route - redirects authenticated users
const PublicRoute = ({ children }) => {
  const { token, loading } = useContext(AuthContext);

  if (loading) return <FullPageLoader />;

  return token ? <Navigate to="/" replace /> : (
    <Suspense fallback={<FullPageLoader />}>
      {children}
    </Suspense>
  );
};

// Context-aware home route
const HomeRoute = () => {
  const { token, loading } = useContext(AuthContext);

  if (loading) return <FullPageLoader />;

  return token ? (
    <SidebarProvider>
      <AuthenticatedLayout>
        <Dashboard />
      </AuthenticatedLayout>
    </SidebarProvider>
  ) : (
    <Landing />
  );
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomeRoute />} />

        {/* Admin route */}
        <Route
          path="/admin"
          element={
            <AdminRoute>
              <AdminDashboard />
            </AdminRoute>
          }
        />

        {/* Platform routes */}
        <Route
          path="/link"
          element={
            <PrivateRoute>
              <LinkPlatform />
            </PrivateRoute>
          }
        />
        <Route
          path="/leetcode"
          element={
            <PrivateRoute>
              <LeetCodeDetails />
            </PrivateRoute>
          }
        />
        <Route
          path="/codeforces"
          element={
            <PrivateRoute>
              <CodeforcesDetails />
            </PrivateRoute>
          }
        />
        <Route
          path="/github"
          element={
            <PrivateRoute>
              <GitHubDetails />
            </PrivateRoute>
          }
        />
        <Route
          path="/codechef"
          element={
            <PrivateRoute>
              <CodeChefDetails />
            </PrivateRoute>
          }
        />
        <Route
          path="/atcoder"
          element={
            <PrivateRoute>
              <AtCoderDetails />
            </PrivateRoute>
          }
        />

        {/* V2 Routes */}
        <Route
          path="/contests"
          element={
            <PrivateRoute>
              <Contests />
            </PrivateRoute>
          }
        />

        {/* User profile */}
        <Route
          path="/profile"
          element={
            <PrivateRoute>
              <Profile />
            </PrivateRoute>
          }
        />
        {/* Redirect /settings to /profile */}
        <Route path="/settings" element={<Navigate to="/profile" replace />} />

        {/* Auth routes */}
        <Route
          path="/register"
          element={
            <PublicRoute>
              <Register />
            </PublicRoute>
          }
        />
        <Route
          path="/login"
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />
        <Route
          path="/forgot-password"
          element={
            <PublicRoute>
              <ForgotPassword />
            </PublicRoute>
          }
        />
        <Route
          path="/reset-password/:token"
          element={
            <PublicRoute>
              <ResetPassword />
            </PublicRoute>
          }
        />

        {/* Public profile - NO AUTH REQUIRED */}
        <Route
          path="/u/:username"
          element={
            <Suspense fallback={<FullPageLoader />}>
              <PublicProfile />
            </Suspense>
          }
        />

        {/* 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
