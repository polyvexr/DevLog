import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Loader from "../components/Loader";
import StatCard from "../components/StatCard";
import api from "../api/axios";
import { FiStar, FiCalendar, FiBarChart2, FiActivity } from "react-icons/fi";
import { RiFireLine } from "react-icons/ri";

export default function LeetCodeDetails() {
  const [data, setData] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    api
      .get("/stats/all")
      .then((res) => {
        const leetcode = res.data.stats.find((s) => s.platform === "leetcode");
        setData(leetcode);
      })
      .catch(() => setData(null));
  }, []);

  if (!data) return <Loader />;

  const stats = data.stats;
  const { easy, medium, hard, all } = stats.submissionsByDifficulty || {};

  return (
    <>
      <button
        onClick={() => navigate("/")}
        className="mb-6 text-[var(--accent-blue)] hover:opacity-80 flex items-center gap-2 fade-in-scale"
      >
        ← Back to Dashboard
      </button>

      <div className="mb-8 fade-in-scale">
        <div className="flex items-center gap-4 mb-3">
          <div className="w-16 h-16 rounded-xl leetcode-gradient flex items-center justify-center text-3xl font-bold text-white shadow-lg">
            LC
          </div>
          <div>
            <h1 className="text-5xl font-black text-[var(--text-primary)]">
              LeetCode Profile
            </h1>
            <p className="text-[var(--text-secondary)] text-lg">
              @{data.username}
            </p>
          </div>
        </div>
      </div>

      {/* Profile Summary */}
      <div className="platform-card p-6 rounded-2xl mb-6 fade-in-up">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div>
            <div className="text-[var(--text-secondary)] text-sm mb-1">
              Real Name
            </div>
            <div className="text-xl font-bold text-[var(--text-primary)]">
              {stats.realName || "N/A"}
            </div>
          </div>
          <div>
            <div className="text-[var(--text-secondary)] text-sm mb-1">
              Ranking
            </div>
            <div className="text-2xl font-bold text-[var(--accent-blue)]">
              #{stats.ranking?.toLocaleString()}
            </div>
          </div>
          <div>
            <div className="text-[var(--text-secondary)] text-sm mb-1">
              Reputation
            </div>
            <div className="text-xl font-bold text-purple-400">
              {stats.reputation?.toLocaleString()}
            </div>
          </div>
          <div>
            <div className="text-[var(--text-secondary)] text-sm mb-1">
              Star Rating
            </div>
            <div className="text-xl font-bold text-yellow-400 flex gap-0.5">
              {Array.from({
                length: Math.max(
                  0,
                  Math.min(5, Math.floor(Number(stats.starRating) || 0))
                ),
              }).map((_, i) => (
                <FiStar key={i} className="fill-current" />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Submissions by Difficulty */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4 text-[var(--text-primary)]">
          Problem Solving Stats
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="platform-card p-6 rounded-xl fade-in-up">
            <div className="text-[var(--text-secondary)] text-sm mb-2">
              Total Solved
            </div>
            <div className="text-3xl font-bold text-[var(--accent-blue)]">
              {all?.solved?.toLocaleString() || 0}
            </div>
            <div className="text-sm text-[var(--text-secondary)] mt-2">
              out of {all?.total?.toLocaleString() || 0}
            </div>
          </div>
          <div className="platform-card p-6 rounded-xl fade-in-up delay-100 border-l-4 border-green-500">
            <div className="text-[var(--text-secondary)] text-sm mb-2">
              Easy
            </div>
            <div className="text-3xl font-bold text-green-400">
              {easy?.solved?.toLocaleString() || 0}
            </div>
            <div className="text-sm text-[var(--text-secondary)] mt-2">
              {easy?.submissions?.toLocaleString() || 0} submissions
            </div>
          </div>
          <div className="platform-card p-6 rounded-xl fade-in-up delay-200 border-l-4 border-yellow-500">
            <div className="text-[var(--text-secondary)] text-sm mb-2">
              Medium
            </div>
            <div className="text-3xl font-bold text-yellow-400">
              {medium?.solved?.toLocaleString() || 0}
            </div>
            <div className="text-sm text-[var(--text-secondary)] mt-2">
              {medium?.submissions?.toLocaleString() || 0} submissions
            </div>
          </div>
          <div className="platform-card p-6 rounded-xl fade-in-up delay-300 border-l-4 border-red-500">
            <div className="text-[var(--text-secondary)] text-sm mb-2">
              Hard
            </div>
            <div className="text-3xl font-bold text-red-400">
              {hard?.solved?.toLocaleString() || 0}
            </div>
            <div className="text-sm text-[var(--text-secondary)] mt-2">
              {hard?.submissions?.toLocaleString() || 0} submissions
            </div>
          </div>
        </div>
      </div>

      {/* Streak Data */}
      {stats.streakData && (
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4 text-[var(--text-primary)]">
            Streak & Activity
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <StatCard
              label="Current Streak"
              value={`${stats.streakData.currentStreak} days`}
              icon={RiFireLine}
            />
            <StatCard
              label="Total Active Days"
              value={stats.streakData.totalActiveDays}
              icon={FiCalendar}
            />
            <StatCard
              label="Active Years"
              value={stats.streakData.activeYears?.length || 0}
              icon={FiBarChart2}
            />
          </div>
        </div>
      )}

      {/* Contest Stats */}
      {stats.contestRanking && (
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4 text-[var(--text-primary)]">
            Contest Performance
          </h2>
          <div className="platform-card p-6 rounded-2xl">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div>
                <div className="text-[var(--text-secondary)] text-sm mb-2">
                  Rating
                </div>
                <div className="text-3xl font-bold text-purple-400">
                  {stats.contestRanking.rating}
                </div>
              </div>
              <div>
                <div className="text-[var(--text-secondary)] text-sm mb-2">
                  Global Rank
                </div>
                <div className="text-3xl font-bold text-cyan-400">
                  #{stats.contestRanking.globalRanking?.toLocaleString()}
                </div>
              </div>
              <div>
                <div className="text-[var(--text-secondary)] text-sm mb-2">
                  Top Percentage
                </div>
                <div className="text-3xl font-bold text-green-400">
                  {stats.contestRanking.topPercentage}%
                </div>
              </div>
              <div>
                <div className="text-[var(--text-secondary)] text-sm mb-2">
                  Badge
                </div>
                <div className="text-2xl font-bold text-yellow-400">
                  {stats.contestRanking.badge}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Skill Tags */}
      {stats.tagStats && (
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4 text-[var(--text-primary)]">
            Skills & Topics
          </h2>

          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-3 text-purple-400">
              Advanced Topics
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {stats.tagStats.advanced?.slice(0, 12).map((tag) => (
                <div key={tag.tagSlug} className="platform-card p-3 rounded-lg">
                  <div className="text-sm text-[var(--text-secondary)]">
                    {tag.tagName}
                  </div>
                  <div className="text-xl font-bold text-purple-400">
                    {tag.problemsSolved}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-3 text-[var(--accent-blue)]">
              Intermediate Topics
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {stats.tagStats.intermediate?.slice(0, 12).map((tag) => (
                <div key={tag.tagSlug} className="platform-card p-3 rounded-lg">
                  <div className="text-sm text-[var(--text-secondary)]">
                    {tag.tagName}
                  </div>
                  <div className="text-xl font-bold text-[var(--accent-blue)]">
                    {tag.problemsSolved}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-3 text-green-400">
              Fundamental Topics
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {stats.tagStats.fundamental?.map((tag) => (
                <div key={tag.tagSlug} className="platform-card p-3 rounded-lg">
                  <div className="text-sm text-[var(--text-secondary)]">
                    {tag.tagName}
                  </div>
                  <div className="text-xl font-bold text-green-400">
                    {tag.problemsSolved}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Language Stats */}
      {stats.languageStats && (
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4 text-[var(--text-primary)]">
            Programming Languages
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {stats.languageStats.slice(0, 12).map((lang) => (
              <div
                key={lang.languageName}
                className="platform-card p-4 rounded-xl text-center"
              >
                <div className="text-sm text-[var(--text-secondary)] mb-1">
                  {lang.languageName}
                </div>
                <div className="text-2xl font-bold text-cyan-400">
                  {lang.problemsSolved}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recent Submissions */}
      {stats.recentSubmissions && (
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4 text-[var(--text-primary)]">
            Recent Submissions
          </h2>
          <div className="platform-card p-6 rounded-2xl">
            <div className="space-y-3">
              {stats.recentSubmissions.slice(0, 10).map((sub, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-3 bg-[var(--bg-card-inner)] rounded-lg"
                >
                  <div className="text-[var(--text-primary)]">{sub.title}</div>
                  <div className="text-sm text-[var(--text-secondary)]">
                    {new Date(
                      parseInt(sub.timestamp) * 1000
                    ).toLocaleDateString()}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Badges */}
      {stats.badges && (
        <div>
          <h2 className="text-2xl font-bold mb-4 text-[var(--text-primary)]">
            Badges ({stats.badges.length})
          </h2>
          <div className="platform-card p-6 rounded-2xl">
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {stats.badges.slice(0, 24).map((badge) => (
                <div
                  key={badge.id}
                  className="flex flex-col items-center p-3 bg-[var(--bg-card-inner)] rounded-lg hover:bg-[var(--border-color)] transition-all"
                >
                  <img
                    src={badge.icon}
                    alt={badge.displayName}
                    className="w-12 h-12 mb-2"
                  />
                  <div className="text-xs text-center text-[var(--text-secondary)]">
                    {badge.displayName}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
