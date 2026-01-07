import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Landing from "./pages/Landing";
import LinkPlatform from "./pages/LinkPlatform";
import LeetCodeDetails from "./pages/LeetCodeDetails";
import CodeforcesDetails from "./pages/CodeforcesDetails";
import GitHubDetails from "./pages/GitHubDetails";
import AdminDashboard from "./pages/AdminDashboard";
import AuthenticatedLayout from "./components/AuthenticatedLayout";
import { AuthContext } from "./context/AuthContext";
import { SidebarProvider } from "./context/SidebarContext";
import { useContext } from "react";

const PrivateRoute = ({ children }) => {
  const { token } = useContext(AuthContext);
  return token ? (
    <SidebarProvider>
      <AuthenticatedLayout>{children}</AuthenticatedLayout>
    </SidebarProvider>
  ) : (
    <Navigate to="/login" />
  );
};

const AdminRoute = ({ children }) => {
  const { token, isAdmin } = useContext(AuthContext);
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
  const { token } = useContext(AuthContext);
  return token ? <Navigate to="/" replace /> : children;
};

// Context-aware home route: Landing for guests, Dashboard for authenticated users
const HomeRoute = () => {
  const { token } = useContext(AuthContext);
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
        <Route
          path="/admin"
          element={
            <AdminRoute>
              <AdminDashboard />
            </AdminRoute>
          }
        />
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
      </Routes>
    </BrowserRouter>
  );
}

export default App;
