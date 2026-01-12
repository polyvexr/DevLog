import { useState, useEffect, useContext } from "react";
import api from "../api/axios";
import { AuthContext } from "../context/AuthContext";
import Loader from "../components/Loader";
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
  FiEyeOff
} from "react-icons/fi";

export default function Profile() {
  const { logout } = useContext(AuthContext);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Update profile states
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState("");

  // Password change states
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);

  // Dialog states
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await api.get("/user/profile");
      setUser(res.data.user);
      setName(res.data.user.name);
    } catch (err) {
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
      const res = await api.put("/user/profile", { name });
      setUser(res.data.user);
      setIsEditing(false);
      setSuccess("Profile updated successfully");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update profile");
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
    } catch (err) {
      setError("Failed to delete account");
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <div className="mb-12 fade-in-scale">
        <h1 className="text-5xl font-black mb-3 neon-text">Profile Settings</h1>
        <p className="text-gray-400 text-lg">Manage your account information and security</p>
      </div>

      {(error || success) && (
        <div className={`mb-8 p-4 rounded-2xl border flex items-center gap-3 animate-fade-in ${
          error ? "bg-red-500/10 border-red-500/50 text-red-400" : "bg-green-500/10 border-green-500/50 text-green-400"
        }`}>
          <div className={`w-2 h-2 rounded-full ${error ? "bg-red-500" : "bg-green-500"}`} />
          {error || success}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Card */}
        <div className="lg:col-span-2 space-y-8">
          <section className="glass-card-hover p-8 rounded-3xl space-y-6 fade-in-up">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-blue-500/20 rounded-2xl flex items-center justify-center border border-blue-500/30">
                  <FiUser className="text-3xl text-blue-500" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white">Basic Info</h2>
                  <p className="text-sm text-slate-400">Public profile details</p>
                </div>
              </div>
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="p-3 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl transition-all active:scale-95"
              >
                {isEditing ? <FiX className="text-xl" /> : <FiEdit3 className="text-xl" />}
              </button>
            </div>

            <form onSubmit={handleUpdateProfile} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-slate-400 mb-2 ml-1">Full Name</label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500 group-focus-within:text-blue-500 transition-colors">
                      <FiUser />
                    </div>
                    <input
                      type="text"
                      disabled={!isEditing}
                      className="w-full pl-11 pr-4 py-3 bg-slate-950/50 border border-slate-800 rounded-2xl text-white disabled:opacity-50 transition-all outline-none focus:ring-2 focus:ring-blue-500/50"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-400 mb-2 ml-1">Email Address</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500">
                      <FiMail />
                    </div>
                    <input
                      type="email"
                      disabled
                      className="w-full pl-11 pr-4 py-3 bg-slate-950/50 border border-slate-800 rounded-2xl text-slate-500 cursor-not-allowed"
                      value={user.email}
                    />
                  </div>
                </div>
              </div>

              {isEditing && (
                <button
                  type="submit"
                  className="w-full py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold rounded-2xl shadow-lg shadow-blue-500/25 transition-all flex items-center justify-center gap-2"
                >
                  <FiSave /> Save Changes
                </button>
              )}
            </form>
          </section>

          {/* Security Section */}
          <section className="glass-card-hover p-8 rounded-3xl space-y-6 fade-in-up delay-100">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-purple-500/20 rounded-2xl flex items-center justify-center border border-purple-500/30">
                <FiShield className="text-3xl text-purple-500" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">Security</h2>
                <p className="text-sm text-slate-400">Update your password</p>
              </div>
            </div>

            <form onSubmit={handleChangePassword} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-slate-400 mb-2 ml-1">Current Password</label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500 group-focus-within:text-purple-500 transition-colors">
                      <FiLock />
                    </div>
                    <input
                      type={showCurrent ? "text" : "password"}
                      required
                      autoComplete="current-password"
                      className="w-full pl-11 pr-12 py-3 bg-slate-950/50 border border-slate-800 rounded-2xl text-white outline-none focus:ring-2 focus:ring-purple-500/50 transition-all shadow-inner"
                      placeholder="••••••••"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                    />
                    <button
                      type="button"
                      onClick={() => setShowCurrent(!showCurrent)}
                      className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-500 hover:text-white transition-colors"
                    >
                      {showCurrent ? <FiEyeOff /> : <FiEye />}
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-400 mb-2 ml-1">New Password</label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500 group-focus-within:text-purple-500 transition-colors">
                      <FiLock />
                    </div>
                    <input
                      type={showNew ? "text" : "password"}
                      required
                      autoComplete="new-password"
                      className="w-full pl-11 pr-12 py-3 bg-slate-950/50 border border-slate-800 rounded-2xl text-white outline-none focus:ring-2 focus:ring-purple-500/50 transition-all shadow-inner"
                      placeholder="••••••••"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                    />
                    <button
                      type="button"
                      onClick={() => setShowNew(!showNew)}
                      className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-500 hover:text-white transition-colors"
                    >
                      {showNew ? <FiEyeOff /> : <FiEye />}
                    </button>
                  </div>
                </div>
              </div>
              <button
                type="submit"
                className="w-full py-4 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-2xl transition-all border border-slate-700/50 shadow-lg active:scale-[0.98]"
              >
                Update Password
              </button>
            </form>
          </section>
        </div>

        {/* Sidebar Actions */}
        <div className="space-y-8">
          <section className="glass-card-hover p-8 rounded-3xl fade-in-up delay-200 border-red-500/10 hover:border-red-500/30">
            <h3 className="text-xl font-bold text-red-500 mb-4 flex items-center gap-2">
              <FiTrash2 /> Danger Zone
            </h3>
            <p className="text-sm text-slate-400 mb-6 leading-relaxed">
              Once you delete your account, there is no going back. Please be certain.
            </p>
            <button
              onClick={() => setDeleteDialogOpen(true)}
              className="w-full py-4 bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white font-bold rounded-2xl transition-all border border-red-500/30"
            >
              Delete Account
            </button>
          </section>
        </div>
      </div>

      <Dialog
        open={deleteDialogOpen}
        title="Delete Account?"
        message="Are you absolutely sure? This will permanently delete your account and all associated platform statistics and history. This action cannot be undone."
        confirmText="Yes, delete everything"
        cancelText="Cancel"
        onConfirm={handleDeleteAccount}
        onCancel={() => setDeleteDialogOpen(false)}
      />
    </div>
  );
}
