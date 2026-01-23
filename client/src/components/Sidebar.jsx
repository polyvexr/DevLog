import { useContext } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { useSidebar } from "../hooks/useSidebar";
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
  FiLayers,
} from "react-icons/fi";
import { SiLeetcode, SiCodeforces, SiGithub, SiCodechef } from "react-icons/si";

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

  const isPlatformRoute = ["/leetcode", "/codeforces", "/github", "/codechef", "/atcoder"].includes(
    location.pathname
  );

  const navItems = [
    { path: "/", icon: FiBarChart2, label: "Dashboard", exact: true },
    { path: "/link", icon: FiLink, label: "Connect Hub" },
    { path: "/contests", icon: FiTarget, label: "Contests" },
    { path: "/profile", icon: FiUser, label: "Profile" },
  ];



  const platformItems = [
    {
      path: "/leetcode",
      icon: SiLeetcode,
      label: "LeetCode",
      color: "text-orange-400",
      bg: "bg-orange-500/10",
      border: "border-orange-500/20",
    },
    {
      path: "/codeforces",
      icon: SiCodeforces,
      label: "Codeforces",
      color: "text-blue-400",
      bg: "bg-blue-500/10",
      border: "border-blue-500/20",
    },
    {
      path: "/github",
      icon: SiGithub,
      label: "GitHub",
      color: "text-purple-400",
      bg: "bg-purple-500/10",
      border: "border-purple-500/20",
    },
    {
      path: "/codechef",
      icon: SiCodechef,
      label: "CodeChef",
      color: "text-amber-400",
      bg: "bg-amber-500/10",
      border: "border-amber-500/20",
    },
    {
      path: "/atcoder",
      icon: null, // Text fallback
      label: "AtCoder",
      color: "text-cyan-400",
      bg: "bg-cyan-500/10",
      border: "border-cyan-500/20",
    },
  ];

  return (
    <>
      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-md z-[60] lg:hidden animate-fade-in"
          onClick={closeMobile}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 h-full z-[70] flex flex-col
          bg-[#0a0f18]/60 backdrop-blur-2xl border-r border-white/5
          transition-all duration-500 cubic-bezier(0.23, 1, 0.32, 1)
          ${isCollapsed ? "lg:w-24" : "lg:w-72"} w-72
          ${isMobileOpen ? "translate-x-0" : "-translate-x-full"}
          lg:translate-x-0
        `}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 mb-4">
          <NavLink
            to="/"
            onClick={(e) => {
              if (window.innerWidth >= 1024) {
                e.preventDefault();
                toggleCollapse();
              } else {
                handleNavClick();
              }
            }}
            className="flex items-center gap-3 group"
          >
            <div className={`w-12 h-12 rounded-2xl bg-blue-600/10 border border-blue-500/20 flex items-center justify-center transition-all duration-300 ${isCollapsed ? "mx-auto" : ""}`}>
              <FiZap className="text-2xl text-blue-500 animate-pulse" />
            </div>
            {!isCollapsed && (
              <span className="text-2xl font-black text-white italic tracking-tight animate-fade-in">
                DevLog
              </span>
            )}
          </NavLink>

          {isMobileOpen && (
            <button
              onClick={closeMobile}
              className="lg:hidden w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-gray-400 hover:text-white"
            >
              <FiX />
            </button>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 space-y-8 overflow-y-auto custom-scrollbar">
          {/* Main Nav Sub-section */}
          <div className="space-y-2">
            {!isCollapsed && (
              <div className="px-4 mb-4">
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-600">Main Console</span>
              </div>
            )}
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.exact}
                onClick={handleNavClick}
                className={({ isActive }) => `
                  flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all relative group
                  ${isActive
                    ? "bg-blue-600 text-white shadow-lg shadow-blue-500/25 scale-[1.02]"
                    : "text-gray-500 hover:text-gray-300 hover:bg-white/5"
                  }
                `}
              >
                <item.icon className={`text-xl ${isCollapsed ? "mx-auto" : ""}`} />
                {!isCollapsed && (
                  <div className="flex-1 flex items-center justify-between overflow-hidden">
                    <span className="font-black text-xs uppercase tracking-widest animate-fade-in line-clamp-1">
                      {item.label}
                    </span>
                    {item.count > 0 && (
                      <span className="ml-2 bg-red-500 text-white text-[10px] font-black px-1.5 py-0.5 rounded-full animate-fade-in shrink-0">
                        {item.count}
                      </span>
                    )}
                  </div>
                )}
                {isCollapsed && item.count > 0 && (
                  <div className="absolute top-3 right-5 w-2.5 h-2.5 bg-red-500 rounded-full ring-2 ring-[#0a111b] animate-pulse" />
                )}
              </NavLink>
            ))}
          </div>

          {/* Platforms Sub-section */}
          <div className="space-y-2">
            <button
              onClick={togglePlatforms}
              className={`
                   w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all group
                   ${isPlatformRoute ? "text-white bg-white/5 border border-white/10" : "text-gray-500 hover:text-gray-300 hover:bg-white/5"}
                `}
            >
              <FiLayers className={`text-xl ${isCollapsed ? "mx-auto" : ""}`} />
              {!isCollapsed && (
                <>
                  <span className="font-black text-xs uppercase tracking-widest flex-1 text-left">Ecosystems</span>
                  <FiChevronRight className={`transition-transform duration-300 ${isPlatformsExpanded ? "rotate-90" : ""}`} />
                </>
              )}
            </button>

            {(isPlatformsExpanded || isCollapsed) && (
              <div className={`space-y-1 ${isCollapsed ? "mt-2" : "mt-2 ml-4 border-l border-white/5 pl-4"} animate-fade-in`}>
                {platformItems.map((item) => (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    onClick={handleNavClick}
                    className={({ isActive }) => `
                            flex items-center gap-4 px-4 py-3 rounded-xl transition-all relative group
                            ${isActive
                        ? `${item.bg} ${item.color} ${item.border} border`
                        : "text-gray-600 hover:text-gray-400 hover:bg-white/5"
                      }
                         `}
                  >
                    {item.icon ? (
                      <item.icon className="text-lg" />
                    ) : (
                      <span className="text-xs font-black w-5 h-5 flex items-center justify-center bg-gray-700 rounded text-white">
                        AT
                      </span>
                    )}
                    {!isCollapsed && (
                      <span className="font-bold text-[11px] uppercase tracking-wider">{item.label}</span>
                    )}
                  </NavLink>
                ))}
              </div>
            )}
          </div>

          {/* Admin Sub-section */}
          {isAdmin && (
            <div className="space-y-2 pt-4 border-t border-white/5">
              {!isCollapsed && (
                <div className="px-4 mb-4">
                  <span className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-600">Core Engine</span>
                </div>
              )}
              <NavLink
                to="/admin"
                onClick={handleNavClick}
                className={({ isActive }) => `
                  flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all group
                  ${isActive
                    ? "bg-amber-500 text-white shadow-lg shadow-amber-500/25 scale-[1.02]"
                    : "text-gray-500 hover:text-gray-300 hover:bg-white/5"
                  }
                `}
              >
                <FiSettings className={`text-xl ${isCollapsed ? "mx-auto" : ""}`} />
                {!isCollapsed && (
                  <span className="font-black text-xs uppercase tracking-widest animate-fade-in">Sentinel Mode</span>
                )}
              </NavLink>
            </div>
          )}
        </nav>

        {/* Footer - Logout */}
        <div className="p-6 border-t border-white/5">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-4 px-4 py-4 rounded-2xl text-gray-500 hover:text-red-400 hover:bg-red-500/5 transition-all group relative"
          >
            <FiLogOut className={`text-xl ${isCollapsed ? "mx-auto" : ""}`} />
            {!isCollapsed && (
              <span className="font-black text-xs uppercase tracking-widest">Terminate Session</span>
            )}
          </button>
        </div>
      </aside>
    </>
  );
}
