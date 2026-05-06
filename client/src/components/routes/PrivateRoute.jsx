import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import FullPageLoader from "../FullPageLoader";

/**
 * Route guard for authenticated routes
 */
const PrivateRoute = ({ children }) => {
  const { token, loading } = useContext(AuthContext);

  if (loading) return <FullPageLoader />;

  return token ? children : <Navigate to="/login" />;
};

export default PrivateRoute;
