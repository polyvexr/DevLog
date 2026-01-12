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
        if (res.data.valid) {
          setValid(true);
        } else {
          setError(res.data.message);
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
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6">
        <div className="w-16 h-16 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin mb-4" />
        <p className="text-slate-400 font-medium">Verifying reset link...</p>
      </div>
    );
  }

  if (!valid && !success) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6">
        <div className="w-full max-w-md bg-slate-900/50 border border-slate-800 p-8 rounded-3xl text-center">
          <div className="w-20 h-20 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <FiAlertTriangle className="text-4xl text-red-500" />
          </div>
          <h2 className="text-2xl font-black text-white mb-2">Invalid Link</h2>
          <p className="text-slate-400 mb-8">{error}</p>
          <Link 
            to="/forgot-password"
            className="block w-full py-4 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-2xl transition-colors"
          >
            Request New Link
          </Link>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6 bg-[radial-gradient(circle_at_50%_50%,rgba(17,24,39,1)_0%,rgba(2,6,23,1)_100%)]">
        <div className="w-full max-w-md bg-slate-900/50 border border-slate-800 p-8 rounded-3xl text-center fade-in-scale">
          <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <FiCheckCircle className="text-4xl text-green-500" />
          </div>
          <h2 className="text-3xl font-black text-white mb-4">Password reset!</h2>
          <p className="text-slate-400 mb-8">
            Your password has been successfully updated. Redirecting you to login...
          </p>
          <Link 
            to="/login"
            className="text-blue-400 hover:text-blue-300 font-semibold"
          >
            Click here if not redirected
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6 bg-[radial-gradient(circle_at_50%_50%,rgba(17,24,39,1)_0%,rgba(2,6,23,1)_100%)]">
      <div className="w-full max-w-md bg-slate-900/50 border border-slate-800 p-8 rounded-3xl backdrop-blur-xl fade-in-up">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-blue-500/10 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-blue-500/20">
            <FiShield className="text-3xl text-blue-500" />
          </div>
          <h2 className="text-4xl font-black text-white mb-2 neon-text">Reset Password</h2>
          <p className="text-slate-400">Secure your account with a new password</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="p-4 bg-red-500/10 border border-red-500/50 rounded-xl text-red-400 text-sm flex items-center gap-3 animate-shake">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
              {error}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-2 ml-1">New Password</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500 group-focus-within:text-blue-500 transition-colors">
                  <FiLock />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  autoComplete="new-password"
                  className="w-full pl-11 pr-12 py-4 bg-slate-950/50 border border-slate-800 rounded-2xl text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all outline-none"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-500 hover:text-white transition-colors"
                >
                  {showPassword ? <FiEyeOff /> : <FiEye />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-2 ml-1">Confirm New Password</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500 group-focus-within:text-blue-500 transition-colors">
                  <FiLock />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  autoComplete="new-password"
                  className="w-full pl-11 pr-12 py-4 bg-slate-950/50 border border-slate-800 rounded-2xl text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all outline-none"
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
            className="w-full py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold rounded-2xl shadow-lg shadow-blue-500/25 transition-all active:scale-[0.98] disabled:opacity-50 disabled:active:scale-100 flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Updating Password...
              </>
            ) : "Reset Password"}
          </button>
        </form>
      </div>
    </div>
  );
}
