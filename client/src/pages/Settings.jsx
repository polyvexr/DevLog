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
    socials: [], // Array of { platform, username }
    publicProfile: {
      enabled: true, // Force enabled or just keep as is without UI
      username: "",
      showLeetCode: true,
      showCodeforces: true,
      showGitHub: true,
      showCodeChef: true,
      showAtCoder: true
    },
    currentPassword: "",
    newPassword: ""
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
        socials: u.profile?.socials || [],
        publicProfile: {
          enabled: u.publicProfile?.enabled ?? true,
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
      location: formData.location, website: formData.website,
      socials: formData.socials
    }, "put", "Profile updated successfully").then(() => setIsEditing(false));
  };

  const updateVisibility = () => {
    handleAction("/user/profile", { publicProfile: formData.publicProfile }, "put", "Platform visibility updated");
  };

  const updatePassword = (e) => {
    e.preventDefault();
    handleAction("/user/password", {
      currentPassword: formData.currentPassword,
      newPassword: formData.newPassword
    }, "put", "Password updated successfully").then(() => {
      setFormData(p => ({ ...p, currentPassword: "", newPassword: "" }));
    });
  };

  const addSocial = () => {
    setFormData(prev => ({
      ...prev,
      socials: [...prev.socials, { platform: "twitter", username: "" }]
    }));
  };

  const updateSocial = (index, field, value) => {
    const newSocials = [...formData.socials];
    newSocials[index][field] = value;
    setFormData(prev => ({ ...prev, socials: newSocials }));
  };

  const removeSocial = (index) => {
    setFormData(prev => ({
      ...prev,
      socials: prev.socials.filter((_, i) => i !== index)
    }));
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
      <div className="flex items-center justify-between mb-8 fade-in-scale">
        <button
          onClick={() => navigate("/")}
          className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-white transition-all hover:bg-blue-600 hover:border-blue-500 hover:-translate-x-1 group shadow-xl active:scale-95"
          title="Back to Dashboard"
        >
          <svg
            className="w-5 h-5 group-hover:-translate-x-0.5 transition-transform"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={3}
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>
      </div>

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
              <h2 className="text-xl font-black text-white italic tracking-tighter uppercase">Profile Details</h2>
              <p className="text-[9px] font-black text-gray-500 uppercase tracking-widest">Update your public information</p>
            </div>
          </div>
          <button onClick={() => setIsEditing(!isEditing)} className={`p-2.5 rounded-lg transition-all border ${isEditing ? "bg-red-500/10 border-red-500/20 text-red-500" : "bg-blue-600/10 border-blue-500/20 text-blue-400"}`}>
            {isEditing ? <FiX size={18} /> : <FiEdit3 size={18} />}
          </button>
        </div>

        <form onSubmit={updateProfile} className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              { label: "Full Name", icon: FiUser, key: "name", disabled: !isEditing },
              { label: "Email Address", icon: FiMail, key: "email", value: user?.email, disabled: true },
              { label: "Location", icon: FiMapPin, key: "location", disabled: !isEditing, placeholder: "City, Country" },
              { label: "Personal Website", icon: FiLink, key: "website", disabled: !isEditing, placeholder: "https://yourportfolio.com" },
            ].map((f) => (
              <div key={f.label} className="space-y-2">
                <label className="text-[9px] font-black uppercase tracking-widest text-gray-500 ml-1">{f.label}</label>
                <div className="relative">
                  <f.icon className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600" />
                  <input
                    type="text" disabled={f.disabled}
                    placeholder={f.placeholder}
                    className="w-full pl-12 pr-4 py-3.5 bg-white/5 border border-white/5 rounded-xl text-white font-bold outline-none focus:ring-1 focus:ring-blue-500/40 disabled:opacity-30 placeholder-gray-700"
                    value={f.value !== undefined ? f.value : formData[f.key]}
                    onChange={(e) => setFormData({ ...formData, [f.key]: e.target.value })}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-[9px] font-black uppercase tracking-widest text-gray-500 ml-1">Social Profiles</label>
              {isEditing && (
                <button
                  type="button"
                  onClick={addSocial}
                  className="px-3 py-1 bg-blue-600/10 border border-blue-500/20 text-blue-400 text-[8px] font-black uppercase tracking-widest rounded-lg hover:bg-blue-600 hover:text-white transition-all"
                >
                  + Add Profile
                </button>
              )}
            </div>
            <div className="space-y-3">
              {formData.socials.map((social, index) => (
                <div key={index} className="flex gap-3">
                  <select
                    disabled={!isEditing}
                    className="w-1/3 px-4 py-3 bg-white/5 border border-white/5 rounded-xl text-white font-bold outline-none focus:ring-1 focus:ring-blue-500/40 disabled:opacity-30 appearance-none cursor-pointer"
                    value={social.platform}
                    onChange={(e) => updateSocial(index, "platform", e.target.value)}
                  >
                    <option value="twitter">Twitter</option>
                    <option value="linkedin">LinkedIn</option>
                    <option value="github">GitHub</option>
                    <option value="instagram">Instagram</option>
                    <option value="facebook">Facebook</option>
                    <option value="youtube">YouTube</option>
                    <option value="other">Other</option>
                  </select>
                  <div className="relative flex-1">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600 font-bold text-xs">@</div>
                    <input
                      type="text" disabled={!isEditing}
                      placeholder="username"
                      className="w-full pl-10 pr-10 py-3.5 bg-white/5 border border-white/5 rounded-xl text-white font-bold outline-none focus:ring-1 focus:ring-blue-500/40 disabled:opacity-30 placeholder-gray-700"
                      value={social.username}
                      onChange={(e) => updateSocial(index, "username", e.target.value)}
                    />
                    {isEditing && (
                      <button
                        type="button"
                        onClick={() => removeSocial(index)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-red-500/50 hover:text-red-500 transition-colors"
                      >
                        <FiTrash2 size={16} />
                      </button>
                    )}
                  </div>
                </div>
              ))}
              {formData.socials.length === 0 && !isEditing && (
                <p className="text-[10px] text-gray-600 font-bold uppercase tracking-widest px-1 italic">No social profiles linked</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[9px] font-black uppercase tracking-widest text-gray-500 ml-1">About You</label>
            <div className="relative">
              <FiFileText className="absolute left-4 top-4 text-gray-600" />
              <textarea
                disabled={!isEditing} rows={3}
                placeholder="Write a short bio about your coding journey..."
                className="w-full pl-12 pr-4 py-3.5 bg-white/5 border border-white/5 rounded-xl text-white font-medium outline-none focus:ring-1 focus:ring-blue-500/40 disabled:opacity-30 resize-none placeholder-gray-700"
                value={formData.bio} onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              />
            </div>
          </div>
          {isEditing && (
            <button type="submit" className="w-full py-4 bg-blue-600 hover:bg-blue-500 text-white font-black text-[10px] uppercase tracking-[0.3em] rounded-xl transition-all shadow-lg active:scale-95 flex items-center justify-center gap-2">
              <FiSave size={16} /> Save Changes
            </button>
          )}
        </form>
      </section>

      {/* 2. Privacy & Shared Profile Section */}
      <section className="glass-card-premium p-8 md:p-10 space-y-8">
        <div className="flex items-center gap-4 border-b border-white/5 pb-6">
          <div className="w-10 h-10 rounded-xl bg-cyan-500/10 flex items-center justify-center border border-cyan-500/20 text-cyan-400">
            <FiGlobe size={20} />
          </div>
          <div>
            <h2 className="text-xl font-black text-white italic tracking-tighter uppercase">Privacy Settings</h2>
            <p className="text-[9px] font-black text-gray-500 uppercase tracking-widest">Manage your public profile visibility</p>
          </div>
        </div>

        <div className="space-y-8">
          <div className="space-y-4">
            <label className="text-[9px] font-black uppercase tracking-widest text-gray-500 ml-1">Visible Platforms</label>
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
          </div>

          <button onClick={updateVisibility} className="w-full py-4 bg-cyan-600 hover:bg-cyan-500 text-white font-black text-[10px] uppercase tracking-[0.3em] rounded-xl transition-all shadow-lg active:scale-95">
            Update Privacy Preferences
          </button>
        </div>
      </section>

      {/* 3. Password Section */}
      <section className="glass-card-premium p-8 md:p-10 space-y-8">
        <div className="flex items-center gap-4 border-b border-white/5 pb-6">
          <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center border border-purple-500/20 text-purple-400">
            <FiShield size={20} />
          </div>
          <div>
            <h2 className="text-xl font-black text-white italic tracking-tighter uppercase">Password Settings</h2>
            <p className="text-[9px] font-black text-gray-500 uppercase tracking-widest">Update your login credentials</p>
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
            Update Password
          </button>
        </form>
      </section>

      {/* 4. Support Section (New Feature) */}
      <section className="glass-card-premium p-8 md:p-10 space-y-6">
        <div className="flex items-center gap-4 border-b border-white/5 pb-6">
          <div className="w-10 h-10 rounded-xl bg-orange-500/10 flex items-center justify-center border border-orange-500/20 text-orange-400">
            <FiAlertCircle size={20} />
          </div>
          <div>
            <h2 className="text-xl font-black text-white italic tracking-tighter uppercase">Support & Feedback</h2>
            <p className="text-[9px] font-black text-gray-500 uppercase tracking-widest">Need help or found a bug?</p>
          </div>
        </div>
        <p className="text-gray-400 text-sm font-medium leading-relaxed">
          If you are experiencing issues with platform synchronization or have suggestions for new features, please reach out to our team.
        </p>
        <div className="flex gap-4">
          <a href="mailto:shankar.l5252@gmail.com" className="px-6 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white font-black text-[10px] uppercase tracking-widest hover:bg-white/10 transition-all flex items-center gap-2">
            <FiMail /> Contact Support
          </a>
        </div>
      </section>

      {/* 5. Danger Zone */}
      <section className="p-8 md:p-10 bg-red-500/[0.03] border border-red-500/10 rounded-[2.5rem] space-y-6">
        <div className="flex items-center gap-4">
          <FiAlertCircle size={24} className="text-red-500" />
          <h2 className="text-xl font-black text-red-500 italic uppercase tracking-tighter">Danger Zone</h2>
        </div>
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 bg-red-500/5 p-6 rounded-2xl border border-red-500/10">
          <div className="space-y-1">
            <div className="font-black text-white text-[11px] uppercase tracking-widest">Delete Account</div>
            <div className="text-[10px] text-gray-500 font-medium">Permanently remove all your account data. This cannot be undone.</div>
          </div>
          <button onClick={() => setDeleteDialogOpen(true)} className="px-8 py-3 bg-red-600/10 hover:bg-red-600 text-red-500 hover:text-white text-[9px] font-black uppercase tracking-widest rounded-xl transition-all active:scale-95 border border-red-500/20">
            Delete Profile
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
