import { useContext } from "react";
import { NavLink, useLocation, useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { useSidebar } from "../hooks/useSidebar";
import {
  FiZap,
  FiBarChart2,
  FiTarget,
  FiSettings,
  FiLogOut,
  FiChevronRight,
  FiX,
  FiLayers,
  FiExternalLink,
} from "react-icons/fi";
import { SiLeetcode, SiCodeforces, SiGithub, SiCodechef } from "react-icons/si";

const AtCoderIcon = ({ isCollapsed }) => (
  <span className={`font-bold text-[8px] text-[#e23e2d] bg-[#e23e2d]/10 px-1.5 py-0.5 rounded border border-[#e23e2d]/20 font-sans ${isCollapsed ? "mx-auto" : ""}`}>
    AT
  </span>
);

export default function Sidebar() {
  const { logout } = useContext(AuthContext);
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
    { path: "/contests", icon: FiTarget, label: "Contests" },
    { path: "/settings", icon: FiSettings, label: "Settings" },
  ];

  const platformItems = [
    { path: "/leetcode", icon: SiLeetcode, label: "LeetCode" },
    { path: "/codeforces", icon: SiCodeforces, label: "Codeforces" },
    { path: "/github", icon: SiGithub, label: "GitHub" },
    { path: "/codechef", icon: SiCodechef, label: "CodeChef" },
    { path: "/atcoder", icon: AtCoderIcon, label: "AtCoder" },
  ];

  return (
    <>
      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black/30 backdrop-blur-sm z-[60] lg:hidden"
          onClick={closeMobile}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 h-full z-[70] flex flex-col select-none
          bg-white border-r border-slate-200
          transition-all duration-300
          ${isCollapsed ? "lg:w-20" : "lg:w-64"} w-64
          ${isMobileOpen ? "translate-x-0" : "-translate-x-full"}
          lg:translate-x-0
        `}
      >
        {/* Header */}
        <div className={`flex items-center p-5 border-b border-slate-200 ${isCollapsed ? "justify-center" : "justify-between"}`}>
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
            className={`flex items-center gap-2 group cursor-pointer ${isCollapsed ? "mx-auto justify-center" : ""}`}
          >
            <FiZap className="text-[#e23e2d] text-lg transition-transform duration-200 group-hover:scale-110" />
            {!isCollapsed && (
              <span className="font-[Cormorant_Garamond] font-semibold italic text-lg text-slate-900 tracking-tight leading-none">
                DevLog
              </span>
            )}
          </NavLink>

          {isMobileOpen && (
            <button
              onClick={closeMobile}
              className="lg:hidden w-8 h-8 rounded border border-slate-200 flex items-center justify-center text-slate-400 hover:text-slate-900 transition-colors cursor-pointer"
            >
              <FiX className="text-sm" />
            </button>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-6 space-y-6 overflow-y-auto custom-scrollbar">
          {/* Main Nav Sub-section */}
          <div className="space-y-1">
            {!isCollapsed && (
              <div className="px-3 mb-3">
                <span className="text-[9px] font-mono font-semibold uppercase tracking-wider text-slate-400">Navigation</span>
              </div>
            )}
            {navItems.map((item) => {
              const NavComp = item.external ? 'a' : NavLink;
              const navProps = item.external
                ? { href: item.path, target: "_blank", rel: "noopener noreferrer" }
                : { to: item.path, end: item.exact };

              return (
                <NavComp
                  key={item.path}
                  {...navProps}
                  onClick={handleNavClick}
                  className={({ isActive }) => `
                    flex items-center gap-3.5 px-3 py-2.5 rounded font-mono text-[10px] uppercase tracking-wider transition-all cursor-pointer group relative
                    ${!item.external && isActive
                      ? "bg-slate-100 border-l-2 border-[#e23e2d] text-slate-900 font-semibold"
                      : "text-slate-500 hover:text-slate-900 hover:bg-slate-50"
                    }
                  `}
                >
                  <item.icon className={`text-base ${isCollapsed ? "mx-auto" : ""}`} />
                  {!isCollapsed && (
                    <div className="flex-1 flex items-center justify-between overflow-hidden">
                      <span className="line-clamp-1">{item.label}</span>
                      {item.external && (
                        <FiExternalLink className="ml-2 text-[10px] opacity-40 group-hover:opacity-100 transition-opacity" />
                      )}
                    </div>
                  )}
                </NavComp>
              );
            })}
          </div>

          {/* Platforms Sub-section */}
          <div className="space-y-1">
            <button
              onClick={togglePlatforms}
              className={`
                w-full flex items-center gap-3.5 px-3 py-2.5 rounded font-mono text-[10px] uppercase tracking-wider transition-all cursor-pointer text-left
                ${isPlatformRoute ? "text-slate-700 bg-slate-100 border-l-2 border-[#e23e2d]" : "text-slate-500 hover:text-slate-900 hover:bg-slate-50"}
              `}
            >
              <FiLayers className={`text-base ${isCollapsed ? "mx-auto" : ""}`} />
              {!isCollapsed && (
                <>
                  <span className="flex-1">Platforms</span>
                  <FiChevronRight className={`text-xs transition-transform duration-200 ${isPlatformsExpanded ? "rotate-90" : ""}`} />
                </>
              )}
            </button>

            {(isPlatformsExpanded || isCollapsed) && (
              <div className={`space-y-1 ${isCollapsed ? "mt-2" : "mt-1.5 ml-3 border-l border-slate-200 pl-3"}`}>
                {platformItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <NavLink
                      key={item.path}
                      to={item.path}
                      onClick={handleNavClick}
                      className={({ isActive }) => `
                        flex items-center gap-3 px-3 py-2 rounded font-mono text-[9px] uppercase tracking-wider transition-all cursor-pointer
                        ${isActive
                          ? "bg-slate-100 text-[#e23e2d] font-semibold border-l border-[#e23e2d]/50"
                          : "text-slate-400 hover:text-slate-700 hover:bg-slate-50"
                        }
                      `}
                    >
                      {Icon ? (
                        Icon === AtCoderIcon ? (
                          <Icon isCollapsed={isCollapsed} />
                        ) : (
                          <Icon className={`text-base ${isCollapsed ? "mx-auto" : ""}`} />
                        )
                      ) : null}
                      {!isCollapsed && <span>{item.label}</span>}
                    </NavLink>
                  );
                })}
              </div>
            )}
          </div>


        </nav>

        {/* Footer - Logout */}
        <div className="p-4 border-t border-slate-200">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3.5 px-3 py-2.5 rounded font-mono text-[10px] uppercase tracking-wider text-slate-500 hover:text-[#e23e2d] hover:bg-[#e23e2d]/5 transition-colors cursor-pointer"
          >
            <FiLogOut className={`text-base ${isCollapsed ? "mx-auto" : ""}`} />
            {!isCollapsed && <span>Sign Out</span>}
          </button>
        </div>
      </aside>
    </>
  );
}
