import { useContext, useEffect, useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { useSidebar } from "../context/SidebarContext";
import {
  FiZap,
  FiBarChart2,
  FiLink,
  FiTarget,
  FiSettings,
  FiLogOut,
  FiUser,
  FiChevronRight,
  FiX,
  FiCalendar,
} from "react-icons/fi";
import { SiLeetcode, SiCodeforces, SiGithub } from "react-icons/si";
import UserAvatar from "./UserAvatar";
import { getMe } from "../api/axios";

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

  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await getMe();
        setUser(res.data.user);
      } catch (err) {
        console.error("Failed to fetch user:", err);
      }
    };
    fetchUser();
  }, []);

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
    { path: "/", icon: FiBarChart2, label: "Dashboard", exact: true },
    { path: "/link", icon: FiLink, label: "Link Platform" },
    { path: "/profile", icon: FiUser, label: "Profile" }, // Added Profile link

  const platformItems = [
    {
      path: "/leetcode",
      icon: SiLeetcode,
      label: "LeetCode",
      gradient: "from-orange-500 to-yellow-500",
    },
    {
      path: "/codeforces",
      icon: SiCodeforces,
      label: "Codeforces",
      gradient: "from-blue-500 to-cyan-500",
    },
    {
      path: "/github",
      icon: SiGithub,
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
          bg-[var(--bg-card)] backdrop-blur-xl border-r border-[var(--border-color)]
          transition-all duration-300 ease-in-out
          ${isCollapsed ? "lg:w-20" : "lg:w-64"} w-64
          ${isMobileOpen ? "translate-x-0" : "-translate-x-full"}
          lg:translate-x-0
        `}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-[var(--border-color)]">
          {/* Mobile: Link to home, Desktop: Toggle collapse */}
          <NavLink
            to="/"
            onClick={(e) => {
              // On mobile, navigate to home
              // On desktop, prevent navigation and toggle collapse
              if (window.innerWidth >= 1024) {
                e.preventDefault();
                toggleCollapse();
              } else {
                handleNavClick();
              }
            }}
            className={`font-black text-[var(--text-primary)] transition-all duration-300 flex items-center gap-2 ${
              isCollapsed
                ? "lg:text-xl lg:justify-center lg:w-full"
                : "text-2xl"
            }`}
            aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            <span className="lg:hidden flex items-center gap-2">
              <FiZap className="text-[var(--accent-blue)]" /> DevLog
            </span>
            <span className="hidden lg:inline-flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity">
              <FiZap
                className={`text-[var(--accent-blue)] transition-transform duration-300 ${
                  isCollapsed ? "text-2xl" : ""
                }`}
              />
              {!isCollapsed && "DevLog"}
            </span>
          </NavLink>

          {/* Close button - Mobile only */}
          <button
            onClick={closeMobile}
            className="lg:hidden flex items-center justify-center w-8 h-8 rounded-lg bg-[var(--bg-card-inner)] hover:bg-[var(--border-color)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-all"
            aria-label="Close sidebar"
          >
            <FiX />
          </button>
        </div>

        {/* User Profile Card */}
        {user && (
          <div
            className={`p-3 border-b border-[var(--border-color)] ${
              isCollapsed ? "lg:py-3 lg:px-2" : ""
            }`}
          >
            <div
              className={`flex items-center gap-3 ${
                isCollapsed ? "lg:justify-center" : ""
              }`}
            >
              <UserAvatar
                name={user.name}
                size={isCollapsed ? "small" : "default"}
              />
              <div
                className={`flex-1 min-w-0 transition-all duration-300 ${
                  isCollapsed ? "lg:hidden" : ""
                }`}
              >
                <p className="text-sm font-medium text-[var(--text-primary)] truncate">
                  {user.name}
                </p>
                <p className="text-xs text-[var(--text-secondary)] truncate">
                  {user.email}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Navigation */}
        <nav
          className={`flex-1 py-4 px-3 ${
            isCollapsed ? "lg:overflow-hidden" : "overflow-y-auto"
          }`}
        >
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
                      ? "bg-[var(--accent-blue)]/10 text-[var(--text-primary)] border border-[var(--accent-blue)]/30"
                      : "text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-card-inner)]"
                  }
                `}
              >
                <item.icon className="text-xl flex-shrink-0" />
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
                text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-card-inner)]
                ${isPlatformRoute ? "text-[var(--text-primary)]" : ""}
              `}
            >
              <FiTarget className="text-xl flex-shrink-0" />
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
                <FiChevronRight />
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
                          ? `bg-gradient-to-r ${item.gradient} bg-opacity-20 text-[var(--text-primary)] border border-white/10`
                          : "text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-card-inner)]"
                      }
                    `}
                  >
                    <item.icon className="text-lg flex-shrink-0" />
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
            <div className="mt-6 pt-6 border-t border-[var(--border-color)]">
              <NavLink
                to="/admin"
                onClick={handleNavClick}
                className={({ isActive }) => `
                  sidebar-item group flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 relative
                  ${
                    isActive
                      ? "bg-gradient-to-r from-yellow-600/20 to-orange-600/20 text-[var(--text-primary)] border border-yellow-500/30"
                      : "text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-card-inner)]"
                  }
                `}
              >
                <FiSettings className="text-xl flex-shrink-0" />
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

          {/* Upcoming Contests - Placeholder */}
          <div
            className={`mt-6 pt-6 border-t border-[var(--border-color)] ${
              isCollapsed ? "lg:hidden" : ""
            }`}
          >
            <div className="flex items-center justify-between px-3 mb-2">
              <div className="flex items-center gap-2 text-[var(--text-secondary)]">
                <FiCalendar className="text-lg" />
                <span className="font-medium text-sm">Upcoming Contests</span>
              </div>
              <span className="coming-soon-badge">Soon</span>
            </div>
            <div className="px-3 py-4 mx-1 rounded-lg bg-[var(--bg-card-inner)] border border-dashed border-[var(--border-color)]">
              <p className="text-xs text-[var(--text-secondary)] text-center">
                Contest schedules from LeetCode & Codeforces coming soon
              </p>
            </div>
          </div>
        </nav>

        {/* Footer - Logout */}
        <div className="p-3 border-t border-[var(--border-color)]">
          <button
            onClick={handleLogout}
            className={`
              sidebar-item w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 relative
              text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-gradient-to-r hover:from-red-500/10 hover:to-pink-500/10
              hover:border hover:border-red-500/30
            `}
          >
            <FiLogOut className="text-xl flex-shrink-0" />
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
