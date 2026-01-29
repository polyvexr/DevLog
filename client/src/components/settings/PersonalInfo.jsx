import { FiUser, FiMapPin, FiLink, FiCamera, FiRefreshCw, FiPlus, FiTrash2 } from "react-icons/fi";

export default function PersonalInfo({
    isEditing,
    setIsEditing,
    formData,
    setFormData,
    handleUpdate,
    handleAvatarUpload,
    uploading
}) {
    return (
        <section className="glass-card-premium p-8 space-y-8">
            <div className="flex items-center justify-between border-b border-white/5 pb-6">
                <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-blue-600/10 flex items-center justify-center border border-blue-500/20 text-blue-400"><FiUser /></div>
                    <h2 className="text-xl font-black text-white italic uppercase tracking-tighter underline decoration-blue-500/30 decoration-4">Personal Identity</h2>
                </div>
                <button onClick={() => setIsEditing(!isEditing)} className="p-2.5 bg-white/5 rounded-lg text-gray-400 hover:text-white transition-all">
                    <FiUser />
                </button>
            </div>

            <form onSubmit={handleUpdate} className="space-y-8">
                {/* Avatar Upload */}
                <div className="flex flex-col items-center gap-6 pb-4 border-b border-white/5">
                    <div className="relative group/avatar">
                        <div className={`w-32 h-32 rounded-[2.5rem] bg-gradient-to-br from-blue-600 to-purple-600 p-[2px] transition-all duration-500 ${isEditing ? "hover:scale-105 cursor-pointer shadow-[0_0_30px_rgba(37,99,235,0.3)]" : "opacity-50"}`}>
                            <div className="w-full h-full rounded-[2.4rem] bg-[#0A0A0A] overflow-hidden flex items-center justify-center relative">
                                {formData.avatar ? (
                                    <img src={formData.avatar} className={`w-full h-full object-cover transition-all ${uploading ? "opacity-20 blur-sm" : ""}`} alt="Avatar" />
                                ) : (
                                    <FiUser className="text-4xl text-white/10" />
                                )}
                                {uploading && (
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <FiRefreshCw className="text-white animate-spin text-2xl" />
                                    </div>
                                )}
                                {isEditing && !uploading && (
                                    <div className="absolute inset-0 bg-blue-600/40 opacity-0 group-hover/avatar:opacity-100 flex items-center justify-center transition-all">
                                        <FiCamera className="text-white text-2xl" />
                                    </div>
                                )}
                            </div>
                        </div>
                        {isEditing && (
                            <input
                                type="file"
                                className="absolute inset-0 opacity-0 cursor-pointer z-10"
                                onChange={handleAvatarUpload}
                                accept="image/*"
                            />
                        )}
                    </div>
                    <div className="text-center">
                        <h3 className="text-[9px] font-black uppercase tracking-[0.3em] text-gray-500 mb-1">Profile Photo</h3>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {[
                        { l: "Name", k: "name", i: FiUser },
                        { l: "Location", k: "location", i: FiMapPin },
                        { l: "Website", k: "website", i: FiLink }
                    ].map(f => (
                        <div key={f.k} className="space-y-2">
                            <label className="text-[8px] font-black uppercase tracking-[0.2em] text-gray-500 ml-1">{f.l}</label>
                            <div className="relative">
                                <f.i className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600" />
                                <input
                                    type="text"
                                    disabled={!isEditing}
                                    className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/5 rounded-xl text-white font-bold disabled:opacity-30"
                                    value={formData[f.k]}
                                    onChange={e => setFormData({ ...formData, [f.k]: e.target.value })}
                                />
                            </div>
                        </div>
                    ))}
                </div>
                <div className="space-y-2">
                    <label className="text-[8px] font-black uppercase tracking-[0.2em] text-gray-500 ml-1">Bio</label>
                    <textarea
                        disabled={!isEditing}
                        rows={2}
                        className="w-full p-4 bg-white/5 border border-white/5 rounded-xl text-white font-medium disabled:opacity-30 resize-none"
                        value={formData.bio}
                        onChange={e => setFormData({ ...formData, bio: e.target.value })}
                    />
                </div>

                <div className="space-y-4">
                    <label className="text-[8px] font-black uppercase tracking-[0.2em] text-gray-500 ml-1">Social Links (Tagged)</label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {formData.socials.map((s, i) => (
                            <div key={i} className={`flex items-center gap-2 bg-white/5 border border-white/10 p-3 rounded-xl transition-all ${!isEditing ? "opacity-30 border-white/5" : ""}`}>
                                <div className="flex-1 flex flex-col">
                                    <span className="text-[7px] font-black text-blue-500 uppercase">{s.platform}</span>
                                    <span className="text-xs font-bold text-white truncate">{s.username}</span>
                                </div>
                                {isEditing && (
                                    <button type="button" onClick={() => setFormData({ ...formData, socials: formData.socials.filter((_, idx) => idx !== i) })} className="p-2 text-red-500 hover:bg-red-500/10 rounded-lg"><FiTrash2 size={12} /></button>
                                )}
                            </div>
                        ))}
                        {isEditing && (
                            <div className="flex gap-2 bg-white/5 border border-blue-500/20 p-2 rounded-xl group focus-within:ring-1 ring-blue-500/50 transition-all">
                                <input type="text" placeholder="Tag (e.g. LinkedIn)" className="w-1/3 bg-transparent p-1 text-[10px] font-black text-blue-400 uppercase outline-none" id="social-tag" />
                                <input type="text" placeholder="URL of profile" className="flex-1 bg-transparent p-1 text-[10px] font-bold text-white outline-none" id="social-url" />
                                <button
                                    type="button"
                                    onClick={() => {
                                        const tag = document.getElementById('social-tag');
                                        const url = document.getElementById('social-url');
                                        if (tag.value && url.value) {
                                            setFormData({ ...formData, socials: [...formData.socials, { platform: tag.value, username: url.value }] });
                                            tag.value = ''; url.value = '';
                                        }
                                    }}
                                    className="p-2 bg-blue-600 text-white rounded-lg hover:scale-105 active:scale-95 transition-all">
                                    <FiPlus size={12} />
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {isEditing && <button className="w-full py-4 bg-blue-600 text-white font-black text-[10px] uppercase tracking-widest rounded-xl">Commit Changes</button>}
            </form>
        </section>
    );
}
