import { useSidebar } from "../context/SidebarContext";
import Sidebar from "./Sidebar";

export default function AuthenticatedLayout({ children }) {
  const { isCollapsed, toggleMobile } = useSidebar();

  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div
        className={`
          flex-1 flex flex-col min-h-screen transition-all duration-300
          ${isCollapsed ? "lg:ml-20" : "lg:ml-64"}
        `}
      >
        {/* Top Bar - Mobile Header */}
        <header className="sticky top-0 z-30 lg:hidden bg-gradient-to-r from-slate-900/95 via-slate-800/95 to-slate-900/95 backdrop-blur-lg border-b border-blue-500/20">
          <div className="flex items-center justify-between p-4">
            {/* Hamburger Menu */}
            <button
              onClick={toggleMobile}
              className="flex items-center justify-center w-10 h-10 rounded-xl bg-slate-800/50 hover:bg-slate-700/50 text-gray-300 hover:text-white transition-all"
              aria-label="Open menu"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>

            {/* Logo */}
            <span className="text-xl font-black neon-text">⚡ DevLog</span>

            {/* Spacer for alignment */}
            <div className="w-10" />
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 md:p-6 lg:p-8">
          <div className="app-container">{children}</div>
        </main>
      </div>
    </div>
  );
}
