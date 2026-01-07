import { useContext } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { useSidebar } from "../context/SidebarContext";

export default function Sidebar() {
  const { logout, isAdmin } = useContext(AuthContext);
  const {
    isCollapsed,
    isMobileOpen,
    isPlatformsExpanded,
    toggleCollapse,
    closeMobile,
    togglePlatforms,
  } = useSidebar();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
    closeMobile();
  };

  const handleNavClick = () => {
    closeMobile();
  };

  // Check if current route is a platform detail page
  const isPlatformRoute = ["/leetcode", "/codeforces", "/github"].includes(
    location.pathname
  );

  const navItems = [
    { path: "/", icon: "📊", label: "Dashboard", exact: true },
    { path: "/link", icon: "🔗", label: "Link Platform" },
  ];

  const platformItems = [
    {
      path: "/leetcode",
      icon: "🧩",
      label: "LeetCode",
      gradient: "from-orange-500 to-yellow-500",
    },
    {
      path: "/codeforces",
      icon: "🏆",
      label: "Codeforces",
      gradient: "from-blue-500 to-cyan-500",
    },
    {
      path: "/github",
      icon: "💻",
      label: "GitHub",
      gradient: "from-purple-500 to-pink-500",
    },
  ];

  return (
    <>
      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
          onClick={closeMobile}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 h-full z-50 flex flex-col
          bg-gradient-to-b from-slate-900/98 via-slate-800/98 to-slate-900/98
          backdrop-blur-xl border-r border-blue-500/20
          transition-all duration-300 ease-in-out
          ${isCollapsed ? "lg:w-20" : "lg:w-64"} w-64
          ${isMobileOpen ? "translate-x-0" : "-translate-x-full"}
          lg:translate-x-0
        `}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-blue-500/10">
          <NavLink
            to="/"
            onClick={handleNavClick}
            className={`font-black neon-text transition-all duration-300 ${
              isCollapsed ? "lg:text-xl" : "text-2xl"
            }`}
          >
            <span className="lg:hidden">⚡ DevLog</span>
            <span className="hidden lg:inline">
              {isCollapsed ? "⚡" : "⚡ DevLog"}
            </span>
          </NavLink>

          {/* Collapse Toggle - Desktop only */}
          <button
            onClick={toggleCollapse}
            className="hidden lg:flex items-center justify-center w-8 h-8 rounded-lg bg-slate-800/50 hover:bg-slate-700/50 text-gray-400 hover:text-white transition-all"
            aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            <span
              className={`transition-transform duration-300 ${
                isCollapsed ? "rotate-180" : ""
              }`}
            >
              ◀
            </span>
          </button>

          {/* Close button - Mobile only */}
          <button
            onClick={closeMobile}
            className="lg:hidden flex items-center justify-center w-8 h-8 rounded-lg bg-slate-800/50 hover:bg-slate-700/50 text-gray-400 hover:text-white transition-all"
            aria-label="Close sidebar"
          >
            ✕
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4 px-3">
          {/* Main Nav Items */}
          <div className="space-y-1">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.exact}
                onClick={handleNavClick}
                className={({ isActive }) => `
                  sidebar-item group flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 relative
                  ${
                    isActive
                      ? "bg-gradient-to-r from-blue-600/20 to-purple-600/20 text-white shadow-lg shadow-blue-500/10 border border-blue-500/30"
                      : "text-gray-400 hover:text-white hover:bg-white/5"
                  }
                `}
              >
                <span className="text-xl flex-shrink-0">{item.icon}</span>
                <span
                  className={`font-medium whitespace-nowrap transition-all duration-300 ${
                    isCollapsed
                      ? "lg:opacity-0 lg:w-0 lg:overflow-hidden"
                      : "opacity-100"
                  }`}
                >
                  {item.label}
                </span>
                {/* Tooltip for collapsed state */}
                {isCollapsed && (
                  <span className="sidebar-tooltip hidden lg:block">
                    {item.label}
                  </span>
                )}
              </NavLink>
            ))}
          </div>

          {/* Platforms Section */}
          <div className="mt-6">
            <button
              onClick={togglePlatforms}
              className={`
                sidebar-item w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 relative
                text-gray-400 hover:text-white hover:bg-white/5
                ${isPlatformRoute ? "text-white" : ""}
              `}
            >
              <span className="text-xl flex-shrink-0">🎯</span>
              <span
                className={`font-medium whitespace-nowrap flex-1 text-left transition-all duration-300 ${
                  isCollapsed
                    ? "lg:opacity-0 lg:w-0 lg:overflow-hidden"
                    : "opacity-100"
                }`}
              >
                Platforms
              </span>
              <span
                className={`transition-transform duration-200 ${
                  isCollapsed ? "lg:hidden" : ""
                } ${isPlatformsExpanded ? "rotate-90" : ""}`}
              >
                ▶
              </span>
              {/* Tooltip for collapsed state */}
              {isCollapsed && (
                <span className="sidebar-tooltip hidden lg:block">
                  Platforms
                </span>
              )}
            </button>

            {/* Platform Sub-items */}
            <div
              className={`
              overflow-hidden transition-all duration-300 ease-in-out
              ${
                isPlatformsExpanded || isCollapsed
                  ? "max-h-96 opacity-100"
                  : "max-h-0 opacity-0"
              }
            `}
            >
              <div
                className={`space-y-1 ${isCollapsed ? "lg:mt-1" : "mt-1 ml-4"}`}
              >
                {platformItems.map((item) => (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    onClick={handleNavClick}
                    className={({ isActive }) => `
                      sidebar-item group flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 relative
                      ${
                        isActive
                          ? `bg-gradient-to-r ${item.gradient} bg-opacity-20 text-white shadow-lg border border-white/10`
                          : "text-gray-500 hover:text-white hover:bg-white/5"
                      }
                    `}
                  >
                    <span className="text-lg flex-shrink-0">{item.icon}</span>
                    <span
                      className={`font-medium whitespace-nowrap transition-all duration-300 ${
                        isCollapsed
                          ? "lg:opacity-0 lg:w-0 lg:overflow-hidden"
                          : "opacity-100"
                      }`}
                    >
                      {item.label}
                    </span>
                    {/* Tooltip for collapsed state */}
                    {isCollapsed && (
                      <span className="sidebar-tooltip hidden lg:block">
                        {item.label}
                      </span>
                    )}
                  </NavLink>
                ))}
              </div>
            </div>
          </div>

          {/* Admin Section */}
          {isAdmin && (
            <div className="mt-6 pt-6 border-t border-blue-500/10">
              <NavLink
                to="/admin"
                onClick={handleNavClick}
                className={({ isActive }) => `
                  sidebar-item group flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 relative
                  ${
                    isActive
                      ? "bg-gradient-to-r from-yellow-600/20 to-orange-600/20 text-white shadow-lg shadow-yellow-500/10 border border-yellow-500/30"
                      : "text-gray-400 hover:text-white hover:bg-white/5"
                  }
                `}
              >
                <span className="text-xl flex-shrink-0">🔧</span>
                <span
                  className={`font-medium whitespace-nowrap transition-all duration-300 ${
                    isCollapsed
                      ? "lg:opacity-0 lg:w-0 lg:overflow-hidden"
                      : "opacity-100"
                  }`}
                >
                  Admin Panel
                </span>
                {/* Tooltip for collapsed state */}
                {isCollapsed && (
                  <span className="sidebar-tooltip hidden lg:block">
                    Admin Panel
                  </span>
                )}
              </NavLink>
            </div>
          )}
        </nav>

        {/* Footer - Logout */}
        <div className="p-3 border-t border-blue-500/10">
          <button
            onClick={handleLogout}
            className={`
              sidebar-item w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 relative
              text-gray-400 hover:text-white hover:bg-gradient-to-r hover:from-red-500/10 hover:to-pink-500/10
              hover:border hover:border-red-500/30
            `}
          >
            <span className="text-xl flex-shrink-0">🚪</span>
            <span
              className={`font-medium whitespace-nowrap transition-all duration-300 ${
                isCollapsed
                  ? "lg:opacity-0 lg:w-0 lg:overflow-hidden"
                  : "opacity-100"
              }`}
            >
              Logout
            </span>
            {/* Tooltip for collapsed state */}
            {isCollapsed && (
              <span className="sidebar-tooltip hidden lg:block">Logout</span>
            )}
          </button>
        </div>
      </aside>
    </>
  );
}
