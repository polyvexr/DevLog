import { useSidebar } from "../hooks/useSidebar";
import Sidebar from "./Sidebar";
import NotificationBell from "./NotificationBell";
import { FiZap, FiMenu } from "react-icons/fi";

export default function AuthenticatedLayout({ children }) {
  const { isCollapsed, toggleMobile } = useSidebar();

  return (
    <div className="min-h-screen flex bg-[#05070a] relative overflow-hidden">
      {/* Background Blobs for Landing-Page Style */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500/10 rounded-full blur-[100px] animate-blob"></div>
        <div className="absolute top-40 right-10 w-96 h-96 bg-purple-500/10 rounded-full blur-[100px] animate-blob delay-200"></div>
        <div className="absolute bottom-20 left-1/3 w-80 h-80 bg-pink-500/10 rounded-full blur-[100px] animate-blob delay-500"></div>
      </div>

      {/* Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div
        className={`
          flex-1 flex flex-col min-h-screen transition-all duration-300 relative z-10
          ${isCollapsed ? "lg:ml-20" : "lg:ml-64"}
        `}
      >
        {/* Top Bar - Mobile Header */}
        <header className="sticky top-0 z-30 lg:hidden bg-[#05070a]/60 backdrop-blur-xl border-b border-white/5">
          <div className="flex items-center justify-between p-4 px-6">
            {/* Hamburger Menu */}
            <button
              onClick={toggleMobile}
              className="flex items-center justify-center w-11 h-11 rounded-2xl bg-white/5 border border-white/10 text-gray-400 hover:text-white transition-all active:scale-95"
              aria-label="Open menu"
            >
              <FiMenu size={20} />
            </button>

            {/* Logo */}
            <span className="text-2xl font-black text-white flex items-center gap-2 italic">
              <FiZap className="text-blue-500 animate-pulse" /> DevLog
            </span>

            {/* Notification Bell */}
            <NotificationBell />
          </div>
        </header>


        {/* Page Content */}
        <main className="flex-1 p-4 md:p-8 lg:p-10 relative">
          <div className="max-w-7xl mx-auto">{children}</div>
        </main>
      </div>
    </div>
  );
}
