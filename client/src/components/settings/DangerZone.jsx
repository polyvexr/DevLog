export default function DangerZone({ onDeleteClick }) {
  return (
    <section className="bg-red-950/10 border border-red-900/20 p-6 rounded-xl flex flex-col md:flex-row items-center justify-between gap-6">
      <div>
        <h3 className="text-sm font-[Cormorant_Garamond] font-semibold italic text-red-500">Danger zone</h3>
        <p className="text-[9px] font-mono text-slate-500 uppercase tracking-wider mt-1">Permanent account termination sequence</p>
      </div>
      <button
        onClick={onDeleteClick}
        className="px-6 py-2.5 bg-red-950/30 border border-red-500/30 hover:bg-red-500 hover:text-white text-red-500 rounded font-mono text-[9px] font-semibold uppercase tracking-wider transition-colors cursor-pointer"
      >
        Delete Profile
      </button>
    </section>
  );
}
