import { useState, useContext } from "react";
import api from "../api/axios";
import { AuthContext } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";

export default function Login() {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setError("");
      setLoading(true);
      const res = await api.post("/auth/login", form);
      login(res.data.token, res.data.isAdmin);
      if (res.data.isAdmin) navigate("/admin");
      else navigate("/");
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to login. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-6 fade-in-up"
        >
          <span>←</span>
          <span>Back to Home</span>
        </Link>
        <form
          onSubmit={handleSubmit}
          className="glass-card-hover p-8 shadow-2xl rounded-2xl w-full fade-in-scale"
          aria-live="polite"
        >
          <div className="text-center mb-8">
            <h2 className="text-4xl font-black neon-text mb-2">Welcome Back</h2>
            <p className="text-gray-400">
              Sign in to continue your coding journey
            </p>
          </div>

          {error && (
            <div className="mb-4 text-sm text-red-400" role="alert">
              {error}
            </div>
          )}

          <div className="mb-5">
            <label
              htmlFor="email"
              className="block text-sm font-semibold text-gray-300 mb-2"
            >
              Email
            </label>
            <input
              id="email"
              value={form.email}
              type="email"
              placeholder="your@email.com"
              className="w-full p-3 border border-blue-500/30 rounded-lg bg-slate-900/50 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
            />
          </div>

          <div className="mb-6">
            <label
              htmlFor="password"
              className="block text-sm font-semibold text-gray-300 mb-2"
            >
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                value={form.password}
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                className="w-full p-3 pr-12 border border-blue-500/30 rounded-lg bg-slate-900/50 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword((s) => !s)}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-sm text-gray-400 hover:text-gray-200"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white p-3 rounded-lg font-bold text-lg hover:shadow-lg hover:shadow-blue-500/50 transition-all duration-200 disabled:opacity-60"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-400">
              Don't have an account?{" "}
              <Link
                to="/register"
                className="text-blue-400 hover:text-blue-300 font-semibold underline"
              >
                Create one
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
