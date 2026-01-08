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
      <div className="mb-8 fade-in-scale">
        <h2 className="text-4xl font-black text-[var(--text-primary)] mb-2">
          Link New Platform
        </h2>
        <p className="text-[var(--text-secondary)] text-lg">
          Connect your coding accounts to track progress
        </p>
      </div>

      <form
        onSubmit={submit}
        className="max-w-lg platform-card p-8 rounded-2xl"
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
            className="block text-sm font-semibold text-[var(--text-secondary)] mb-3"
          >
            Platform
          </label>
          <select
            id="platform"
            className="w-full p-3 border border-[var(--border-color)] rounded-lg bg-[var(--bg-card-inner)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-blue)] focus:border-transparent transition-all"
            value={platform}
            onChange={(e) => setPlatform(e.target.value)}
          >
            <option value="leetcode">LeetCode</option>
            <option value="codeforces">CodeForces</option>
            <option value="github">GitHub</option>
          </select>
        </div>

        <div className="mb-8">
          <label
            htmlFor="username"
            className="block text-sm font-semibold text-[var(--text-secondary)] mb-3"
          >
            Username
          </label>
          <input
            id="username"
            value={username}
            type="text"
            placeholder="Enter your username"
            className="w-full p-3 border border-[var(--border-color)] rounded-lg bg-[var(--bg-card-inner)] text-[var(--text-primary)] placeholder-[var(--text-secondary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-blue)] focus:border-transparent transition-all"
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="btn-primary w-full flex items-center justify-center gap-2"
        >
          {loading ? (
            "Linking..."
          ) : (
            <>
              <FiLink /> Link Platform
            </>
          )}
        </button>
      </form>
    </>
  );
}
