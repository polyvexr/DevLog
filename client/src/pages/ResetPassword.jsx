import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import api from "../api/axios";
import { FiLock, FiEye, FiEyeOff, FiCheckCircle, FiShield, FiAlertTriangle } from "react-icons/fi";

export default function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [verifying, setVerifying] = useState(true);
  const [valid, setValid] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const verifyToken = async () => {
      try {
        const res = await api.get(`/auth/verify-reset-token/${token}`);
        if (res.data.data?.valid) {
          setValid(true);
        }
      } catch (err) {
        setError(err.response?.data?.message || "Invalid or expired reset link.");
      } finally {
        setVerifying(false);
      }
    };
    verifyToken();
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      return setError("Passwords do not match");
    }

    setLoading(true);
    setError("");

    try {
      await api.post(`/auth/reset-password/${token}`, { password });
      setSuccess(true);
      setTimeout(() => navigate("/login"), 3000);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to reset password.");
    } finally {
      setLoading(false);
    }
  };

  if (verifying) {
    return (
      <div className="min-h-screen relative flex flex-col items-center justify-center p-6 overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-blue-600/20 rounded-full blur-[100px] animate-pulse"></div>
        <div className="relative z-10 text-center">
          <div className="w-20 h-20 border-4 border-white/5 border-t-blue-500 rounded-full animate-spin mb-8 mx-auto shadow-2xl shadow-blue-500/20" />
          <p className="text-gray-400 font-black uppercase tracking-[0.3em] text-xs animate-pulse">Validating Authorization Token...</p>
        </div>
      </div>
    );
  }

  if (!valid && !success) {
    return (
      <div className="min-h-screen relative flex items-center justify-center p-6 overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-red-600/10 rounded-full blur-[100px] animate-blob"></div>
        <div className="w-full max-w-lg relative z-10">
          <div className="glass-card-premium p-12 text-center fade-in-scale ring-1 ring-red-500/20">
            <div className="w-24 h-24 bg-red-500/10 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-2xl shadow-red-500/20">
              <FiAlertTriangle className="text-5xl text-red-500" />
            </div>
            <h2 className="text-4xl font-black text-white mb-4 italic">Invalid Protocol</h2>
            <p className="text-gray-400 text-lg mb-10">{error}</p>
            <Link
              to="/forgot-password"
              className="block w-full py-5 bg-white/5 hover:bg-white/10 text-white font-black rounded-2xl transition-all border border-white/5 shadow-xl active:scale-[0.98]"
            >
              Request New Authorization →
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen relative flex items-center justify-center p-6 overflow-hidden">
        {/* Background blobs for depth */}
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-green-600/10 rounded-full blur-[100px] animate-blob"></div>

        <div className="w-full max-w-lg relative z-10">
          <div className="glass-card-premium p-12 text-center fade-in-scale border-green-500/20">
            <div className="w-24 h-24 bg-green-500/10 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-2xl shadow-green-500/20">
              <FiCheckCircle className="text-5xl text-green-500" />
            </div>
            <h2 className="text-4xl font-black text-white mb-4 italic">Password Updated</h2>
            <p className="text-gray-400 text-lg mb-10 leading-relaxed">
              Your password has been changed successfully. <br />
              <span className="text-blue-400 font-bold">Redirecting to login...</span>
            </p>
            <Link
              to="/login"
              className="text-xs font-black uppercase tracking-widest text-gray-500 hover:text-white transition-colors"
            >
              Manual Override
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative flex items-center justify-center px-4 py-8 overflow-hidden">
      {/* Background blobs for depth */}
      <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-600/10 rounded-full blur-[100px] animate-blob"></div>
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-purple-600/10 rounded-full blur-[100px] animate-blob animation-delay-2000"></div>

      <div className="w-full max-w-lg relative z-10">
        <form onSubmit={handleSubmit} className="glass-card-premium p-10 md:p-12 fade-in-scale">
          <div className="text-center mb-10">
            <div className="w-20 h-20 bg-blue-600/10 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-blue-500/20 shadow-inner">
              <FiShield className="text-4xl text-blue-500" />
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-white mb-3 italic tracking-tight">Update <span className="animate-text-shine">Password</span></h2>
            <p className="text-gray-500 font-medium">Choose a strong new password for your account</p>
          </div>

          <div className="space-y-8">
            {error && (
              <div className="p-5 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-400 text-sm font-bold flex items-center gap-4 animate-shake">
                <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                {error}
              </div>
            )}

            <div className="space-y-4">
              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 ml-1">New Password</label>
                <div className="relative group">
                  <FiLock className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-blue-500 transition-colors" />
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    autoComplete="new-password"
                    className="w-full pl-14 pr-14 py-5 bg-white/5 border border-white/5 rounded-2xl text-white font-black placeholder-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:bg-white/10 transition-all"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-5 flex items-center text-gray-500 hover:text-white transition-colors"
                  >
                    {showPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
                  </button>
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 ml-1">Confirm Password</label>
                <div className="relative group">
                  <FiLock className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-blue-500 transition-colors" />
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    autoComplete="new-password"
                    className="w-full pl-14 pr-14 py-5 bg-white/5 border border-white/5 rounded-2xl text-white font-black placeholder-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:bg-white/10 transition-all"
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-10 py-5 bg-blue-600 hover:bg-blue-500 text-white font-black text-lg rounded-2xl shadow-xl shadow-blue-500/20 transition-all active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-3"
            >
              {loading ? (
                <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : "Update Password →"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
