import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { FaArrowLeft, FaGithub, FaShareAlt, FaChartLine } from "react-icons/fa";
import { SiLeetcode, SiCodeforces } from "react-icons/si";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
} from "recharts";
import api from "../api/axios";
import Loader from "../components/Loader";

/**
 * PublicProfile - Public developer profile page (no auth required)
 */
export default function PublicProfile() {
  const { username } = useParams();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchProfile();
  }, [username]);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/u/${username}`);
      if (response.data.success) {
        setProfile(response.data);
      }
      setError(null);
    } catch (err) {
      if (err.response?.status === 404) {
        setError("Profile not found");
      } else {
        setError("Failed to load profile");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleShare = async () => {
    const url = window.location.href;
    if (navigator.share) {
      await navigator.share({
        title: `${profile.profile.name}'s DevLog Profile`,
        url,
      });
    } else {
      await navigator.clipboard.writeText(url);
      alert("Profile link copied to clipboard!");
    }
  };

  const platformIcons = {
    leetcode: SiLeetcode,
    codeforces: SiCodeforces,
    github: FaGithub,
  };

  const platformColors = {
    leetcode: "#ffa116",
    codeforces: "#1f8acb",
    github: "#ffffff",
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
        <Loader />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-white mb-4">404</h1>
          <p className="text-gray-400 mb-6">{error}</p>
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            <FaArrowLeft />
            Go Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-900/50 to-blue-900/50 py-12 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">
                {profile.profile.name}
              </h1>
              <p className="text-purple-300">@{profile.profile.username}</p>
              {profile.profile.bio && (
                <p className="text-gray-400 mt-4 max-w-xl">{profile.profile.bio}</p>
              )}
              {(profile.profile.location || profile.profile.website) && (
                <div className="flex items-center gap-4 mt-4 text-sm text-gray-400">
                  {profile.profile.location && <span>📍 {profile.profile.location}</span>}
                  {profile.profile.website && (
                    <a
                      href={profile.profile.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-purple-400 hover:text-purple-300"
                    >
                      🔗 {new URL(profile.profile.website).hostname}
                    </a>
                  )}
                </div>
              )}
            </div>
            <button
              onClick={handleShare}
              className="flex items-center gap-2 px-4 py-2 bg-gray-700/50 text-gray-300 rounded-lg hover:bg-gray-700 transition-colors"
            >
              <FaShareAlt />
              Share
            </button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Aggregate stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <StatBox
            label="Platforms"
            value={profile.aggregateStats.platforms}
            icon="🔗"
          />
          <StatBox
            label="Problems Solved"
            value={profile.aggregateStats.totalProblemsSolved}
            icon="✅"
          />
          <StatBox
            label="Contests"
            value={profile.aggregateStats.totalContests}
            icon="🏆"
          />
          <StatBox
            label="Badges"
            value={profile.aggregateStats.badges.length}
            icon="🎖️"
          />
        </div>

        {/* Badges */}
        {profile.aggregateStats.badges.length > 0 && (
          <div className="mb-8">
            <h2 className="text-lg font-semibold text-white mb-4">Achievements</h2>
            <div className="flex flex-wrap gap-2">
              {profile.aggregateStats.badges.map((badge, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1.5 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-500/30 rounded-full text-sm text-yellow-300"
                >
                  🏅 {badge.label}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Platform stats */}
        <div className="space-y-6">
          {profile.platforms.map((platform) => {
            const Icon = platformIcons[platform.platform];
            const color = platformColors[platform.platform];
            const history = profile.history[platform.platform] || [];

            return (
              <div
                key={platform.platform}
                className="bg-gray-800/50 rounded-xl p-6 border border-gray-700/50"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <Icon style={{ color }} size={24} />
                    <div>
                      <h3 className="text-white font-semibold capitalize">
                        {platform.platform}
                      </h3>
                      <p className="text-gray-400 text-sm">@{platform.username}</p>
                    </div>
                  </div>
                  <span className="text-xs text-gray-500">
                    Updated {new Date(platform.lastUpdated).toLocaleDateString()}
                  </span>
                </div>

                {/* Stats grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                  {Object.entries(platform.stats).slice(0, 4).map(([key, value]) => (
                    <div
                      key={key}
                      className="bg-gray-700/30 rounded-lg p-3 text-center"
                    >
                      <p className="text-white font-bold">{value}</p>
                      <p className="text-gray-400 text-xs capitalize">
                        {key.replace(/([A-Z])/g, " $1").trim()}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Progress chart */}
                {history.length > 1 && (
                  <div className="h-40 mt-4">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={history}>
                        <defs>
                          <linearGradient
                            id={`gradient-${platform.platform}`}
                            x1="0"
                            y1="0"
                            x2="0"
                            y2="1"
                          >
                            <stop offset="5%" stopColor={color} stopOpacity={0.3} />
                            <stop offset="95%" stopColor={color} stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                        <XAxis
                          dataKey="date"
                          tickFormatter={(d) =>
                            new Date(d).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                            })
                          }
                          stroke="#6b7280"
                          fontSize={10}
                        />
                        <YAxis stroke="#6b7280" fontSize={10} />
                        <Area
                          type="monotone"
                          dataKey={
                            platform.platform === "leetcode"
                              ? "metrics.totalSolved"
                              : platform.platform === "codeforces"
                              ? "metrics.rating"
                              : "metrics.totalRepos"
                          }
                          stroke={color}
                          fill={`url(#gradient-${platform.platform})`}
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="text-center mt-12 pt-8 border-t border-gray-700/50">
          <p className="text-gray-500 text-sm">
            Powered by{" "}
            <a href="/" className="text-purple-400 hover:text-purple-300">
              DevLog
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

function StatBox({ label, value, icon }) {
  return (
    <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700/50 text-center">
      <span className="text-2xl">{icon}</span>
      <p className="text-2xl font-bold text-white mt-2">{value}</p>
      <p className="text-gray-400 text-sm">{label}</p>
    </div>
  );
}
