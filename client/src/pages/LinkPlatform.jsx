import { useState } from "react";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";
import { FiLink } from "react-icons/fi";
import { SiLeetcode, SiCodeforces, SiGithub, SiCodechef } from "react-icons/si";

// Platform configuration with icons and colors
const platforms = [
  { 
    id: "leetcode", 
    name: "LeetCode", 
    icon: SiLeetcode, 
    color: "#FFA116",
    placeholder: "e.g. touring_machine" 
  },
  { 
    id: "codeforces", 
    name: "Codeforces", 
    icon: SiCodeforces, 
    color: "#1F8ACB",
    placeholder: "e.g. tourist" 
  },
  { 
    id: "github", 
    name: "GitHub", 
    icon: SiGithub, 
    color: "#FFFFFF",
    placeholder: "e.g. torvalds" 
  },
  { 
    id: "codechef", 
    name: "CodeChef", 
    icon: SiCodechef, 
    color: "#5B4638",
    placeholder: "e.g. gennady.korotkevich" 
  },
  { 
    id: "atcoder", 
    name: "AtCoder", 
    icon: null, // Will use text fallback
    color: "#222222",
    placeholder: "e.g. tourist" 
  },
];

export default function LinkPlatform() {
  const navigate = useNavigate();
  const [platform, setPlatform] = useState("leetcode");
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const selectedPlatform = platforms.find(p => p.id === platform);

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
            {/* Platform Selection Cards */}
            <div className="space-y-3">
              <label className="block text-sm font-bold text-gray-400 uppercase tracking-widest ml-1">
                Select Platform
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {platforms.map((p) => {
                  const Icon = p.icon;
                  const isSelected = platform === p.id;
                  return (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => setPlatform(p.id)}
                      className={`p-4 rounded-xl border transition-all flex flex-col items-center gap-2 ${
                        isSelected
                          ? "bg-white/10 border-blue-500/50 ring-2 ring-blue-500/30"
                          : "bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20"
                      }`}
                    >
                      {Icon ? (
                        <Icon 
                          className="w-6 h-6" 
                          style={{ color: isSelected ? p.color : "#9CA3AF" }} 
                        />
                      ) : (
                        <span 
                          className="w-6 h-6 flex items-center justify-center font-black text-sm rounded"
                          style={{ 
                            backgroundColor: isSelected ? p.color : "#374151",
                            color: isSelected ? "#FFFFFF" : "#9CA3AF"
                          }}
                        >
                          AT
                        </span>
                      )}
                      <span className={`text-sm font-semibold ${isSelected ? "text-white" : "text-gray-400"}`}>
                        {p.name}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="space-y-3">
              <label htmlFor="username" className="block text-sm font-bold text-gray-400 uppercase tracking-widest ml-1">
                {selectedPlatform?.name} Username
              </label>
              <input
                id="username"
                value={username}
                type="text"
                placeholder={selectedPlatform?.placeholder || "Enter your username"}
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
                Link {selectedPlatform?.name}
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
            By linking your account, DevLog will track public statistics and activity history. 
            Platform data is fetched from public APIs. Some platforms have sync cooldowns to prevent API rate limiting.
          </p>
        </div>

        <div className="mt-4 p-4 bg-yellow-500/5 border border-yellow-500/10 rounded-xl fade-in-up delay-300">
          <p className="text-yellow-500/80 text-xs">
            <strong>Note:</strong> CodeChef and AtCoder use third-party APIs which may have occasional downtime. 
            If linking fails, try again later.
          </p>
        </div>
      </div>
    </>
  );
}
