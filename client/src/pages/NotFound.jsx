import { Link } from "react-router-dom";
import { FiAlertCircle } from "react-icons/fi";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-700 flex flex-col items-center justify-center px-4 select-none">
      <div className="w-full max-w-md text-center space-y-6">
        
        {/* Giant 404 Watermark */}
        <div className="relative">
          <div className="text-[22vw] md:text-[180px] font-bold font-mono leading-none text-[#e23e2d]/10">
            404
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-12 h-12 bg-red-500/10 border border-red-500/20 rounded-full flex items-center justify-center text-red-500 text-lg">
              <FiAlertCircle />
            </div>
          </div>
        </div>

        {/* Messaging & Action */}
        <div className="space-y-4">
          <h1 className="text-3xl md:text-4xl font-[Cormorant_Garamond] font-light italic text-slate-900 tracking-tight leading-none">
            Lost in the <br />
            <span className="text-[#e23e2d]">Workspace.</span>
          </h1>
          
          <p className="text-slate-400 text-xs font-mono max-w-xs mx-auto leading-relaxed">
            The page you are looking for doesn't exist, has been archived, or was relocated.
          </p>
        </div>

        <div className="pt-4">
          <Link
            to="/"
            className="px-6 py-3 bg-[#e23e2d] hover:bg-[#cf2e2e] text-white font-mono text-xs font-semibold uppercase tracking-wider rounded transition-colors inline-flex items-center gap-1.5 cursor-pointer"
          >
            ← Return to Dashboard
          </Link>
        </div>

      </div>
    </div>
  );
}
