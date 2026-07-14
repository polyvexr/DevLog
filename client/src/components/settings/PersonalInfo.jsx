import { FiUser, FiMapPin, FiLink, FiPlus, FiTrash2, FiEdit3 } from "react-icons/fi";

export default function PersonalInfo({ isEditing, setIsEditing, formData, setFormData, handleUpdate }) {
  return (
    <section className="bg-white border border-slate-200 p-6 rounded-xl space-y-6">
      <div className="flex items-center justify-between border-b border-slate-200 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-[#e23e2d]/10 border border-[#e23e2d]/20 flex items-center justify-center text-[#e23e2d] text-sm">
            <FiUser />
          </div>
          <div>
            <h2 className="text-sm font-[Cormorant_Garamond] font-semibold italic text-slate-700">Personal identity</h2>
            <p className="text-[9px] font-mono uppercase tracking-wider text-slate-400">Configure profile credentials</p>
          </div>
        </div>
        <button type="button" onClick={() => setIsEditing(!isEditing)} className="p-2 bg-slate-100 border border-slate-200 rounded text-slate-500 hover:text-slate-700 hover:bg-white transition-all cursor-pointer">
          <FiEdit3 size={14} />
        </button>
      </div>

      <form onSubmit={handleUpdate} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { l: "Name", k: "name", i: FiUser },
            { l: "Location", k: "location", i: FiMapPin },
            { l: "Website", k: "website", i: FiLink }
          ].map(f => (
            <div key={f.k} className="space-y-1.5">
              <label className="text-[8px] font-mono font-semibold uppercase tracking-wider text-slate-400 ml-1">{f.l}</label>
              <div className="relative">
                <f.i size={13} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  disabled={!isEditing}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-100 border border-slate-200 rounded text-xs font-mono text-slate-900 placeholder-slate-400 disabled:opacity-35 disabled:cursor-not-allowed focus:outline-none focus:border-[#e23e2d] transition-all"
                  value={formData[f.k]}
                  onChange={e => setFormData({ ...formData, [f.k]: e.target.value })}
                />
              </div>
            </div>
          ))}
        </div>

        <div className="space-y-1.5">
          <label className="text-[8px] font-mono font-semibold uppercase tracking-wider text-slate-400 ml-1">Bio</label>
          <textarea
            disabled={!isEditing}
            rows={2}
            className="w-full p-4 bg-slate-100 border border-slate-200 rounded text-xs font-mono text-slate-900 placeholder-slate-400 disabled:opacity-35 disabled:cursor-not-allowed focus:outline-none focus:border-[#e23e2d] transition-all resize-none"
            value={formData.bio}
            onChange={e => setFormData({ ...formData, bio: e.target.value })}
          />
        </div>

        <div className="space-y-3">
          <label className="text-[8px] font-mono font-semibold uppercase tracking-wider text-slate-400 ml-1">Social Links (Tagged)</label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {formData.socials.map((s, i) => (
              <div key={i} className={`flex items-center justify-between bg-slate-100 border border-slate-200 p-3 rounded transition-opacity ${!isEditing ? "opacity-35" : ""}`}>
                <div className="flex-1 flex items-center justify-between min-w-0 pr-4">
                  <span className="text-[9px] font-mono font-semibold text-[#e23e2d] uppercase tracking-wider flex-shrink-0">{s.platform}</span>
                  <div className="h-px bg-slate-200 flex-1 mx-3" />
                  <span className="text-xs font-mono font-bold text-slate-700 truncate max-w-[65%] text-right">{s.username}</span>
                </div>
                {isEditing && (
                  <button type="button" onClick={() => setFormData({ ...formData, socials: formData.socials.filter((_, idx) => idx !== i) })} className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-500/5 rounded transition-all cursor-pointer">
                    <FiTrash2 size={12} />
                  </button>
                )}
              </div>
            ))}
            {isEditing && (
              <div className="flex gap-2 bg-slate-100 border border-slate-200 p-2 rounded focus-within:border-[#e23e2d] transition-colors">
                <input type="text" placeholder="Tag (e.g. LinkedIn)" className="w-1/3 bg-transparent p-1 text-[10px] font-mono text-slate-700 outline-none uppercase placeholder-slate-400" id="social-tag" />
                <div className="w-px h-4 bg-slate-200 self-center"></div>
                <input type="text" placeholder="URL Profile" className="flex-1 bg-transparent p-1 text-[10px] font-mono text-slate-700 outline-none placeholder-slate-400" id="social-url" />
                <button type="button" onClick={() => { const tag = document.getElementById('social-tag'); const url = document.getElementById('social-url'); if (tag.value && url.value) { setFormData({ ...formData, socials: [...formData.socials, { platform: tag.value, username: url.value }] }); tag.value = ''; url.value = ''; } }} className="p-2 bg-[#e23e2d] hover:bg-[#cf2e2e] text-white rounded transition-all flex items-center justify-center cursor-pointer">
                  <FiPlus size={12} />
                </button>
              </div>
            )}
          </div>
        </div>

        {isEditing && (
          <button className="w-full py-3 bg-[#e23e2d] hover:bg-[#cf2e2e] text-white font-mono text-xs font-semibold uppercase tracking-wider rounded transition-colors cursor-pointer">
            Commit Changes
          </button>
        )}
      </form>
    </section>
  );
}
