import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { lazy, Suspense, useContext } from "react";
import { AuthContext } from "./context/AuthContext";
import FullPageLoader from "./components/FullPageLoader";

// Route guards and wrappers
import PrivateRoute from "./components/routes/PrivateRoute";
import PublicRoute from "./components/routes/PublicRoute";
import AuthenticatedWrapper from "./components/routes/AuthenticatedWrapper";

// Eagerly loaded pages (critical path)
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import NotFound from "./pages/NotFound";

// Lazy loaded pages (code splitting)
const LeetCodeDetails = lazy(() => import("./pages/LeetCodeDetails"));
const CodeforcesDetails = lazy(() => import("./pages/CodeforcesDetails"));
const GitHubDetails = lazy(() => import("./pages/GitHubDetails"));
const CodeChefDetails = lazy(() => import("./pages/CodeChefDetails"));
const AtCoderDetails = lazy(() => import("./pages/AtCoderDetails"));
const ForgotPassword = lazy(() => import("./pages/ForgotPassword"));
const ResetPassword = lazy(() => import("./pages/ResetPassword"));
const Settings = lazy(() => import("./pages/Settings"));
const Contests = lazy(() => import("./pages/Contests"));
const PublicProfile = lazy(() => import("./pages/PublicProfile"));

// Context-aware home route
const HomeRoute = () => {
  const { token, loading } = useContext(AuthContext);

  if (loading) return <FullPageLoader />;

  return token ? (
    <AuthenticatedWrapper>
      <Dashboard />
    </AuthenticatedWrapper>
  ) : (
    <Landing />
  );
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomeRoute />} />



        {/* Protected User Details */}
        <Route
          path="/leetcode"
          element={
            <PrivateRoute>
              <AuthenticatedWrapper>
                <LeetCodeDetails />
              </AuthenticatedWrapper>
            </PrivateRoute>
          }
        />
        <Route
          path="/codeforces"
          element={
            <PrivateRoute>
              <AuthenticatedWrapper>
                <CodeforcesDetails />
              </AuthenticatedWrapper>
            </PrivateRoute>
          }
        />
        <Route
          path="/github"
          element={
            <PrivateRoute>
              <AuthenticatedWrapper>
                <GitHubDetails />
              </AuthenticatedWrapper>
            </PrivateRoute>
          }
        />
        <Route
          path="/codechef"
          element={
            <PrivateRoute>
              <AuthenticatedWrapper>
                <CodeChefDetails />
              </AuthenticatedWrapper>
            </PrivateRoute>
          }
        />
        <Route
          path="/atcoder"
          element={
            <PrivateRoute>
              <AuthenticatedWrapper>
                <AtCoderDetails />
              </AuthenticatedWrapper>
            </PrivateRoute>
          }
        />

        {/* System & Features */}
        <Route
          path="/contests"
          element={
            <PrivateRoute>
              <AuthenticatedWrapper>
                <Contests />
              </AuthenticatedWrapper>
            </PrivateRoute>
          }
        />
        <Route
          path="/settings"
          element={
            <PrivateRoute>
              <AuthenticatedWrapper>
                <Settings />
              </AuthenticatedWrapper>
            </PrivateRoute>
          }
        />
        {/* Legacy redirect */}
        <Route path="/profile" element={<Navigate to="/settings" replace />} />

        {/* Auth routes */}
        <Route
          path="/register"
          element={
            <PublicRoute>
              <Login />
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
