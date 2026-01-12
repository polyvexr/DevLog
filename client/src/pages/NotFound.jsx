import { Link } from "react-router-dom";
import { FiHome, FiAlertCircle } from "react-icons/fi";

export default function NotFound() {
  return (
    <div className="min-h-screen relative flex items-center justify-center px-4 py-8 overflow-hidden">
      {/* Background blobs for depth */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-[120px] animate-blob"></div>
      <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[150px] animate-blob animation-delay-2000"></div>

      <div className="w-full max-w-2xl relative z-10 text-center">
        <div className="relative mb-4 group">
          <div className="text-[15vw] md:text-[180px] font-black leading-none text-white opacity-5 select-none transition-all group-hover:opacity-10">404</div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-32 h-32 bg-white/5 rounded-3xl flex items-center justify-center border border-white/10 shadow-2xl backdrop-blur-3xl group-hover:scale-110 transition-transform duration-500">
              <FiAlertCircle className="text-6xl text-blue-500 opacity-50" />
            </div>
          </div>
        </div>
        
        <div className="fade-in-up">
          <h1 className="text-5xl md:text-7xl font-black text-white mb-6 italic tracking-tight italic">
            Signal <span className="animate-text-shine">Lost</span>
          </h1>
          <p className="text-gray-500 mb-12 text-xl font-medium max-w-md mx-auto leading-relaxed">
            The requested neural node could not be located in the current datastream.
          </p>
          
          <Link 
            to="/"
            className="inline-flex items-center gap-4 px-10 py-5 bg-blue-600 hover:bg-blue-500 text-white font-black text-lg rounded-2xl shadow-xl shadow-blue-500/20 transition-all active:scale-[0.98] group"
          >
            <FiHome className="text-2xl group-hover:-translate-y-1 transition-transform" /> 
            Reconnect Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
