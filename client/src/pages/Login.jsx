import { useState, useContext } from "react";
import api from "../api/axios";
import { AuthContext } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";

export default function Login() {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await api.post("/auth/login", form);
    login(res.data.token, res.data.isAdmin);
    
    // Navigate to admin dashboard if admin, otherwise to home
    if (res.data.isAdmin) {
      navigate("/admin");
    } else {
      navigate("/");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <form
        onSubmit={handleSubmit}
        className="glass-card-hover p-8 shadow-2xl rounded-2xl w-full max-w-md fade-in-scale"
      >
        <div className="text-center mb-8">
          <h2 className="text-4xl font-black neon-text mb-2">Welcome Back</h2>
          <p className="text-gray-400">
            Sign in to continue your coding journey
          </p>
        </div>

        <div className="mb-5">
          <label className="block text-sm font-semibold text-gray-300 mb-2">
            Email
          </label>
          <input
            value={form.email}
            type="email"
            placeholder="your@email.com"
            className="w-full p-3 border border-blue-500/30 rounded-lg bg-slate-900/50 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            required
          />
        </div>

        <div className="mb-6">
          <label className="block text-sm font-semibold text-gray-300 mb-2">
            Password
          </label>
          <input
            value={form.password}
            type="password"
            placeholder="••••••••"
            className="w-full p-3 border border-blue-500/30 rounded-lg bg-slate-900/50 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            required
          />
        </div>

        <button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white p-3 rounded-lg font-bold text-lg hover:shadow-lg hover:shadow-blue-500/50 transition-all duration-200">
          Sign In
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
  );
}
