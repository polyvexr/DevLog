import { useState, useContext, useEffect } from "react";
import api from "../api/axios";
import { AuthContext } from "../context/AuthContext";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { FiEye, FiEyeOff, FiZap } from "react-icons/fi";

export default function Login() {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  const [isRegister, setIsRegister] = useState(location.pathname === "/register");
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    setIsRegister(location.pathname === "/register");
    setError("");
  }, [location.pathname]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setError("");
      setLoading(true);
      if (isRegister) {
        // Submit register
        await api.post("/auth/register", form);
        // Automatically attempt auto-login right after registration
        const res = await api.post("/auth/login", { email: form.email, password: form.password });
        const { token } = res.data.data;
        login(token);
        navigate("/");
      } else {
        // Submit login
        const res = await api.post("/auth/login", { email: form.email, password: form.password });
        const { token } = res.data.data;
        login(token);
        navigate("/");
      }
    } catch (err) {
      setError(
        err.response?.data?.message || (isRegister ? "Registration failed. Try again." : "Failed to login. Try again.")
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-700 flex items-center justify-center px-4 py-8 overflow-hidden select-none">
      <div className="w-full max-w-sm space-y-6">
        <Link
          to="/"
          className="inline-flex items-center gap-2 font-mono text-[9px] uppercase tracking-wider text-slate-400 hover:text-slate-900 transition-colors"
          title="Back to Home"
        >
          ← Back to Home
        </Link>

        <form
          onSubmit={handleSubmit}
          className="bg-white border border-slate-200 rounded-xl p-8 space-y-6 shadow-xl shadow-slate-200/50"
          aria-live="polite"
        >
          <div className="text-center space-y-1.5">
            <div className="text-base font-[Cormorant_Garamond] font-semibold italic tracking-tight flex items-center justify-center gap-1.5 text-slate-900">
              <FiZap className="text-[#e23e2d] text-base" />
              <span>DevLog</span>
            </div>
            <h2 className="text-2xl font-[Cormorant_Garamond] font-light italic text-slate-900 tracking-tight">
              {isRegister ? "Create Account" : "Sign In"}
            </h2>
            <p className="text-[10px] text-slate-400 font-mono">
              {isRegister ? "Join to track your coding stats" : "Continue your coding journey"}
            </p>
          </div>

          {/* Segmented control for tabs */}
          <div className="grid grid-cols-2 p-1 bg-slate-100 border border-slate-200 rounded-lg font-mono text-[9px] uppercase tracking-wider font-semibold">
            <button
              type="button"
              onClick={() => navigate("/login")}
              className={`py-2 rounded transition-all cursor-pointer ${
                !isRegister ? "bg-[#e23e2d] text-white" : "text-slate-400 hover:text-slate-700"
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => navigate("/register")}
              className={`py-2 rounded transition-all cursor-pointer ${
                isRegister ? "bg-[#e23e2d] text-white" : "text-slate-400 hover:text-slate-700"
              }`}
            >
              Register
            </button>
          </div>

          {error && (
            <div className="p-3 rounded border border-red-500/20 bg-red-500/10 text-red-500 text-[10px] font-mono flex items-center gap-2" role="alert">
              <div className="w-1 h-1 rounded-full bg-red-500 animate-ping" />
              {error}
            </div>
          )}

          <div className="space-y-4">
            {isRegister && (
              <div className="space-y-1.5">
                <label htmlFor="name" className="block text-[9px] font-mono font-semibold uppercase tracking-wider text-slate-400">
                  Full Name
                </label>
                <input
                  id="name"
                  value={form.name}
                  type="text"
                  placeholder="John Doe"
                  className="w-full px-4 py-3 bg-slate-100 border border-slate-200 rounded text-xs font-mono text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#e23e2d] transition-all"
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  required
                />
              </div>
            )}

            <div className="space-y-1.5">
              <label htmlFor="email" className="block text-[9px] font-mono font-semibold uppercase tracking-wider text-slate-400">
                Email Address
              </label>
              <input
                id="email"
                value={form.email}
                type="email"
                placeholder="developer@example.com"
                className="w-full px-4 py-3 bg-slate-100 border border-slate-200 rounded text-xs font-mono text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#e23e2d] transition-all"
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required
              />
            </div>
            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <label htmlFor="password" className="block text-[9px] font-mono font-semibold uppercase tracking-wider text-slate-400">
                  Password
                </label>
              </div>
              <div className="relative">
                <input
                  id="password"
                  value={form.password}
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 bg-slate-100 border border-slate-200 rounded text-xs font-mono text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#e23e2d] transition-all pr-10"
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((s) => !s)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <FiEyeOff className="text-xs" /> : <FiEye className="text-xs" />}
                </button>
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-[#e23e2d] hover:bg-[#cf2e2e] disabled:bg-red-200 disabled:text-slate-400 disabled:cursor-not-allowed text-white font-mono text-xs font-semibold uppercase tracking-wider rounded transition-colors flex items-center justify-center gap-2 cursor-pointer"
          >
            {loading ? (
              <div className="w-3.5 h-3.5 border border-white/20 border-t-white rounded-full animate-spin" />
            ) : (
              isRegister ? "Create Account →" : "Sign In →"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
