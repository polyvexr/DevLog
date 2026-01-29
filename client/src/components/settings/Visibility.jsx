export default function Visibility({
    platformMeta,
    formData,
    handlePublicVisibilityToggle
}) {
    return (
        <section className="glass-card-premium p-8 space-y-8">
            <h3 className="text-[9px] font-black uppercase tracking-widest text-gray-500">Public Visibility</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
                {platformMeta.map(p => (
                    <button
                        key={p.id}
                        onClick={() => handlePublicVisibilityToggle(p.toggle)}
                        className={`p-4 rounded-xl border flex flex-col items-center gap-3 transition-all ${formData.publicProfile[p.toggle] ? "bg-white/10 border-white/10" : "opacity-30 border-white/5 grayscale"}`}
                    >
                        <p.icon className={`text-xl ${p.color}`} />
                        <div className="text-[8px] font-black uppercase tracking-tighter text-white">{p.label}</div>
                    </button>
                ))}
            </div>
        </section>
    );
}
