import { Link } from "react-router-dom";
import { FiHome, FiAlertCircle } from "react-icons/fi";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6 bg-[radial-gradient(circle_at_50%_50%,rgba(17,24,39,1)_0%,rgba(2,6,23,1)_100%)]">
      <div className="w-full max-w-lg bg-slate-900/40 border border-slate-800/50 p-12 rounded-3xl backdrop-blur-xl text-center fade-in-scale">
        <div className="relative mb-8">
          <div className="text-[12rem] font-black leading-none text-slate-800 select-none">404</div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-24 h-24 bg-blue-600/20 rounded-full flex items-center justify-center border border-blue-500/30 animate-pulse">
              <FiAlertCircle className="text-5xl text-blue-500" />
            </div>
          </div>
        </div>
        
        <h1 className="text-4xl font-black text-white mb-4 neon-text">Page Not Found</h1>
        <p className="text-slate-400 mb-10 text-lg max-w-xs mx-auto">
          The page you are looking for doesn't exist or has been moved.
        </p>
        
        <Link 
          to="/"
          className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold rounded-2xl shadow-lg shadow-blue-500/25 transition-all hover:scale-105 active:scale-95"
        >
          <FiHome className="text-xl" /> Return Dashboard
        </Link>
      </div>
    </div>
  );
}
