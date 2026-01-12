import { useState } from "react";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";
import { FiLink } from "react-icons/fi";

export default function LinkPlatform() {
  const navigate = useNavigate();
  const [platform, setPlatform] = useState("leetcode");
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    try {
      setError("");
      setLoading(true);
      await api.post("/platforms/link", { platform, username });
      navigate("/");
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to link platform. Try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="mb-12 fade-in-scale">
        <h1 className="text-5xl md:text-6xl font-black mb-4 tracking-tight">
          <span className="text-white opacity-90">Expand</span>
          <br />
          <span className="animate-text-shine inline-block">Ecosystem</span>
        </h1>
        <p className="text-gray-400 text-xl font-medium">
          Integrate a new platform into your command center.
        </p>
      </div>

      <div className="max-w-2xl">
        <form
          onSubmit={submit}
          className="glass-card-premium p-10 md:p-12 fade-in-up"
          aria-live="polite"
        >
          {error && (
            <div className="mb-8 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm flex items-center gap-3 animate-shake" role="alert">
              <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></div>
              {error}
            </div>
          )}

          <div className="space-y-8">
            <div className="space-y-3">
              <label htmlFor="platform" className="block text-sm font-bold text-gray-400 uppercase tracking-widest ml-1">
                Select Platform
              </label>
              <div className="relative">
                <select
                  id="platform"
                  className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-2xl text-white appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500/40 transition-all font-bold cursor-pointer hover:bg-white/10"
                  value={platform}
                  onChange={(e) => setPlatform(e.target.value)}
                >
                  <option value="leetcode" className="bg-gray-900">LeetCode</option>
                  <option value="codeforces" className="bg-gray-900">Codeforces</option>
                  <option value="github" className="bg-gray-900">GitHub</option>
                </select>
                <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500">
                  ▼
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <label htmlFor="username" className="block text-sm font-bold text-gray-400 uppercase tracking-widest ml-1">
                Platform Alias / Username
              </label>
              <input
                id="username"
                value={username}
                type="text"
                placeholder="e.g. touring_machine"
                className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-2xl text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500/40 transition-all font-medium"
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-10 py-5 bg-blue-600 hover:bg-blue-500 disabled:bg-blue-800 disabled:cursor-not-allowed text-white font-black text-lg rounded-2xl shadow-xl shadow-blue-500/20 transition-all active:scale-[0.98] flex items-center justify-center gap-3"
          >
            {loading ? (
              <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            ) : (
              <>
                <FiLink className="group-hover:rotate-12 transition-transform" />
                Initialize Link
              </>
            )}
          </button>
        </form>

        <div className="mt-8 p-6 bg-white/[0.02] border border-white/5 rounded-2xl fade-in-up delay-200">
          <h4 className="text-white font-bold mb-2 flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
            Connection Protocol
          </h4>
          <p className="text-gray-500 text-sm leading-relaxed">
            By linking your account, DevLog will track public statistics and activity history. Some platforms have sync cooldowns to prevent API rate limiting.
          </p>
        </div>
      </div>
    </>
  );
}
