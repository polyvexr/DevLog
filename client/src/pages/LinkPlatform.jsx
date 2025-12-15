import Navbar from "../components/Navbar";
import { useState } from "react";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";

export default function LinkPlatform() {
  const navigate = useNavigate();
  const [platform, setPlatform] = useState("leetcode");
  const [username, setUsername] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    await api.post("/platforms/link", { platform, username });
    navigate("/");
  };

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="p-8">
        <div className="app-container">
          <div className="mb-8 fade-in-scale">
            <h2 className="text-4xl font-black neon-text mb-2">Link New Platform</h2>
            <p className="text-gray-400 text-lg">Connect your coding accounts to track progress</p>
          </div>

          <form onSubmit={submit} className="max-w-lg glass-card-hover p-8 rounded-2xl">
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-300 mb-3">Platform</label>
              <select
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
              <label className="block text-sm font-semibold text-gray-300 mb-3">Username</label>
              <input
                value={username}
                type="text"
                placeholder="Enter your username"
                className="w-full p-3 border border-blue-500/30 rounded-lg bg-slate-900/50 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>

            <button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white p-3 rounded-lg font-bold text-lg hover:shadow-lg hover:shadow-blue-500/50 transition-all duration-200">
              🔗 Link Platform
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}
