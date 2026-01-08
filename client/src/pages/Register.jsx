import { useState } from "react";
import api from "../api/axios";
import { useNavigate, Link } from "react-router-dom";

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    try {
      setError("");
      setLoading(true);
      await api.post("/auth/register", form);
      navigate("/login");
    } catch (err) {
      setError(
        err.response?.data?.message || "Registration failed. Please try again."
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
          className="inline-flex items-center gap-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors mb-6 fade-in-up"
        >
          <span>←</span>
          <span>Back to Home</span>
        </Link>
        <form
          onSubmit={submit}
          className="platform-card p-8 shadow-2xl rounded-2xl w-full fade-in-scale"
          aria-live="polite"
        >
          <div className="text-center mb-8">
            <h2 className="text-4xl font-black text-[var(--text-primary)] mb-2">
              Join DevLog
            </h2>
            <p className="text-[var(--text-secondary)]">
              Start tracking your coding progress
            </p>
          </div>

          {error && (
            <div className="mb-4 text-sm text-red-400" role="alert">
              {error}
            </div>
          )}

          <div className="mb-5">
            <label
              htmlFor="name"
              className="block text-sm font-semibold text-[var(--text-secondary)] mb-2"
            >
              Name
            </label>
            <input
              id="name"
              value={form.name}
              type="text"
              placeholder="Your name"
              className="w-full p-3 border border-[var(--border-color)] rounded-lg bg-[var(--bg-card-inner)] text-[var(--text-primary)] placeholder-[var(--text-secondary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-blue)] focus:border-transparent transition-all"
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
            />
          </div>

          <div className="mb-5">
            <label
              htmlFor="email"
              className="block text-sm font-semibold text-[var(--text-secondary)] mb-2"
            >
              Email
            </label>
            <input
              id="email"
              value={form.email}
              type="email"
              placeholder="your@email.com"
              className="w-full p-3 border border-[var(--border-color)] rounded-lg bg-[var(--bg-card-inner)] text-[var(--text-primary)] placeholder-[var(--text-secondary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-blue)] focus:border-transparent transition-all"
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
            />
          </div>

          <div className="mb-6">
            <label
              htmlFor="password"
              className="block text-sm font-semibold text-[var(--text-secondary)] mb-2"
            >
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                value={form.password}
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                className="w-full p-3 pr-12 border border-[var(--border-color)] rounded-lg bg-[var(--bg-card-inner)] text-[var(--text-primary)] placeholder-[var(--text-secondary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-blue)] focus:border-transparent transition-all"
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword((s) => !s)}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full"
          >
            {loading ? "Creating..." : "Create Account"}
          </button>
          <div className="mt-6 text-center">
            <p className="text-sm text-[var(--text-secondary)]">
              Already have an account?{" "}
              <Link
                to="/login"
                className="text-[var(--accent-blue)] hover:opacity-80 font-semibold underline"
              >
                Sign in
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
