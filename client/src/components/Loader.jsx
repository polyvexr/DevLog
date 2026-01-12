export default function Loader() {
  return (
    <div className="flex flex-col justify-center items-center h-60" role="status" aria-live="polite">
       <div className="relative w-20 h-20">
        {/* Layered Cinematic Rings */}
        <div className="absolute inset-0 animate-spin rounded-full border-[3px] border-transparent border-t-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.5)]" />
        <div className="absolute inset-1 animate-spin rounded-full border-[3px] border-transparent border-r-purple-500" style={{ animationDirection: 'reverse', animationDuration: '1.2s' }} />
        <div className="absolute inset-2 animate-spin rounded-full border-[3px] border-transparent border-b-cyan-400" style={{ animationDuration: '1.8s' }} />
        
        {/* Core Glow */}
        <div className="absolute inset-[30%] bg-blue-500/20 rounded-full blur-xl animate-pulse" />
      </div>
      
      <div className="mt-8 flex flex-col items-center gap-1">
        <div className="text-[10px] font-black uppercase tracking-[0.4em] text-blue-500 animate-pulse">Establishing Link</div>
        <div className="text-xs font-black text-gray-400 tracking-widest italic uppercase">Synchronizing Neural Stats</div>
      </div>
      
      <span className="sr-only">Loading Data...</span>
    </div>
  );
}
