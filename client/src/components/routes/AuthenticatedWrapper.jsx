import { Suspense } from "react";
import { SidebarProvider } from "../../context/SidebarProvider";
import AuthenticatedLayout from "../AuthenticatedLayout";
import FullPageLoader from "../FullPageLoader";

/**
 * Shared wrapper for all authenticated pages
 * Combines Sidebar and Layout to eliminate 3x duplication in App.jsx
 */
const AuthenticatedWrapper = ({ children }) => {
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

export default AuthenticatedWrapper;
