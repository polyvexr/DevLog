import { useState, useEffect, useContext } from "react";
import api from "../api/axios";
import { AuthContext } from "../context/AuthContext";
import FullPageLoader from "../components/FullPageLoader";
import Dialog from "../components/Dialog";
import {
  FiUser,
  FiMail,
  FiLock,
  FiTrash2,
  FiEdit3,
  FiSave,
  FiX,
  FiShield,
  FiEye,
  FiEyeOff,
  FiSettings,
  FiGlobe,
  FiMapPin,
  FiLink,
  FiFileText,
  FiCheckCircle,
  FiAlertCircle,
  FiChevronRight
} from "react-icons/fi";

export default function Profile() {
  const { logout, refreshUser } = useContext(AuthContext);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [activeTab, setActiveTab] = useState("profile");

  // Update profile states
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [location, setLocation] = useState("");
  const [website, setWebsite] = useState("");

  // Password change states
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);

  // Settings states
  const [theme, setTheme] = useState("dark");

  // Public profile states
  const [publicProfileEnabled, setPublicProfileEnabled] = useState(false);
  const [publicUsername, setPublicUsername] = useState("");
  const [showLeetCode, setShowLeetCode] = useState(true);
  const [showCodeforces, setShowCodeforces] = useState(true);
  const [showGitHub, setShowGitHub] = useState(true);
  const [showCodeChef, setShowCodeChef] = useState(true);
  const [showAtCoder, setShowAtCoder] = useState(true);

  // Dialog states
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await api.get("/user/profile");
      const userData = res.data.data?.user || res.data.user;
      setUser(userData);
      setName(userData.name || "");
      setBio(userData.profile?.bio || "");
      setLocation(userData.profile?.location || "");
      setWebsite(userData.profile?.website || "");
      setTheme(userData.settings?.theme || "dark");

      setPublicProfileEnabled(userData.publicProfile?.enabled || false);

      // Use email prefix as default username if not set
      const emailPrefix = userData.email?.split('@')[0] || "";
      setPublicUsername(userData.publicProfile?.username || emailPrefix);

      setShowLeetCode(userData.publicProfile?.showLeetCode ?? true);
      setShowCodeforces(userData.publicProfile?.showCodeforces ?? true);
      setShowGitHub(userData.publicProfile?.showGitHub ?? true);
      setShowCodeChef(userData.publicProfile?.showCodeChef ?? true);
      setShowAtCoder(userData.publicProfile?.showAtCoder ?? true);
    } catch {
      setError("Failed to fetch profile");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setSuccess("");
    setError("");
    try {
      const res = await api.put("/user/profile", { name, bio, location, website });
      const userData = res.data.data?.user || res.data.user;
      setUser(userData);
      setIsEditing(false);
      setSuccess("Profile information updated");
      if (refreshUser) refreshUser();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update profile");
    }
  };

  const handleUpdateSettings = async () => {
    setSuccess("");
    setError("");
    try {
      await api.put("/user/settings", { theme });
      setSuccess("Account preferences updated");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update settings");
    }
  };

  const handleUpdatePublicProfile = async () => {
    setSuccess("");
    setError("");
    try {
      await api.put("/user/profile", {
        publicProfile: {
          enabled: publicProfileEnabled,
          username: publicUsername,
          showLeetCode,
          showCodeforces,
          showGitHub,
          showCodeChef,
          showAtCoder,
        }
      });
      setSuccess("Public visibility settings updated");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update public profile");
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setSuccess("");
    setError("");
    try {
      await api.put("/user/password", { currentPassword, newPassword });
      setCurrentPassword("");
      setNewPassword("");
      setSuccess("Your password has been changed");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update password");
    }
  };

  const handleDeleteAccount = async () => {
    try {
      await api.delete("/user/account");
      logout();
    } catch {
      setError("Failed to delete account");
    }
  };

  if (loading) return <FullPageLoader />;

  const tabs = [
    { id: "profile", label: "Profile Info", icon: FiUser },
    { id: "public", label: "Public Meta", icon: FiGlobe },
    { id: "security", label: "Security & Access", icon: FiShield },
    { id: "danger", label: "Danger Zone", icon: FiAlertCircle, color: "text-red-500" },
  ];

  const username = user?.email?.split('@')[0] || "User";

  return (
    <div className="max-w-6xl mx-auto py-12 px-6">
      {/* Dynamic Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-16 fade-in-scale">
        <div>
          <h1 className="text-4xl md:text-6xl font-black text-white italic tracking-tighter mb-2">
            Control <span className="animate-text-shine">Center</span>
          </h1>
          <p className="text-gray-500 font-medium flex items-center gap-2">
            Logged in as <span className="text-blue-400 font-black">@{username}</span>
          </p>
        </div>

        {/* Success/Error Notifications */}
        {(error || success) && (
          <div className={`p-4 rounded-xl flex items-center gap-4 transition-all duration-500 glass-card-premium ${error ? "border-red-500/30 bg-red-500/5 text-red-400" : "border-green-500/30 bg-green-500/5 text-green-400"
            }`}>
            {error ? <FiAlertCircle /> : <FiCheckCircle />}
            <span className="text-xs font-black uppercase tracking-widest">{error || success}</span>
            <button onClick={() => { setError(""); setSuccess(""); }} className="ml-4 opacity-50 hover:opacity-100 transition-opacity">
              <FiX />
            </button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-12 items-start">
        {/* Navigation Sidebar */}
        <div className="lg:col-span-1 space-y-2">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full group flex items-center justify-between px-6 py-4 rounded-2xl transition-all duration-300 ${isActive
                    ? "bg-white/10 ring-1 ring-white/10 text-white shadow-2xl"
                    : "hover:bg-white/5 text-gray-500 hover:text-gray-300"
                  }`}
              >
                <div className="flex items-center gap-4">
                  <Icon className={`text-xl ${isActive ? (tab.color || "text-blue-500") : "text-current"}`} />
                  <span className={`font-black text-[10px] uppercase tracking-[0.2em] ${isActive ? "opacity-100" : "opacity-60"}`}>
                    {tab.label}
                  </span>
                </div>
                {isActive && <FiChevronRight className="animate-bounce-x" />}
              </button>
            );
          })}
        </div>

        {/* Content Area */}
        <div className="lg:col-span-3">
          {activeTab === "profile" && (
            <div className="glass-card-premium p-10 fade-in-up border-none ring-1 ring-white/5 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 blur-3xl pointer-events-none"></div>

              <div className="flex items-center justify-between mb-12">
                <div>
                  <h2 className="text-2xl font-black text-white italic mb-1 uppercase tracking-tighter">Core Identity</h2>
                  <p className="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em]">Personal Profile Parameters</p>
                </div>
                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className={`p-3 rounded-xl transition-all border ${isEditing ? "bg-red-500/10 border-red-500/20 text-red-500" : "bg-blue-600/10 border-blue-500/20 text-blue-400 hover:bg-blue-600 hover:text-white"
                    }`}
                >
                  {isEditing ? <FiX size={20} /> : <FiEdit3 size={20} />}
                </button>
              </div>

              <form onSubmit={handleUpdateProfile} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <label className="text-[9px] font-black uppercase tracking-[0.3em] text-gray-500 ml-1">Full Name</label>
                    <div className="relative">
                      <FiUser className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-600" />
                      <input
                        type="text"
                        disabled={!isEditing}
                        className="w-full pl-14 pr-6 py-4 bg-white/5 border border-white/5 rounded-2xl text-white font-bold transition-all outline-none focus:ring-2 focus:ring-blue-500/30 disabled:opacity-30"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Neural Identity"
                      />
                    </div>
                  </div>
                  <div className="space-y-3">
                    <label className="text-[9px] font-black uppercase tracking-[0.3em] text-gray-500 ml-1">Terminal Address</label>
                    <div className="relative">
                      <FiMail className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-700" />
                      <input
                        type="email"
                        disabled
                        className="w-full pl-14 pr-6 py-4 bg-white/[0.02] border border-white/5 rounded-2xl text-gray-600 font-bold italic cursor-not-allowed"
                        value={user?.email || ""}
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-[9px] font-black uppercase tracking-[0.3em] text-gray-500 ml-1">Biography</label>
                  <div className="relative">
                    <FiFileText className="absolute left-5 top-5 text-gray-600" />
                    <textarea
                      disabled={!isEditing}
                      rows={3}
                      className="w-full pl-14 pr-6 py-4 bg-white/5 border border-white/5 rounded-2xl text-white font-medium transition-all outline-none focus:ring-2 focus:ring-blue-500/30 disabled:opacity-30 resize-none"
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                      placeholder="Transmission details..."
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <label className="text-[9px] font-black uppercase tracking-[0.3em] text-gray-500 ml-1">Geo Coordinates</label>
                    <div className="relative">
                      <FiMapPin className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-600" />
                      <input
                        type="text"
                        disabled={!isEditing}
                        className="w-full pl-14 pr-6 py-4 bg-white/5 border border-white/5 rounded-2xl text-white font-bold transition-all outline-none focus:ring-2 focus:ring-blue-500/30 disabled:opacity-30"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        placeholder="Node Location"
                      />
                    </div>
                  </div>
                  <div className="space-y-3">
                    <label className="text-[9px] font-black uppercase tracking-[0.3em] text-gray-500 ml-1">Digital Link</label>
                    <div className="relative">
                      <FiLink className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-600" />
                      <input
                        type="url"
                        disabled={!isEditing}
                        className="w-full pl-14 pr-6 py-4 bg-white/5 border border-white/5 rounded-2xl text-white font-bold transition-all outline-none focus:ring-2 focus:ring-blue-500/30 disabled:opacity-30"
                        value={website}
                        onChange={(e) => setWebsite(e.target.value)}
                        placeholder="https://yournode.io"
                      />
                    </div>
                  </div>
                </div>

                {isEditing && (
                  <button
                    type="submit"
                    className="w-full py-5 bg-blue-600 hover:bg-blue-500 text-white font-black text-xs uppercase tracking-[0.4em] rounded-2xl shadow-2xl shadow-blue-600/20 transition-all flex items-center justify-center gap-3 active:scale-[0.98]"
                  >
                    <FiSave size={18} /> Update Matrix
                  </button>
                )}
              </form>
            </div>
          )}

          {activeTab === "public" && (
            <div className="glass-card-premium p-10 fade-in-up border-none ring-1 ring-white/5">
              <div className="flex items-center justify-between mb-12">
                <div>
                  <h2 className="text-2xl font-black text-white italic mb-1 uppercase tracking-tighter">Visibility</h2>
                  <p className="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em]">Public Registry Control</p>
                </div>
                <div className={`w-3 h-3 rounded-full ${publicProfileEnabled ? "bg-cyan-500 shadow-[0_0_15px_rgba(6,182,212,0.5)]" : "bg-gray-800 animate-pulse"}`}></div>
              </div>

              <div className="space-y-10">
                {/* Toggle Master */}
                <div className="flex items-center justify-between p-8 bg-white/5 rounded-[2rem] border border-white/5">
                  <div className="flex items-center gap-5">
                    <div className="w-12 h-12 bg-cyan-600/10 rounded-2xl flex items-center justify-center border border-cyan-500/20">
                      <FiGlobe className="text-xl text-cyan-400" />
                    </div>
                    <div>
                      <div className="font-black text-white text-[11px] uppercase tracking-widest">Public Registry</div>
                      <div className="text-[10px] text-gray-500 font-medium">Allow global access to your coding history at /u/username</div>
                    </div>
                  </div>
                  <button
                    onClick={() => setPublicProfileEnabled(!publicProfileEnabled)}
                    className={`w-16 h-8 rounded-full transition-all duration-300 relative ${publicProfileEnabled ? "bg-cyan-600 shadow-lg" : "bg-white/10"}`}
                  >
                    <div className={`absolute top-1 w-6 h-6 rounded-full bg-white shadow-xl transition-all duration-300 ${publicProfileEnabled ? "left-9 shadow-cyan-500/50" : "left-1"}`} />
                  </button>
                </div>

                {publicProfileEnabled && (
                  <div className="space-y-10 fade-in-up">
                    <div className="space-y-4">
                      <label className="text-[9px] font-black uppercase tracking-[0.3em] text-gray-500 ml-1">Registry Handle</label>
                      <div className="relative group">
                        <span className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-600 font-black italic">devlog.io/u/</span>
                        <input
                          type="text"
                          className="w-full pl-[7.5rem] pr-6 py-5 bg-white/5 border border-white/5 rounded-2xl text-cyan-400 font-black tracking-widest outline-none focus:ring-2 focus:ring-cyan-500/30 transition-all"
                          value={publicUsername}
                          onChange={(e) => setPublicUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ""))}
                          placeholder="unique-id"
                        />
                      </div>
                    </div>

                    <div className="space-y-4">
                      <label className="text-[9px] font-black uppercase tracking-[0.3em] text-gray-500 ml-1">Protocol Visibility</label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {[
                          { id: "leetcode", label: "LeetCode", state: showLeetCode, setter: setShowLeetCode, color: "text-yellow-500" },
                          { id: "codeforces", label: "Codeforces", state: showCodeforces, setter: setShowCodeforces, color: "text-blue-500" },
                          { id: "github", label: "GitHub", state: showGitHub, setter: setShowGitHub, color: "text-white" },
                          { id: "codechef", label: "CodeChef", state: showCodeChef, setter: setShowCodeChef, color: "text-amber-600" },
                          { id: "atcoder", label: "AtCoder", state: showAtCoder, setter: setShowAtCoder, color: "text-cyan-500" },
                        ].map((node) => (
                          <button
                            key={node.id}
                            onClick={() => node.setter(!node.state)}
                            className={`p-5 rounded-2xl flex items-center justify-between transition-all border ${node.state ? "bg-white/10 border-white/10 ring-1 ring-white/10" : "bg-white/[0.02] border-white/5 opacity-50 gray-scale"
                              }`}
                          >
                            <span className={`font-black text-[9px] uppercase tracking-widest ${node.state ? "text-white" : "text-gray-500"}`}>{node.label}</span>
                            <div className={`w-2 h-2 rounded-full ${node.state ? "bg-cyan-500 shadow-[0_0_8px_rgba(6,182,212,0.8)]" : "bg-gray-800"}`}></div>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                <button
                  onClick={handleUpdatePublicProfile}
                  className="w-full py-5 bg-cyan-600 hover:bg-cyan-500 text-white font-black text-[10px] uppercase tracking-[0.4em] rounded-2xl shadow-2xl shadow-cyan-600/20 transition-all flex items-center justify-center gap-3 active:scale-[0.98]"
                >
                  <FiSave size={18} /> Update Visibility
                </button>
              </div>
            </div>
          )}

          {activeTab === "security" && (
            <div className="space-y-12">
              <div className="glass-card-premium p-10 fade-in-up border-none ring-1 ring-white/5">
                <div className="flex items-center justify-between mb-12">
                  <div>
                    <h2 className="text-2xl font-black text-white italic mb-1 uppercase tracking-tighter">Security</h2>
                    <p className="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em]">Access Authentication Protocols</p>
                  </div>
                  <FiShield size={32} className="text-purple-500/50" />
                </div>

                <form onSubmit={handleChangePassword} className="space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-3">
                      <label className="text-[9px] font-black uppercase tracking-[0.3em] text-gray-500 ml-1">Current Passcode</label>
                      <div className="relative group">
                        <FiLock className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-600" />
                        <input
                          type={showCurrent ? "text" : "password"}
                          required
                          className="w-full pl-14 pr-14 py-4 bg-white/5 border border-white/5 rounded-2xl text-white font-bold outline-none focus:ring-2 focus:ring-purple-500/30 transition-all placeholder-gray-800"
                          placeholder="••••••••"
                          value={currentPassword}
                          onChange={(e) => setCurrentPassword(e.target.value)}
                        />
                        <button
                          type="button"
                          onClick={() => setShowCurrent(!showCurrent)}
                          className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-600 hover:text-white transition-colors"
                        >
                          {showCurrent ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                        </button>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <label className="text-[9px] font-black uppercase tracking-[0.3em] text-gray-500 ml-1">Neural Sequence Update</label>
                      <div className="relative group">
                        <FiLock className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-600" />
                        <input
                          type={showNew ? "text" : "password"}
                          required
                          className="w-full pl-14 pr-14 py-4 bg-white/5 border border-white/5 rounded-2xl text-white font-bold outline-none focus:ring-2 focus:ring-purple-500/30 transition-all placeholder-gray-800"
                          placeholder="••••••••"
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                        />
                        <button
                          type="button"
                          onClick={() => setShowNew(!showNew)}
                          className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-600 hover:text-white transition-colors"
                        >
                          {showNew ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                        </button>
                      </div>
                    </div>
                  </div>
                  <button
                    type="submit"
                    className="w-full py-5 bg-white/5 border border-white/10 hover:bg-white/10 text-white font-black text-[10px] uppercase tracking-[0.4em] rounded-2xl transition-all shadow-xl active:scale-[0.98]"
                  >
                    Commit Sequence Change
                  </button>
                </form>
              </div>
            </div>
          )}

          {activeTab === "danger" && (
            <div className="glass-card-premium p-10 fade-in-up border-none ring-1 ring-red-500/10 bg-red-500/[0.02]">
              <div className="flex items-center justify-between mb-12">
                <div>
                  <h2 className="text-2xl font-black text-red-500 italic mb-1 uppercase tracking-tighter">Danger Zone</h2>
                  <p className="text-[10px] font-black text-red-500/50 uppercase tracking-[0.3em]">Destructive Node Termination</p>
                </div>
                <FiAlertCircle size={32} className="text-red-500/50 animate-pulse" />
              </div>

              <div className="p-8 rounded-[2rem] bg-red-500/5 border border-red-500/10 space-y-8">
                <div className="flex items-start gap-5">
                  <FiTrash2 className="text-2xl text-red-500 mt-1" />
                  <div>
                    <h4 className="text-white font-black text-[11px] uppercase tracking-widest mb-2">Neural Link Purge</h4>
                    <p className="text-[10px] text-gray-600 font-medium leading-relaxed max-w-lg">
                      Initiating this sequence will permanently wipe all connected platform data, history, and your authentication record. THIS ACTION IS IRREVERSIBLE.
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setDeleteDialogOpen(true)}
                  className="w-full py-5 bg-red-600/10 hover:bg-red-600 text-red-500 hover:text-white font-black text-[10px] uppercase tracking-[0.4em] rounded-2xl border border-red-500/20 transition-all active:scale-[0.98] shadow-2xl shadow-red-600/5"
                >
                  Execute Purge Protocol
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <Dialog
        open={deleteDialogOpen}
        title="Execute Purge Protocol?"
        message="This will permanently delete your account and all associated platform history. You cannot undo this action."
        confirmText="Confirm Purge"
        cancelText="Abort"
        onConfirm={handleDeleteAccount}
        onCancel={() => setDeleteDialogOpen(false)}
      />
    </div>
  );
}
