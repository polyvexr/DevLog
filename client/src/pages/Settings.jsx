import { useState, useEffect, useContext } from "react";
import api from "../api/axios";
import { AuthContext } from "../context/AuthContext";
import FullPageLoader from "../components/FullPageLoader";
import Dialog from "../components/Dialog";
import {
  FiUser, FiMail, FiLock, FiTrash2, FiEdit3, FiSave, FiX, FiShield,
  FiEye, FiEyeOff, FiGlobe, FiMapPin, FiLink, FiFileText, FiCheckCircle,
  FiAlertCircle
} from "react-icons/fi";

export default function Settings() {
  const { logout, refreshUser } = useContext(AuthContext);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState({ type: "", message: "" });
  const [isEditing, setIsEditing] = useState(false);
  const [showPass, setShowPass] = useState({ current: false, new: false });
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    name: "", bio: "", location: "", website: "",
    publicProfile: {
      enabled: false, username: "",
      showLeetCode: true, showCodeforces: true, showGitHub: true,
      showCodeChef: true, showAtCoder: true
    },
    currentPassword: "", newPassword: ""
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await api.get("/user/profile");
      const u = res.data.data?.user || res.data.user;
      setUser(u);
      setFormData(prev => ({
        ...prev,
        name: u.name || "",
        bio: u.profile?.bio || "",
        location: u.profile?.location || "",
        website: u.profile?.website || "",
        publicProfile: {
          enabled: u.publicProfile?.enabled || false,
          username: u.publicProfile?.username || u.email?.split('@')[0] || "",
          showLeetCode: u.publicProfile?.showLeetCode ?? true,
          showCodeforces: u.publicProfile?.showCodeforces ?? true,
          showGitHub: u.publicProfile?.showGitHub ?? true,
          showCodeChef: u.publicProfile?.showCodeChef ?? true,
          showAtCoder: u.publicProfile?.showAtCoder ?? true
        }
      }));
    } catch {
      showStatus("error", "Failed to fetch profile");
    } finally {
      setLoading(false);
    }
  };

  const showStatus = (type, message) => {
    setStatus({ type, message });
    setTimeout(() => setStatus({ type: "", message: "" }), 5000);
  };

  const handleAction = async (endpoint, data, method = "put", successMsg) => {
    try {
      const res = await api[method](endpoint, data);
      if (res.data.success) {
        showStatus("success", successMsg);
        if (refreshUser) refreshUser();
        return res.data;
      }
    } catch (err) {
      showStatus("error", err.response?.data?.message || "Operation failed");
    }
  };

  const updateProfile = (e) => {
    e.preventDefault();
    handleAction("/user/profile", {
      name: formData.name, bio: formData.bio,
      location: formData.location, website: formData.website
    }, "put", "Profile updated").then(() => setIsEditing(false));
  };

  const updateVisibility = () => {
    handleAction("/user/profile", { publicProfile: formData.publicProfile }, "put", "Visibility updated");
  };

  const updatePassword = (e) => {
    e.preventDefault();
    handleAction("/user/password", {
      currentPassword: formData.currentPassword,
      newPassword: formData.newPassword
    }, "put", "Password changed").then(() => {
      setFormData(p => ({ ...p, currentPassword: "", newPassword: "" }));
    });
  };

  if (loading) return <FullPageLoader />;

  const platforms = [
    { id: "showLeetCode", label: "LeetCode", color: "text-yellow-500" },
    { id: "showCodeforces", label: "Codeforces", color: "text-blue-500" },
    { id: "showGitHub", label: "GitHub", color: "text-white" },
    { id: "showCodeChef", label: "CodeChef", color: "text-amber-600" },
    { id: "showAtCoder", label: "AtCoder", color: "text-cyan-500" },
  ];

  return (
    <div className="max-w-4xl mx-auto py-12 px-6 space-y-12">
      {/* Header & Notification */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 fade-in-scale">
        <h1 className="text-4xl md:text-5xl font-black text-white italic tracking-tighter">
          Account <span className="animate-text-shine">Settings</span>
        </h1>
        {status.message && (
          <div className={`p-4 rounded-xl flex items-center gap-3 glass-card-premium border-none ring-1 ${status.type === "error" ? "ring-red-500/30 text-red-400" : "ring-green-500/30 text-green-400"}`}>
            {status.type === "error" ? <FiAlertCircle /> : <FiCheckCircle />}
            <span className="text-[10px] font-black uppercase tracking-widest">{status.message}</span>
          </div>
        )}
      </div>

      {/* 1. Profile Section */}
      <section className="glass-card-premium p-8 md:p-10 space-y-8 relative overflow-hidden">
        <div className="flex items-center justify-between border-b border-white/5 pb-6">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center border border-blue-500/20 text-blue-400">
              <FiUser size={20} />
            </div>
            <div>
              <h2 className="text-xl font-black text-white italic tracking-tighter uppercase">Core Identity</h2>
              <p className="text-[9px] font-black text-gray-500 uppercase tracking-widest">Personal Profile Parameters</p>
            </div>
          </div>
          <button onClick={() => setIsEditing(!isEditing)} className={`p-2.5 rounded-lg transition-all border ${isEditing ? "bg-red-500/10 border-red-500/20 text-red-500" : "bg-blue-600/10 border-blue-500/20 text-blue-400"}`}>
            {isEditing ? <FiX size={18} /> : <FiEdit3 size={18} />}
          </button>
        </div>

        <form onSubmit={updateProfile} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[
            { label: "Full Name", icon: FiUser, key: "name", disabled: !isEditing },
            { label: "Email", icon: FiMail, key: "email", value: user?.email, disabled: true },
            { label: "Geo Location", icon: FiMapPin, key: "location", disabled: !isEditing },
            { label: "Digital Link", icon: FiLink, key: "website", disabled: !isEditing },
          ].map((f) => (
            <div key={f.label} className="space-y-2">
              <label className="text-[9px] font-black uppercase tracking-widest text-gray-500 ml-1">{f.label}</label>
              <div className="relative">
                <f.icon className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600" />
                <input
                  type="text" disabled={f.disabled}
                  className="w-full pl-12 pr-4 py-3.5 bg-white/5 border border-white/5 rounded-xl text-white font-bold outline-none focus:ring-1 focus:ring-blue-500/40 disabled:opacity-30"
                  value={f.value !== undefined ? f.value : formData[f.key]}
                  onChange={(e) => setFormData({ ...formData, [f.key]: e.target.value })}
                />
              </div>
            </div>
          ))}
          <div className="md:col-span-2 space-y-2">
            <label className="text-[9px] font-black uppercase tracking-widest text-gray-500 ml-1">Biography</label>
            <div className="relative">
              <FiFileText className="absolute left-4 top-4 text-gray-600" />
              <textarea
                disabled={!isEditing} rows={3}
                className="w-full pl-12 pr-4 py-3.5 bg-white/5 border border-white/5 rounded-xl text-white font-medium outline-none focus:ring-1 focus:ring-blue-500/40 disabled:opacity-30 resize-none"
                value={formData.bio} onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              />
            </div>
          </div>
          {isEditing && (
            <button type="submit" className="md:col-span-2 py-4 bg-blue-600 hover:bg-blue-500 text-white font-black text-[10px] uppercase tracking-[0.3em] rounded-xl transition-all shadow-lg active:scale-95 flex items-center justify-center gap-2">
              <FiSave size={16} /> Save Changes
            </button>
          )}
        </form>
      </section>

      {/* 2. Public Visibility Section */}
      <section className="glass-card-premium p-8 md:p-10 space-y-8">
        <div className="flex items-center gap-4 border-b border-white/5 pb-6">
          <div className="w-10 h-10 rounded-xl bg-cyan-500/10 flex items-center justify-center border border-cyan-500/20 text-cyan-400">
            <FiGlobe size={20} />
          </div>
          <div>
            <h2 className="text-xl font-black text-white italic tracking-tighter uppercase">Visibility</h2>
            <p className="text-[9px] font-black text-gray-500 uppercase tracking-widest">Public Registry Control</p>
          </div>
        </div>

        <div className="space-y-8">
          <div className="flex items-center justify-between p-6 bg-white/5 rounded-2xl border border-white/10">
            <div className="space-y-1">
              <div className="font-black text-white text-[11px] uppercase tracking-widest">Public Profile</div>
              <div className="text-[10px] text-gray-500 font-medium">Allow global access at devlog.io/u/{formData.publicProfile.username}</div>
            </div>
            <button
              onClick={() => setFormData({ ...formData, publicProfile: { ...formData.publicProfile, enabled: !formData.publicProfile.enabled } })}
              className={`w-14 h-7 rounded-full transition-all relative ${formData.publicProfile.enabled ? "bg-cyan-600 shadow-lg" : "bg-white/10"}`}
            >
              <div className={`absolute top-1 w-5 h-5 rounded-full bg-white transition-all ${formData.publicProfile.enabled ? "left-8" : "left-1"}`} />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {platforms.map((p) => (
              <button
                key={p.id}
                onClick={() => setFormData({ ...formData, publicProfile: { ...formData.publicProfile, [p.id]: !formData.publicProfile[p.id] } })}
                className={`p-4 rounded-xl flex items-center justify-between border transition-all ${formData.publicProfile[p.id] ? "bg-white/10 border-white/10" : "opacity-40 border-white/5"}`}
              >
                <span className={`font-black text-[9px] uppercase tracking-widest ${p.color}`}>{p.label}</span>
                <div className={`w-1.5 h-1.5 rounded-full ${formData.publicProfile[p.id] ? "bg-cyan-500 shadow-[0_0_8px_cyan]" : "bg-gray-700"}`} />
              </button>
            ))}
          </div>

          <button onClick={updateVisibility} className="w-full py-4 bg-cyan-600 hover:bg-cyan-500 text-white font-black text-[10px] uppercase tracking-[0.3em] rounded-xl transition-all shadow-lg active:scale-95">
            Update Registry Data
          </button>
        </div>
      </section>

      {/* 3. Security Section */}
      <section className="glass-card-premium p-8 md:p-10 space-y-8">
        <div className="flex items-center gap-4 border-b border-white/5 pb-6">
          <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center border border-purple-500/20 text-purple-400">
            <FiShield size={20} />
          </div>
          <div>
            <h2 className="text-xl font-black text-white italic tracking-tighter uppercase">Security</h2>
            <p className="text-[9px] font-black text-gray-500 uppercase tracking-widest">Authentication Parameters</p>
          </div>
        </div>

        <form onSubmit={updatePassword} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[
            { label: "Current Password", key: "currentPassword", show: showPass.current, toggle: () => setShowPass({ ...showPass, current: !showPass.current }) },
            { label: "New Password", key: "newPassword", show: showPass.new, toggle: () => setShowPass({ ...showPass, new: !showPass.new }) },
          ].map((f) => (
            <div key={f.key} className="space-y-2">
              <label className="text-[9px] font-black uppercase tracking-widest text-gray-500 ml-1">{f.label}</label>
              <div className="relative">
                <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600" />
                <input
                  type={f.show ? "text" : "password"} required
                  className="w-full pl-12 pr-12 py-3.5 bg-white/5 border border-white/5 rounded-xl text-white font-bold outline-none focus:ring-1 focus:ring-purple-500/40"
                  value={formData[f.key]} onChange={(e) => setFormData({ ...formData, [f.key]: e.target.value })}
                />
                <button type="button" onClick={f.toggle} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-600 hover:text-white">
                  {f.show ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                </button>
              </div>
            </div>
          ))}
          <button type="submit" className="md:col-span-2 py-4 border border-white/10 hover:bg-white/5 text-white font-black text-[10px] uppercase tracking-[0.3em] rounded-xl transition-all active:scale-95">
            Commit Security Update
          </button>
        </form>
      </section>

      {/* 4. Danger Zone */}
      <section className="p-8 md:p-10 bg-red-500/[0.03] border border-red-500/10 rounded-[2.5rem] space-y-6">
        <div className="flex items-center gap-4">
          <FiAlertCircle size={24} className="text-red-500" />
          <h2 className="text-xl font-black text-red-500 italic uppercase tracking-tighter">Danger Zone</h2>
        </div>
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 bg-red-500/5 p-6 rounded-2xl border border-red-500/10">
          <div className="space-y-1">
            <div className="font-black text-white text-[11px] uppercase tracking-widest">Delete Account</div>
            <div className="text-[10px] text-gray-500 font-medium">Permanently wipe all your platform data and history.</div>
          </div>
          <button onClick={() => setDeleteDialogOpen(true)} className="px-8 py-3 bg-red-600/10 hover:bg-red-600 text-red-500 hover:text-white text-[9px] font-black uppercase tracking-widest rounded-xl transition-all active:scale-95 border border-red-500/20">
            Execute Purge
          </button>
        </div>
      </section>

      <Dialog
        open={deleteDialogOpen}
        title="Execute Purge?"
        message="This will permanently delete your account and all records. This action is irreversible."
        confirmText="Confirm Purge" cancelText="Abort"
        onConfirm={async () => { await api.delete("/user/account"); logout(); }}
        onCancel={() => setDeleteDialogOpen(false)}
      />
    </div>
  );
}
