import { FiLink, FiTrash2 } from "react-icons/fi";

export default function EcosystemSync({
    platforms,
    platformMeta,
    newLink,
    setNewLink,
    linkPlatform,
    unlinkPlatform
}) {
    return (
        <section className="glass-card-premium p-8 space-y-8">
            <div className="flex items-center gap-4 border-b border-white/5 pb-6">
                <div className="w-10 h-10 rounded-xl bg-orange-600/10 flex items-center justify-center border border-orange-500/20 text-orange-400"><FiLink /></div>
                <h2 className="text-xl font-black text-white italic uppercase tracking-tighter">Ecosystem Sync</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Active Links */}
                <div className="space-y-4">
                    <h3 className="text-[9px] font-black uppercase tracking-widest text-gray-500 mb-4">Active Nodes</h3>
                    {platforms.map(p => {
                        const meta = platformMeta.find(m => m.id === p.platform);
                        if (!meta) return null;
                        return (
                            <div key={p.platform} className="p-4 bg-white/5 border border-white/5 rounded-xl flex items-center justify-between group">
                                <div className="flex items-center gap-4">
                                    <meta.icon className={`text-xl ${meta.color}`} />
                                    <div>
                                        <div className="font-black text-xs text-white uppercase italic">{p.platform}</div>
                                        <div className="text-[9px] font-bold text-gray-500 tracking-tighter">@{p.username}</div>
                                    </div>
                                </div>
                                <button onClick={() => unlinkPlatform(p.platform)} className="p-2 text-red-500/50 hover:text-red-500 transition-colors">
                                    <FiTrash2 />
                                </button>
                            </div>
                        );
                    })}
                    {platforms.length === 0 && <div className="text-[10px] text-gray-600 font-black uppercase italic">No active links detected</div>}
                </div>

                {/* New Link */}
                <form onSubmit={linkPlatform} className="p-6 bg-white/[0.02] border border-white/5 rounded-2xl space-y-4">
                    <h3 className="text-[9px] font-black uppercase tracking-widest text-gray-500">Initialize New Link</h3>
                    <select
                        className="w-full p-3 bg-white/5 border border-white/5 rounded-xl text-white text-xs font-bold appearance-none outline-none"
                        value={newLink.platform}
                        onChange={e => setNewLink({ ...newLink, platform: e.target.value })}
                    >
                        {platformMeta.map(m => (<option key={m.id} value={m.id} className="bg-[#111]">{m.label}</option>))}
                    </select>
                    <input
                        type="text"
                        placeholder="Platform Username"
                        className="w-full p-3 bg-white/5 border border-white/5 rounded-xl text-white text-xs font-bold outline-none"
                        value={newLink.username}
                        onChange={e => setNewLink({ ...newLink, username: e.target.value })}
                    />
                    <button className="w-full py-3 bg-white/10 hover:bg-white text-black font-black text-[10px] uppercase tracking-widest rounded-xl transition-all">Link Node</button>
                </form>
            </div>
        </section>
    );
}
