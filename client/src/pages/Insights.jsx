import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Loader from "../components/Loader";
import { getInsights, markInsightRead, dismissInsight } from "../api/axios";
import { FiTrendingUp, FiTarget, FiAward, FiAlertCircle, FiCheck, FiX } from "react-icons/fi";

// Map server types to UI categories
const typeToCategory = {
  rating_stagnant: "alert",
  topic_strength: "milestone",
  topic_weakness: "alert",
  activity_drop: "alert",
  streak_alert: "alert",
  milestone_reached: "milestone",
  consistency_praise: "milestone",
  rating_improvement: "trend",
  problem_recommendation: "goal",
};

const getInsightCategory = (type) => typeToCategory[type] || "trend";

const insightIcons = {
  milestone: FiAward,
  trend: FiTrendingUp,
  goal: FiTarget,
  alert: FiAlertCircle,
};

const insightColors = {
  milestone: { bg: "bg-purple-500/10", border: "border-purple-500/20", text: "text-purple-400", icon: "text-purple-500" },
  trend: { bg: "bg-blue-500/10", border: "border-blue-500/20", text: "text-blue-400", icon: "text-blue-500" },
  goal: { bg: "bg-green-500/10", border: "border-green-500/20", text: "text-green-400", icon: "text-green-500" },
  alert: { bg: "bg-yellow-500/10", border: "border-yellow-500/20", text: "text-yellow-400", icon: "text-yellow-500" },
};


export default function Insights() {
  const [insights, setInsights] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const fetchInsights = async () => {
    try {
      const res = await getInsights();
      setInsights(res.data.data?.insights || res.data.insights || []);
    } catch {
      setError("Failed to load insights");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInsights();
  }, []);

  const handleMarkRead = async (id) => {
    try {
      await markInsightRead(id);
      setInsights(insights.map(i => i._id === id ? { ...i, read: true } : i));
    } catch {
      console.error("Failed to mark insight as read");
    }
  };

  const handleDismiss = async (id) => {
    try {
      await dismissInsight(id);
      setInsights(insights.filter(i => i._id !== id));
    } catch {
      console.error("Failed to dismiss insight");
    }
  };

  if (loading) return <Loader />;

  const unreadInsights = insights.filter(i => !i.read);
  const readInsights = insights.filter(i => i.read);

  return (
    <>
      <button
        onClick={() => navigate("/")}
        className="mb-10 text-gray-400 hover:text-white flex items-center gap-2 group transition-all fade-in-scale"
      >
        <span className="group-hover:-translate-x-1 transition-transform">←</span>
        <span className="font-bold uppercase tracking-widest text-xs">Return to Command Center</span>
      </button>

      <div className="mb-12 fade-in-scale">
        <h1 className="text-5xl md:text-6xl font-black mb-4 tracking-tight">
          <span className="text-white opacity-90">AI</span>
          <br />
          <span className="animate-text-shine inline-block">Insights</span>
        </h1>
        <p className="text-gray-400 text-xl font-medium">
          Personalized recommendations based on your coding activity.
        </p>
      </div>

      {error && (
        <div className="mb-8 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400">
          {error}
        </div>
      )}

      {insights.length === 0 ? (
        <div className="glass-card-premium p-12 text-center">
          <div className="text-6xl mb-6">🔮</div>
          <h3 className="text-2xl font-bold text-white mb-4">No Insights Yet</h3>
          <p className="text-gray-400 max-w-md mx-auto">
            Keep coding and linking platforms! Our AI will analyze your progress and provide personalized insights.
          </p>
        </div>
      ) : (
        <div className="space-y-12">
          {/* Unread Insights */}
          {unreadInsights.length > 0 && (
            <div>
              <h2 className="text-2xl font-black mb-8 text-white uppercase tracking-widest flex items-center gap-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                New Insights
                <span className="bg-blue-500/20 text-blue-400 text-sm px-3 py-1 rounded-full font-bold">
                  {unreadInsights.length}
                </span>
              </h2>
              <div className="grid gap-6">
                {unreadInsights.map((insight) => {
                  const category = getInsightCategory(insight.type);
                  const Icon = insightIcons[category] || FiTrendingUp;
                  const colors = insightColors[category] || insightColors.trend;
                  
                  return (
                    <div 
                      key={insight._id} 
                      className={`glass-card-premium p-8 ${colors.bg} ${colors.border} border transition-all hover:scale-[1.01]`}
                    >
                      <div className="flex items-start gap-6">
                        <div className={`w-14 h-14 rounded-2xl ${colors.bg} flex items-center justify-center shrink-0`}>
                          <Icon className={`w-7 h-7 ${colors.icon}`} />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-start justify-between gap-4">
                            <div>
                              <h3 className="text-xl font-bold text-white mb-2">{insight.title}</h3>
                              <p className="text-gray-400 leading-relaxed">{insight.message}</p>
                              {insight.platform && (
                                <span className="inline-block mt-3 px-3 py-1 bg-white/5 rounded-lg text-xs font-bold text-gray-500 uppercase">
                                  {insight.platform}
                                </span>
                              )}
                            </div>
                            <div className="flex gap-2 shrink-0">
                              <button
                                onClick={() => handleMarkRead(insight._id)}
                                className="p-2 rounded-xl bg-white/5 hover:bg-green-500/20 text-gray-400 hover:text-green-400 transition-all"
                                title="Mark as read"
                              >
                                <FiCheck className="w-5 h-5" />
                              </button>
                              <button
                                onClick={() => handleDismiss(insight._id)}
                                className="p-2 rounded-xl bg-white/5 hover:bg-red-500/20 text-gray-400 hover:text-red-400 transition-all"
                                title="Dismiss"
                              >
                                <FiX className="w-5 h-5" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="mt-4 text-xs text-gray-500 font-medium">
                        {new Date(insight.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Read Insights */}
          {readInsights.length > 0 && (
            <div>
              <h2 className="text-xl font-black mb-6 text-gray-500 uppercase tracking-widest">
                Previous Insights
              </h2>
              <div className="grid gap-4">
                {readInsights.map((insight) => {
                  const category = getInsightCategory(insight.type);
                  const Icon = insightIcons[category] || FiTrendingUp;
                  
                  return (
                    <div 
                      key={insight._id} 
                      className="glass-card-premium p-6 opacity-60 hover:opacity-100 transition-all"
                    >
                      <div className="flex items-center gap-4">
                        <Icon className="w-5 h-5 text-gray-500" />
                        <div className="flex-1">
                          <h3 className="font-bold text-gray-400">{insight.title}</h3>
                          <p className="text-sm text-gray-500 truncate">{insight.message}</p>
                        </div>
                        <button
                          onClick={() => handleDismiss(insight._id)}
                          className="p-2 rounded-xl hover:bg-red-500/20 text-gray-500 hover:text-red-400 transition-all"
                        >
                          <FiX className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
}
