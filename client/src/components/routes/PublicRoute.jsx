import { useContext, Suspense } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import FullPageLoader from "../FullPageLoader";

/**
 * Route guard for public-only routes (redirects if already logged in)
 */
const PublicRoute = ({ children }) => {
  const { token, loading } = useContext(AuthContext);

  if (loading) return <FullPageLoader />;

  return token ? <Navigate to="/" replace /> : (
    <Suspense fallback={<FullPageLoader />}>
      {children}
    </Suspense>
  );
};

export default PublicRoute;
