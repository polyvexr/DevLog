export default function DangerZone({ onDeleteClick }) {
    return (
        <section className="p-8 bg-red-600/5 border border-red-500/10 rounded-3xl flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
                <h3 className="text-xl font-black text-red-500 italic tracking-tighter uppercase">Danger Zone</h3>
                <p className="text-[9px] font-black text-gray-500 uppercase tracking-widest">Permanent account termination sequence</p>
            </div>
            <button
                onClick={onDeleteClick}
                className="px-8 py-3 bg-red-600/10 hover:bg-red-600 text-red-500 hover:text-white transition-all text-[10px] font-black uppercase tracking-widest rounded-xl border border-red-500/20"
            >
                Delete Profile
            </button>
        </section>
    );
}
