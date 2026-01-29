import { useState, useEffect, useContext } from "react";
import api from "../api/axios";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import FullPageLoader from "../components/FullPageLoader";
import Dialog from "../components/Dialog";
import {
  FiUser, FiMail, FiLock, FiTrash2, FiEdit3, FiSave, FiX, FiShield,
  FiEye, FiEyeOff, FiGlobe, FiMapPin, FiLink, FiFileText, FiCheckCircle,
  FiAlertCircle, FiCamera, FiPlus, FiRefreshCw
} from "react-icons/fi";
import { SiLeetcode, SiCodeforces, SiGithub, SiCodechef } from "react-icons/si";

const AtCoderIcon = ({ className }) => <span className={`font-black text-[10px] ${className}`}>AT</span>;

export default function Settings() {
  const navigate = useNavigate();
  const { logout, refreshUser } = useContext(AuthContext);
  const [user, setUser] = useState(null);
  const [platforms, setPlatforms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState({ type: "", message: "" });
  const [isEditing, setIsEditing] = useState(false);
  const [showPass, setShowPass] = useState({ current: false, new: false });
  const [dialog, setDialog] = useState({ open: false, platform: null });
  const [newLink, setNewLink] = useState({ platform: "leetcode", username: "" });

  const [formData, setFormData] = useState({
    name: "", bio: "", location: "", website: "", avatar: "", socials: [],
    publicProfile: { enabled: true, showLeetCode: true, showCodeforces: true, showGitHub: true, showCodeChef: true, showAtCoder: true },
    currentPassword: "", newPassword: ""
  });

  useEffect(() => { fetchAll(); }, []);

  const fetchAll = async () => {
    try {
      const [uRes, pRes] = await Promise.all([api.get("/user/profile"), api.get("/platforms")]);
      const u = uRes.data.data.user;
      setUser(u);
      setPlatforms(pRes.data.data.platforms || []);
      setFormData(prev => ({
        ...prev,
        name: u.name || "", bio: u.profile?.bio || "", location: u.profile?.location || "", website: u.profile?.website || "", avatar: u.profile?.avatar || "",
        socials: u.profile?.socials || [],
        publicProfile: { ...prev.publicProfile, ...u.publicProfile }
      }));
    } catch (err) { showStatus("error", "Sync failure"); } finally { setLoading(false); }
  };

  const showStatus = (type, message) => {
    setStatus({ type, message });
    setTimeout(() => setStatus({ type: "", message: "" }), 5000);
  };

  const handleUpdate = (e) => {
    e.preventDefault();
    api.put("/user/profile", {
      name: formData.name, bio: formData.bio, location: formData.location,
      website: formData.website, socials: formData.socials
    })
      .then(() => { showStatus("success", "Identity updated"); setIsEditing(false); })
      .catch(err => showStatus("error", err.response?.data?.message || "Update failed"));
  };

  const linkPlatform = async (e) => {
    e.preventDefault();
    if (!newLink.username) return;
    try {
      showStatus("success", `Connecting to ${newLink.platform}...`);
      const res = await api.post("/platforms/link", newLink);
      if (res.data.success) {
        showStatus("success", "Node linked successfully");
        setNewLink({ ...newLink, username: "" });
        fetchAll();
      }
    } catch (err) { showStatus("error", err.response?.data?.message || "Link failed"); }
  };

  const unlinkPlatform = async (p) => {
    try {
      await api.delete(`/platforms/${p}`);
      showStatus("success", "Platform severed");
      fetchAll();
    } catch (err) { showStatus("error", "Unlink failed"); }
  };

  if (loading) return <FullPageLoader />;

  const platformMeta = [
    { id: "leetcode", label: "LeetCode", icon: SiLeetcode, color: "text-yellow-500", toggle: "showLeetCode" },
    { id: "codeforces", label: "Codeforces", icon: SiCodeforces, color: "text-blue-500", toggle: "showCodeforces" },
    { id: "github", label: "GitHub", icon: SiGithub, color: "text-white", toggle: "showGitHub" },
    { id: "codechef", label: "CodeChef", icon: SiCodechef, color: "text-amber-600", toggle: "showCodeChef" },
    { id: "atcoder", label: "AtCoder", icon: AtCoderIcon, color: "text-cyan-500", toggle: "showAtCoder" },
  ];

  return (
    <div className="max-w-4xl mx-auto py-12 px-6 space-y-12 pb-32">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 fade-in-scale">
        <div className="flex gap-4 items-center">
          <Link to="/" className="p-3 bg-white/5 border border-white/10 rounded-xl hover:bg-blue-600 transition-all"><FiX /></Link>
          <h1 className="text-4xl font-black text-white italic tracking-tighter">System<span className="animate-text-shine">Settings</span></h1>
        </div>
        {status.message && (
          <div className={`p-4 rounded-xl flex items-center gap-3 glass-card-premium border-none ring-1 ${status.type === "error" ? "ring-red-500/30 text-red-400" : "ring-green-500/30 text-green-400"}`}>
            <span className="text-[9px] font-black uppercase tracking-widest">{status.message}</span>
          </div>
        )}
      </div>

      {/* Profile */}
      <section className="glass-card-premium p-8 space-y-8">
        <div className="flex items-center justify-between border-b border-white/5 pb-6">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-blue-600/10 flex items-center justify-center border border-blue-500/20 text-blue-400"><FiUser /></div>
            <h2 className="text-xl font-black text-white italic uppercase tracking-tighter underline decoration-blue-500/30 decoration-4">Personal Identity</h2>
          </div>
          <button onClick={() => setIsEditing(!isEditing)} className="p-2.5 bg-white/5 rounded-lg text-gray-400 hover:text-white transition-all"><FiEdit3 /></button>
        </div>

        <form onSubmit={handleUpdate} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              { l: "Name", k: "name", i: FiUser }, { l: "Location", k: "location", i: FiMapPin }, { l: "Website", k: "website", i: FiLink }
            ].map(f => (
              <div key={f.k} className="space-y-2">
                <label className="text-[8px] font-black uppercase tracking-[0.2em] text-gray-500 ml-1">{f.l}</label>
                <div className="relative">
                  <f.i className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600" />
                  <input type="text" disabled={!isEditing} className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/5 rounded-xl text-white font-bold disabled:opacity-30" value={formData[f.k]} onChange={e => setFormData({ ...formData, [f.k]: e.target.value })} />
                </div>
              </div>
            ))}
          </div>
          <div className="space-y-2">
            <label className="text-[8px] font-black uppercase tracking-[0.2em] text-gray-500 ml-1">Bio</label>
            <textarea disabled={!isEditing} rows={2} className="w-full p-4 bg-white/5 border border-white/5 rounded-xl text-white font-medium disabled:opacity-30 resize-none" value={formData.bio} onChange={e => setFormData({ ...formData, bio: e.target.value })} />
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
                  <button type="button" onClick={() => {
                    const tag = document.getElementById('social-tag');
                    const url = document.getElementById('social-url');
                    if (tag.value && url.value) {
                      setFormData({ ...formData, socials: [...formData.socials, { platform: tag.value, username: url.value }] });
                      tag.value = ''; url.value = '';
                    }
                  }} className="p-2 bg-blue-600 text-white rounded-lg hover:scale-105 active:scale-95 transition-all"><FiPlus size={12} /></button>
                </div>
              )}
            </div>
          </div>

          {isEditing && <button className="w-full py-4 bg-blue-600 text-white font-black text-[10px] uppercase tracking-widest rounded-xl">Commit Changes</button>}
        </form>
      </section>

      {/* Platform Connections */}
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
              return (
                <div key={p.platform} className="p-4 bg-white/5 border border-white/5 rounded-xl flex items-center justify-between group">
                  <div className="flex items-center gap-4">
                    <meta.icon className={`text-xl ${meta.color}`} />
                    <div>
                      <div className="font-black text-xs text-white uppercase italic">{p.platform}</div>
                      <div className="text-[9px] font-bold text-gray-500 tracking-tighter">@{p.username}</div>
                    </div>
                  </div>
                  <button onClick={() => unlinkPlatform(p.platform)} className="p-2 text-red-500/50 hover:text-red-500 transition-colors"><FiTrash2 /></button>
                </div>
              );
            })}
            {platforms.length === 0 && <div className="text-[10px] text-gray-600 font-black uppercase italic">No active links detected</div>}
          </div>

          {/* New Link */}
          <form onSubmit={linkPlatform} className="p-6 bg-white/[0.02] border border-white/5 rounded-2xl space-y-4">
            <h3 className="text-[9px] font-black uppercase tracking-widest text-gray-500">Initialize New Link</h3>
            <select className="w-full p-3 bg-white/5 border border-white/5 rounded-xl text-white text-xs font-bold appearance-none outline-none" value={newLink.platform} onChange={e => setNewLink({ ...newLink, platform: e.target.value })}>
              {platformMeta.map(m => (<option key={m.id} value={m.id} className="bg-[#111]">{m.label}</option>))}
            </select>
            <input type="text" placeholder="Platform Username" className="w-full p-3 bg-white/5 border border-white/5 rounded-xl text-white text-xs font-bold outline-none" value={newLink.username} onChange={e => setNewLink({ ...newLink, username: e.target.value })} />
            <button className="w-full py-3 bg-white/10 hover:bg-white text-black font-black text-[10px] uppercase tracking-widest rounded-xl transition-all">Link Node</button>
          </form>
        </div>
      </section>

      {/* Visibility */}
      <section className="glass-card-premium p-8 space-y-8">
        <h3 className="text-[9px] font-black uppercase tracking-widest text-gray-500">Public Visibility</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
          {platformMeta.map(p => (
            <button key={p.id} onClick={() => {
              const next = !formData.publicProfile[p.toggle];
              setFormData({ ...formData, publicProfile: { ...formData.publicProfile, [p.toggle]: next } });
              api.put("/user/profile", { publicProfile: { ...formData.publicProfile, [p.toggle]: next } });
            }} className={`p-4 rounded-xl border flex flex-col items-center gap-3 transition-all ${formData.publicProfile[p.toggle] ? "bg-white/10 border-white/10" : "opacity-30 border-white/5 grayscale"}`}>
              <p.icon className={`text-xl ${p.color}`} />
              <div className="text-[8px] font-black uppercase tracking-tighter text-white">{p.label}</div>
            </button>
          ))}
        </div>
      </section>

      {/* Danger Zone */}
      <section className="p-8 bg-red-600/5 border border-red-500/10 rounded-3xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <h3 className="text-xl font-black text-red-500 italic tracking-tighter uppercase">Danger Zone</h3>
          <p className="text-[9px] font-black text-gray-500 uppercase tracking-widest">Permanent account termination sequence</p>
        </div>
        <button onClick={() => setDialog({ open: true })} className="px-8 py-3 bg-red-600/10 hover:bg-red-600 text-red-500 hover:text-white transition-all text-[10px] font-black uppercase tracking-widest rounded-xl border border-red-500/20">Delete Profile</button>
      </section>

      <Dialog open={dialog.open} title="Erase Record?" message="All platform stats, contest history, and identity data will be purged. This action is terminal." confirmText="Purge Now" cancelText="Abort" onConfirm={async () => { await api.delete("/user/account"); logout(); }} onCancel={() => setDialog({ open: false })} />
    </div>
  );
}
