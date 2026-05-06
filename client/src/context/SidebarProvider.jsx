import { useState, useEffect, useCallback, useMemo } from "react";
import { SidebarContext } from "./SidebarContext";

export const SidebarProvider = ({ children }) => {
  // Global collapse state with localStorage persistence
  const [isCollapsed, setIsCollapsed] = useState(() => {
    const saved = localStorage.getItem("sidebarCollapsed");
    return saved ? JSON.parse(saved) : false;
  });

  // Mobile sidebar open state
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  // Platforms submenu expanded state
  const [isPlatformsExpanded, setIsPlatformsExpanded] = useState(() => {
    const saved = localStorage.getItem("platformsExpanded");
    return saved ? JSON.parse(saved) : true;
  });

  // Persist collapse state
  useEffect(() => {
    localStorage.setItem("sidebarCollapsed", JSON.stringify(isCollapsed));
  }, [isCollapsed]);

  // Persist platforms expanded state
  useEffect(() => {
    localStorage.setItem(
      "platformsExpanded",
      JSON.stringify(isPlatformsExpanded)
    );
  }, [isPlatformsExpanded]);

  // Close mobile sidebar on resize to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsMobileOpen(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleCollapse = useCallback(() => setIsCollapsed((prev) => !prev), []);
  const toggleMobile = useCallback(() => setIsMobileOpen((prev) => !prev), []);
  const closeMobile = useCallback(() => setIsMobileOpen(false), []);
  const togglePlatforms = useCallback(() => setIsPlatformsExpanded((prev) => !prev), []);

  const value = useMemo(() => ({
    isCollapsed,
    isMobileOpen,
    isPlatformsExpanded,
    toggleCollapse,
    toggleMobile,
    closeMobile,
    togglePlatforms,
  }), [isCollapsed, isMobileOpen, isPlatformsExpanded, toggleCollapse, toggleMobile, closeMobile, togglePlatforms]);

  return (
    <SidebarContext.Provider value={value}>
      {children}
    </SidebarContext.Provider>
  );
};
