export default function Loader() {
  return (
    <div className="flex flex-col justify-center items-center h-60" role="status" aria-live="polite">
       <div className="relative w-20 h-20">
        {/* Layered Cinematic Rings */}
        <div className="absolute inset-0 animate-spin rounded-full border-[3px] border-transparent border-t-[#e23e2d]" />
        <div className="absolute inset-1 animate-spin rounded-full border-[3px] border-transparent border-r-orange-400" style={{ animationDirection: 'reverse', animationDuration: '1.2s' }} />
        <div className="absolute inset-2 animate-spin rounded-full border-[3px] border-transparent border-b-amber-400" style={{ animationDuration: '1.8s' }} />
        
        {/* Core Glow */}
        <div className="absolute inset-[30%] bg-[#e23e2d]/10 rounded-full blur-xl animate-pulse" />
      </div>
      
      <div className="mt-8 flex flex-col items-center gap-1">
        <div className="text-[10px] font-black uppercase tracking-[0.4em] text-[#e23e2d] animate-pulse">Establishing Link</div>
        <div className="text-xs font-black text-slate-400 tracking-widest italic uppercase">Synchronizing Neural Stats</div>
      </div>
      
      <span className="sr-only">Loading Data...</span>
    </div>
  );
}
