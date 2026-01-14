import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Landing from "./pages/Landing";
import LinkPlatform from "./pages/LinkPlatform";
import LeetCodeDetails from "./pages/LeetCodeDetails";
import CodeforcesDetails from "./pages/CodeforcesDetails";
import GitHubDetails from "./pages/GitHubDetails";
import CodeChefDetails from "./pages/CodeChefDetails";
import AtCoderDetails from "./pages/AtCoderDetails";
import AdminDashboard from "./pages/AdminDashboard";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";
// V2 Pages
import Contests from "./pages/Contests";
import Insights from "./pages/Insights";
import History from "./pages/History";
import Notifications from "./pages/Notifications";
import PublicProfile from "./pages/PublicProfile";
import AuthenticatedLayout from "./components/AuthenticatedLayout";
import { AuthContext } from "./context/AuthContext";
import { SidebarProvider } from "./context/SidebarProvider";
import { useContext } from "react";

const PrivateRoute = ({ children }) => {
  const { token, loading } = useContext(AuthContext);
  
  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-blue-500/30 border-t-blue-500 rounded-full animate-spin"></div>
      </div>
    );
  }
  
  return token ? (
    <SidebarProvider>
      <AuthenticatedLayout>{children}</AuthenticatedLayout>
    </SidebarProvider>
  ) : (
    <Navigate to="/login" />
  );
};

const AdminRoute = ({ children }) => {
  const { token, isAdmin, loading } = useContext(AuthContext);
  
  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-blue-500/30 border-t-blue-500 rounded-full animate-spin"></div>
      </div>
    );
  }
  
  if (!token) return <Navigate to="/login" />;
  if (!isAdmin) return <Navigate to="/" />;
  return (
    <SidebarProvider>
      <AuthenticatedLayout>{children}</AuthenticatedLayout>
    </SidebarProvider>
  );
};

// PublicRoute: Redirect authenticated users away from public pages
const PublicRoute = ({ children }) => {
  const { token, loading } = useContext(AuthContext);
  
  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-blue-500/30 border-t-blue-500 rounded-full animate-spin"></div>
      </div>
    );
  }
  
  return token ? <Navigate to="/" replace /> : children;
};

// Context-aware home route: Landing for guests, Dashboard for authenticated users
const HomeRoute = () => {
  const { token, loading } = useContext(AuthContext);
  
  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-blue-500/30 border-t-blue-500 rounded-full animate-spin"></div>
      </div>
    );
  }
  
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
        <Route
          path="/insights"
          element={
            <PrivateRoute>
              <Insights />
            </PrivateRoute>
          }
        />
        <Route
          path="/history"
          element={
            <PrivateRoute>
              <History />
            </PrivateRoute>
          }
        />
        
        <Route
          path="/notifications"
          element={
            <PrivateRoute>
              <Notifications />
            </PrivateRoute>
          }
        />
        
        {/* User profile (includes settings) */}
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
        <Route path="/u/:username" element={<PublicProfile />} />
        
        {/* 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
