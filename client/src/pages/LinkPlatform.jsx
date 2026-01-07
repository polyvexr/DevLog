import { useState } from "react";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";

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
      <div className="mb-8 fade-in-scale">
        <h2 className="text-4xl font-black neon-text mb-2">
          Link New Platform
        </h2>
        <p className="text-gray-400 text-lg">
          Connect your coding accounts to track progress
        </p>
      </div>

      <form
        onSubmit={submit}
        className="max-w-lg glass-card-hover p-8 rounded-2xl"
        aria-live="polite"
      >
        {error && (
          <div className="mb-4 text-sm text-red-400" role="alert">
            {error}
          </div>
        )}
        <div className="mb-6">
          <label
            htmlFor="platform"
            className="block text-sm font-semibold text-gray-300 mb-3"
          >
            Platform
          </label>
          <select
            id="platform"
            className="w-full p-3 border border-blue-500/30 rounded-lg bg-slate-900/50 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            value={platform}
            onChange={(e) => setPlatform(e.target.value)}
          >
            <option value="leetcode">🟠 LeetCode</option>
            <option value="codeforces">🔵 CodeForces</option>
            <option value="github">🟣 GitHub</option>
          </select>
        </div>

        <div className="mb-8">
          <label
            htmlFor="username"
            className="block text-sm font-semibold text-gray-300 mb-3"
          >
            Username
          </label>
          <input
            id="username"
            value={username}
            type="text"
            placeholder="Enter your username"
            className="w-full p-3 border border-blue-500/30 rounded-lg bg-slate-900/50 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white p-3 rounded-lg font-bold text-lg hover:shadow-lg hover:shadow-blue-500/50 transition-all duration-200 disabled:opacity-60"
        >
          {loading ? "Linking..." : "🔗 Link Platform"}
        </button>
      </form>
    </>
  );
}
