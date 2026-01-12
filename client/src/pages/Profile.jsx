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
    } catch {
      setError("Failed to delete account");
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <div className="mb-12 fade-in-scale">
        <h1 className="text-5xl md:text-7xl font-black mb-4 tracking-tight">
          <span className="text-white opacity-90">System</span>
          <br />
          <span className="animate-text-shine inline-block">Configuration</span>
        </h1>
        <p className="text-gray-400 text-xl font-medium">Manage your secondary consciousness parameters and security protocols.</p>
      </div>

      {(error || success) && (
        <div className={`mb-10 p-6 rounded-2xl flex items-center gap-4 animate-fade-in glass-card-premium ${
          error ? "ring-1 ring-red-500/50 text-red-400" : "ring-1 ring-green-500/50 text-green-400"
        }`}>
          <div className={`w-3 h-3 rounded-full animate-pulse ${error ? "bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]" : "bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]"}`} />
          <span className="font-bold tracking-wide">{error || success}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Card */}
        <div className="lg:col-span-2 space-y-8">
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
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 ml-1">Universal Designation</label>
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
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 ml-1">Neural Address</label>
                  <div className="relative">
                    <FiMail className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-500" />
                    <input
                      type="email"
                      disabled
                      className="w-full pl-14 pr-6 py-4 bg-white/[0.02] border border-white/5 rounded-2xl text-gray-600 font-bold cursor-not-allowed italic"
                      value={user.email}
                    />
                  </div>
                </div>
              </div>

              {isEditing && (
                <button
                  type="submit"
                  className="w-full py-5 bg-blue-600 hover:bg-blue-500 text-white font-black text-lg rounded-2xl shadow-xl shadow-blue-500/20 transition-all flex items-center justify-center gap-3 active:scale-[0.98]"
                >
                  <FiSave className="text-xl" /> Commit Changes
                </button>
              )}
            </form>
          </section>

          {/* Security Section */}
          <section className="glass-card-premium p-10 space-y-8 fade-in-up delay-100 border-none ring-1 ring-white/5">
            <div className="flex items-center gap-6">
              <div className="w-16 h-16 bg-purple-600/10 rounded-2xl flex items-center justify-center border border-purple-500/20 shadow-inner">
                <FiShield className="text-3xl text-purple-500" />
              </div>
              <div>
                <h2 className="text-2xl font-black text-white italic">Encryption Protocols</h2>
                <p className="text-xs font-black uppercase tracking-widest text-gray-500">Neural Link Authorization</p>
              </div>
            </div>

            <form onSubmit={handleChangePassword} className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 ml-1">Current Cipher</label>
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
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 ml-1">New Sequence</label>
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
                Rotating Authentication Keys
              </button>
            </form>
          </section>
        </div>

        {/* Sidebar Actions */}
        <div className="space-y-8">
          <section className="glass-card-premium p-10 fade-in-up delay-200 ring-1 ring-red-500/20 hover:ring-red-500/40 transition-all overflow-hidden relative group">
            <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-red-500/10 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <h3 className="text-xl font-black text-red-500 mb-4 flex items-center gap-3 italic">
              <FiTrash2 className="text-2xl" /> Terminal Deletion
            </h3>
            <p className="text-sm font-medium text-gray-500 mb-8 leading-relaxed">
              Initiating this protocol will permanently purge all neural links, platform statistics, and historical data. This operation is irreversible.
            </p>
            <button
              onClick={() => setDeleteDialogOpen(true)}
              className="w-full py-4 bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white font-black rounded-2xl transition-all border border-red-500/20 shadow-lg shadow-red-500/5 active:scale-[0.98]"
            >
              Destroy Identity
            </button>
          </section>
        </div>
      </div>

      <Dialog
        open={deleteDialogOpen}
        title="Execute Purge Protocol?"
        message="Are you absolutely certain? This operation will terminate your access and atomize all aggregated developer intelligence. "
        confirmText="Confirm Atomization"
        cancelText="Abort"
        onConfirm={handleDeleteAccount}
        onCancel={() => setDeleteDialogOpen(false)}
      />
    </div>
  );
}
