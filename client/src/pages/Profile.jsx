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
  FiBell,
  FiSun,
  FiMoon,
  FiMonitor,
  FiMapPin,
  FiLink,
  FiFileText,
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
      setPublicUsername(userData.publicProfile?.username || "");
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
      setSuccess("Profile updated successfully");
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
      setSuccess("Settings updated successfully");
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
      setSuccess("Public profile updated successfully");
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
      setSuccess("Password updated successfully");
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
    { id: "profile", label: "Profile", icon: FiUser },
    { id: "settings", label: "Settings", icon: FiSettings },
    { id: "public", label: "Public Profile", icon: FiGlobe },
    { id: "security", label: "Security", icon: FiShield },
  ];

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <div className="mb-12 fade-in-scale">
        <h1 className="text-5xl md:text-7xl font-black mb-4 tracking-tight">
          <span className="text-white opacity-90">System</span>
          <br />
          <span className="animate-text-shine inline-block">Configuration</span>
        </h1>
        <p className="text-gray-400 text-xl font-medium">Manage your profile, settings, and security.</p>
      </div>

      {(error || success) && (
        <div className={`mb-10 p-6 rounded-2xl flex items-center gap-4 animate-fade-in glass-card-premium ${error ? "ring-1 ring-red-500/50 text-red-400" : "ring-1 ring-green-500/50 text-green-400"
          }`}>
          <div className={`w-3 h-3 rounded-full animate-pulse ${error ? "bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]" : "bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]"}`} />
          <span className="font-bold tracking-wide">{error || success}</span>
          <button
            onClick={() => { setError(""); setSuccess(""); }}
            className="ml-auto text-gray-500 hover:text-white"
          >
            <FiX />
          </button>
        </div>
      )}

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 mb-10 fade-in-up">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-5 py-3 rounded-xl flex items-center gap-3 transition-all ${activeTab === tab.id
                  ? "bg-white/10 ring-2 ring-blue-500/30 text-white"
                  : "bg-white/5 hover:bg-white/10 text-gray-400"
                }`}
            >
              <Icon className="w-5 h-5" />
              <span className="font-bold">{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Profile Tab */}
      {activeTab === "profile" && (
        <section className="glass-card-premium p-10 space-y-8 fade-in-up border-none ring-1 ring-white/5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <div className="w-16 h-16 bg-blue-600/10 rounded-2xl flex items-center justify-center border border-blue-500/20 shadow-inner">
                <FiUser className="text-3xl text-blue-500" />
              </div>
              <div>
                <h2 className="text-2xl font-black text-white italic">Identity Matrix</h2>
                <p className="text-xs font-black uppercase tracking-widest text-gray-500">Core Profile Parameters</p>
              </div>
            </div>
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="p-4 bg-white/5 hover:bg-white/10 text-white rounded-2xl transition-all active:scale-95 border border-white/5 shadow-xl"
            >
              {isEditing ? <FiX className="text-xl" /> : <FiEdit3 className="text-xl" />}
            </button>
          </div>

          <form onSubmit={handleUpdateProfile} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 ml-1">Name</label>
                <div className="relative group">
                  <FiUser className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-blue-500 transition-colors" />
                  <input
                    type="text"
                    disabled={!isEditing}
                    className="w-full pl-14 pr-6 py-4 bg-white/5 border border-white/5 rounded-2xl text-white font-bold disabled:opacity-40 transition-all outline-none focus:ring-2 focus:ring-blue-500/30 focus:bg-white/10 placeholder-gray-600"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
              </div>
              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 ml-1">Email</label>
                <div className="relative">
                  <FiMail className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-500" />
                  <input
                    type="email"
                    disabled
                    className="w-full pl-14 pr-6 py-4 bg-white/[0.02] border border-white/5 rounded-2xl text-gray-600 font-bold cursor-not-allowed italic"
                    value={user?.email || ""}
                  />
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 ml-1">Bio</label>
              <div className="relative group">
                <FiFileText className="absolute left-5 top-4 text-gray-500 group-focus-within:text-blue-500 transition-colors" />
                <textarea
                  disabled={!isEditing}
                  rows={3}
                  className="w-full pl-14 pr-6 py-4 bg-white/5 border border-white/5 rounded-2xl text-white font-medium disabled:opacity-40 transition-all outline-none focus:ring-2 focus:ring-blue-500/30 focus:bg-white/10 placeholder-gray-600 resize-none"
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Tell us about yourself..."
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 ml-1">Location</label>
                <div className="relative group">
                  <FiMapPin className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-blue-500 transition-colors" />
                  <input
                    type="text"
                    disabled={!isEditing}
                    className="w-full pl-14 pr-6 py-4 bg-white/5 border border-white/5 rounded-2xl text-white font-bold disabled:opacity-40 transition-all outline-none focus:ring-2 focus:ring-blue-500/30 focus:bg-white/10 placeholder-gray-600"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="Your city"
                  />
                </div>
              </div>
              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 ml-1">Website</label>
                <div className="relative group">
                  <FiLink className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-blue-500 transition-colors" />
                  <input
                    type="url"
                    disabled={!isEditing}
                    className="w-full pl-14 pr-6 py-4 bg-white/5 border border-white/5 rounded-2xl text-white font-bold disabled:opacity-40 transition-all outline-none focus:ring-2 focus:ring-blue-500/30 focus:bg-white/10 placeholder-gray-600"
                    value={website}
                    onChange={(e) => setWebsite(e.target.value)}
                    placeholder="https://yourwebsite.com"
                  />
                </div>
              </div>
            </div>

            {isEditing && (
              <button
                type="submit"
                className="w-full py-5 bg-blue-600 hover:bg-blue-500 text-white font-black text-lg rounded-2xl shadow-xl shadow-blue-500/20 transition-all flex items-center justify-center gap-3 active:scale-[0.98]"
              >
                <FiSave className="text-xl" /> Save Profile
              </button>
            )}
          </form>
        </section>
      )}

      {/* Settings Tab */}
      {activeTab === "settings" && (
        <section className="glass-card-premium p-10 space-y-8 fade-in-up border-none ring-1 ring-white/5">
          <div className="flex items-center gap-6">
            <div className="w-16 h-16 bg-purple-600/10 rounded-2xl flex items-center justify-center border border-purple-500/20 shadow-inner">
              <FiSettings className="text-3xl text-purple-500" />
            </div>
            <div>
              <h2 className="text-2xl font-black text-white italic">Preferences</h2>
              <p className="text-xs font-black uppercase tracking-widest text-gray-500">Customize Your Experience</p>
            </div>
          </div>

          <div className="space-y-8">
            {/* Theme */}
            <div className="space-y-4">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 ml-1">Theme</label>
              <div className="grid grid-cols-3 gap-4">
                {[
                  { id: "light", icon: FiSun, label: "Light" },
                  { id: "dark", icon: FiMoon, label: "Dark" },
                  { id: "system", icon: FiMonitor, label: "System" },
                ].map((option) => {
                  const Icon = option.icon;
                  return (
                    <button
                      key={option.id}
                      type="button"
                      onClick={() => setTheme(option.id)}
                      className={`p-4 rounded-xl flex flex-col items-center gap-2 transition-all ${theme === option.id
                          ? "bg-purple-500/20 ring-2 ring-purple-500/50"
                          : "bg-white/5 hover:bg-white/10"
                        }`}
                    >
                      <Icon className={`w-6 h-6 ${theme === option.id ? "text-purple-400" : "text-gray-500"}`} />
                      <span className={`text-sm font-bold ${theme === option.id ? "text-white" : "text-gray-400"}`}>
                        {option.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>



            <button
              type="button"
              onClick={handleUpdateSettings}
              className="w-full py-5 bg-purple-600 hover:bg-purple-500 text-white font-black text-lg rounded-2xl shadow-xl shadow-purple-500/20 transition-all flex items-center justify-center gap-3 active:scale-[0.98]"
            >
              <FiSave className="text-xl" /> Save Settings
            </button>
          </div>
        </section>
      )}

      {/* Public Profile Tab */}
      {activeTab === "public" && (
        <section className="glass-card-premium p-10 space-y-8 fade-in-up border-none ring-1 ring-white/5">
          <div className="flex items-center gap-6">
            <div className="w-16 h-16 bg-cyan-600/10 rounded-2xl flex items-center justify-center border border-cyan-500/20 shadow-inner">
              <FiGlobe className="text-3xl text-cyan-500" />
            </div>
            <div>
              <h2 className="text-2xl font-black text-white italic">Public Profile</h2>
              <p className="text-xs font-black uppercase tracking-widest text-gray-500">Share Your Progress</p>
            </div>
          </div>

          <div className="space-y-8">
            {/* Enable Public Profile */}
            <div className="flex items-center justify-between p-6 bg-white/5 rounded-2xl">
              <div className="flex items-center gap-4">
                <FiGlobe className="w-6 h-6 text-cyan-400" />
                <div>
                  <div className="font-bold text-white">Enable Public Profile</div>
                  <div className="text-sm text-gray-500">Allow others to view your stats at /u/username</div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setPublicProfileEnabled(!publicProfileEnabled)}
                className={`w-14 h-8 rounded-full transition-all ${publicProfileEnabled ? "bg-cyan-500" : "bg-white/20"
                  }`}
              >
                <div
                  className={`w-6 h-6 rounded-full bg-white shadow-lg transition-transform ${publicProfileEnabled ? "translate-x-7" : "translate-x-1"
                    }`}
                />
              </button>
            </div>

            {publicProfileEnabled && (
              <>
                {/* Username */}
                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 ml-1">
                    Public Username
                  </label>
                  <div className="relative group">
                    <span className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-500 font-bold">/u/</span>
                    <input
                      type="text"
                      className="w-full pl-14 pr-6 py-4 bg-white/5 border border-white/5 rounded-2xl text-white font-bold transition-all outline-none focus:ring-2 focus:ring-cyan-500/30 focus:bg-white/10 placeholder-gray-600"
                      value={publicUsername}
                      onChange={(e) => setPublicUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ""))}
                      placeholder="your-username"
                    />
                  </div>
                </div>

                {/* Platform Visibility */}
                <div className="space-y-4">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 ml-1">
                    Visible Platforms
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {[
                      { id: "leetcode", label: "LeetCode", state: showLeetCode, setter: setShowLeetCode },
                      { id: "codeforces", label: "Codeforces", state: showCodeforces, setter: setShowCodeforces },
                      { id: "github", label: "GitHub", state: showGitHub, setter: setShowGitHub },
                      { id: "codechef", label: "CodeChef", state: showCodeChef, setter: setShowCodeChef },
                      { id: "atcoder", label: "AtCoder", state: showAtCoder, setter: setShowAtCoder },
                    ].map((platform) => (
                      <button
                        key={platform.id}
                        type="button"
                        onClick={() => platform.setter(!platform.state)}
                        className={`p-4 rounded-xl flex items-center gap-3 transition-all ${platform.state
                            ? "bg-cyan-500/20 ring-2 ring-cyan-500/50"
                            : "bg-white/5 hover:bg-white/10"
                          }`}
                      >
                        <div className={`w-4 h-4 rounded ${platform.state ? "bg-cyan-500" : "bg-gray-600"}`} />
                        <span className={`font-bold ${platform.state ? "text-white" : "text-gray-400"}`}>
                          {platform.label}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              </>
            )}

            <button
              type="button"
              onClick={handleUpdatePublicProfile}
              className="w-full py-5 bg-cyan-600 hover:bg-cyan-500 text-white font-black text-lg rounded-2xl shadow-xl shadow-cyan-500/20 transition-all flex items-center justify-center gap-3 active:scale-[0.98]"
            >
              <FiSave className="text-xl" /> Save Public Profile
            </button>
          </div>
        </section>
      )}

      {/* Security Tab */}
      {activeTab === "security" && (
        <div className="space-y-8">
          <section className="glass-card-premium p-10 space-y-8 fade-in-up border-none ring-1 ring-white/5">
            <div className="flex items-center gap-6">
              <div className="w-16 h-16 bg-purple-600/10 rounded-2xl flex items-center justify-center border border-purple-500/20 shadow-inner">
                <FiShield className="text-3xl text-purple-500" />
              </div>
              <div>
                <h2 className="text-2xl font-black text-white italic">Change Password</h2>
                <p className="text-xs font-black uppercase tracking-widest text-gray-500">Update your security credentials</p>
              </div>
            </div>

            <form onSubmit={handleChangePassword} className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 ml-1">Current Password</label>
                  <div className="relative group">
                    <FiLock className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-purple-500 transition-colors" />
                    <input
                      type={showCurrent ? "text" : "password"}
                      required
                      autoComplete="current-password"
                      className="w-full pl-14 pr-14 py-4 bg-white/5 border border-white/5 rounded-2xl text-white font-bold outline-none focus:ring-2 focus:ring-purple-500/30 focus:bg-white/10 transition-all placeholder-gray-700"
                      placeholder="••••••••"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                    />
                    <button
                      type="button"
                      onClick={() => setShowCurrent(!showCurrent)}
                      className="absolute inset-y-0 right-0 pr-5 flex items-center text-gray-500 hover:text-white transition-colors"
                    >
                      {showCurrent ? <FiEyeOff size={20} /> : <FiEye size={20} />}
                    </button>
                  </div>
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 ml-1">New Password</label>
                  <div className="relative group">
                    <FiLock className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-purple-500 transition-colors" />
                    <input
                      type={showNew ? "text" : "password"}
                      required
                      autoComplete="new-password"
                      className="w-full pl-14 pr-14 py-4 bg-white/5 border border-white/5 rounded-2xl text-white font-bold outline-none focus:ring-2 focus:ring-purple-500/30 focus:bg-white/10 transition-all placeholder-gray-700"
                      placeholder="••••••••"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                    />
                    <button
                      type="button"
                      onClick={() => setShowNew(!showNew)}
                      className="absolute inset-y-0 right-0 pr-5 flex items-center text-gray-500 hover:text-white transition-colors"
                    >
                      {showNew ? <FiEyeOff size={20} /> : <FiEye size={20} />}
                    </button>
                  </div>
                </div>
              </div>
              <button
                type="submit"
                className="w-full py-5 bg-white/5 hover:bg-white/10 text-white font-black text-lg rounded-2xl border border-white/5 transition-all shadow-xl active:scale-[0.98]"
              >
                Update Password
              </button>
            </form>
          </section>

          {/* Delete Account */}
          <section className="glass-card-premium p-10 fade-in-up delay-200 ring-1 ring-red-500/20 hover:ring-red-500/40 transition-all overflow-hidden relative group">
            <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-red-500/10 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <h3 className="text-xl font-black text-red-500 mb-4 flex items-center gap-3 italic">
              <FiTrash2 className="text-2xl" /> Delete Account
            </h3>
            <p className="text-sm font-medium text-gray-500 mb-8 leading-relaxed">
              This will permanently delete your account, all linked platforms, and historical data. This action cannot be undone.
            </p>
            <button
              onClick={() => setDeleteDialogOpen(true)}
              className="w-full py-4 bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white font-black rounded-2xl transition-all border border-red-500/20 shadow-lg shadow-red-500/5 active:scale-[0.98]"
            >
              Delete My Account
            </button>
          </section>
        </div>
      )}

      <Dialog
        open={deleteDialogOpen}
        title="Delete Account?"
        message="Are you absolutely certain? This will permanently delete your account and all associated data."
        confirmText="Yes, Delete"
        cancelText="Cancel"
        onConfirm={handleDeleteAccount}
        onCancel={() => setDeleteDialogOpen(false)}
      />
    </div>
  );
}
