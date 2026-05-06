import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import FullPageLoader from "../FullPageLoader";

/**
 * Route guard for admin-only routes
 */
const AdminRoute = ({ children }) => {
  const { token, isAdmin, loading } = useContext(AuthContext);

  if (loading) return <FullPageLoader />;
  if (!token) return <Navigate to="/login" />;
  if (!isAdmin) return <Navigate to="/" />;

  return children;
};

export default AdminRoute;
