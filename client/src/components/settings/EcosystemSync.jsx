import { FiLink, FiTrash2, FiRefreshCw } from "react-icons/fi";

export default function EcosystemSync({ platforms, platformMeta, newLink, setNewLink, linking, linkPlatform, unlinkPlatform }) {
  return (
    <section className="bg-white border border-slate-200 p-6 rounded-xl space-y-6">
      <div className="flex items-center gap-3 border-b border-slate-200 pb-4">
        <div className="w-8 h-8 rounded-full bg-[#e23e2d]/10 border border-[#e23e2d]/20 flex items-center justify-center text-[#e23e2d] text-sm">
          <FiLink />
        </div>
        <div>
          <h2 className="text-sm font-[Cormorant_Garamond] font-semibold italic text-slate-700">Service integration matching</h2>
          <p className="text-[9px] font-mono uppercase tracking-wider text-slate-400">Sync details with external services</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Active Links */}
        <div className="space-y-3">
          <h3 className="text-[9px] font-mono font-semibold uppercase tracking-wider text-slate-400 mb-4">Active Services</h3>
          <div className="space-y-2">
            {platforms.map(p => {
              const meta = platformMeta.find(m => m.id === p.platform);
              if (!meta) return null;
              const Icon = meta.icon;
              return (
                <div key={p.platform} className="p-4 bg-slate-100 border border-slate-200 rounded flex items-center justify-between group">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-8 h-8 rounded bg-white border border-slate-200 flex items-center justify-center text-sm">
                      {p.platform === "atcoder" ? <Icon /> : <Icon className={meta.color} />}
                    </div>
                    <div className="min-w-0">
                      <div className="font-mono text-[10px] text-slate-900 uppercase font-bold tracking-wider">{p.platform}</div>
                      <div className="text-[9px] font-mono text-slate-400 truncate">@{p.username}</div>
                    </div>
                  </div>
                  <button onClick={() => unlinkPlatform(p.platform)} className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-500/5 rounded transition-all cursor-pointer">
                    <FiTrash2 size={13} />
                  </button>
                </div>
              );
            })}
            {platforms.length === 0 && (
              <div className="text-[9px] text-slate-400 font-mono uppercase tracking-wider italic py-4">No active links detected</div>
            )}
          </div>
        </div>

        {/* New Link */}
        <form onSubmit={linkPlatform} className="p-5 bg-slate-100 border border-slate-200 rounded space-y-4">
          <h3 className="text-[9px] font-mono font-semibold uppercase tracking-wider text-slate-400">Create New Service Link</h3>
          <div className="space-y-3">
            <select
              className="w-full p-2.5 bg-white border border-slate-200 rounded text-xs font-mono text-slate-900 outline-none cursor-pointer focus:border-[#e23e2d]"
              value={newLink.platform}
              onChange={e => setNewLink({ ...newLink, platform: e.target.value })}
            >
              {platformMeta.map(m => (
                <option key={m.id} value={m.id} className="bg-white text-slate-900 font-mono text-xs">{m.label}</option>
              ))}
            </select>
            <input
              type="text"
              placeholder="Platform Username"
              className="w-full p-2.5 bg-white border border-slate-200 rounded text-xs font-mono text-slate-900 outline-none placeholder-slate-400 focus:border-[#e23e2d]"
              value={newLink.username}
              onChange={e => setNewLink({ ...newLink, username: e.target.value })}
              required
            />
            <button
              type="submit"
              disabled={linking}
              className="w-full py-2.5 bg-[#e23e2d] hover:bg-[#cf2e2e] disabled:bg-red-200 disabled:text-slate-400 disabled:cursor-not-allowed text-white font-mono text-xs font-semibold uppercase tracking-wider rounded transition-colors cursor-pointer flex items-center justify-center gap-1.5"
            >
              {linking ? <FiRefreshCw className="animate-spin text-sm" /> : null}
              <span>{linking ? "Linking..." : "Link Service"}</span>
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}
