import React from "react";
import { useNavigate } from "react-router-dom";
import { useInsights } from "../hooks/useApi";
import FullPageLoader from "../components/FullPageLoader";
import { FiTrendingUp, FiTarget, FiAward, FiAlertCircle, FiCheck, FiX } from "react-icons/fi";

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
  milestone: { bg: "bg-purple-500/10", border: "border-purple-500/20", text: "text-purple-400", icon: "text-purple-400" },
  trend: { bg: "bg-blue-500/10", border: "border-blue-500/20", text: "text-blue-400", icon: "text-blue-400" },
  goal: { bg: "bg-green-500/10", border: "border-green-500/20", text: "text-green-400", icon: "text-green-400" },
  alert: { bg: "bg-yellow-500/10", border: "border-yellow-500/20", text: "text-yellow-400", icon: "text-yellow-400" },
};

export default function Insights() {
  const navigate = useNavigate();
  const { insights, loading, dismissInsight, refresh } = useInsights();

  if (loading) return <FullPageLoader />;

  const unreadInsights = insights.filter(i => !i.read);
  const readInsights = insights.filter(i => i.read);

  const handleDismiss = async (id) => {
    await dismissInsight(id);
    // Hook automatically updates state
  };

  return (
    <div className="max-w-5xl mx-auto py-8 px-4">
      <button
        onClick={() => navigate("/")}
        className="mb-10 text-gray-400 hover:text-white flex items-center gap-2 group transition-all"
      >
        <span className="group-hover:-translate-x-1 transition-transform">←</span>
        <span className="font-bold uppercase tracking-widest text-[10px]">Command Center</span>
      </button>

      <div className="mb-16">
        <h1 className="text-6xl md:text-8xl font-black mb-6 tracking-tight italic">
          AI <span className="animate-text-shine">Insights</span>
        </h1>
        <p className="text-gray-400 text-xl font-medium max-w-2xl leading-relaxed">
          Predictive analytics and optimization strategies derived from your neural coding patterns.
        </p>
      </div>

      {insights.length === 0 ? (
        <div className="glass-card-premium p-24 text-center">
           <div className="text-6xl mb-8 opacity-20">🔮</div>
           <h3 className="text-3xl font-black text-white mb-4 italic uppercase">Oracle Silent</h3>
           <p className="text-gray-500 max-w-md mx-auto font-medium">Continue your coding cycles to generate sufficient behavioral data for AI analysis.</p>
        </div>
      ) : (
        <div className="space-y-16">
          {unreadInsights.length > 0 && (
            <div>
              <h2 className="text-2xl font-black mb-8 text-white uppercase tracking-widest flex items-center gap-4">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                Active Signals
                <span className="bg-blue-500/20 text-blue-400 text-xs px-3 py-1 rounded-full font-black">
                  {unreadInsights.length}
                </span>
              </h2>
              <div className="grid gap-8">
                {unreadInsights.map((insight) => {
                  const category = getInsightCategory(insight.type);
                  const Icon = insightIcons[category] || FiTrendingUp;
                  const colors = insightColors[category] || insightColors.trend;
                  
                  return (
                    <div key={insight._id} className={`glass-card-premium p-8 group hover:scale-[1.01] transition-all border-none ring-1 ${colors.border}`}>
                      <div className="flex items-start gap-8">
                        <div className={`w-16 h-16 rounded-3xl ${colors.bg} flex items-center justify-center shrink-0 shadow-2xl`}>
                          <Icon className={`w-8 h-8 ${colors.icon}`} />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-start justify-between gap-6">
                            <div>
                               <div className="flex items-center gap-3 mb-2">
                                  <h3 className="text-2xl font-black text-white italic">{insight.title}</h3>
                                  {insight.platform && (
                                    <span className="px-2 py-0.5 bg-white/5 rounded text-[10px] font-black text-gray-500 uppercase tracking-widest">{insight.platform}</span>
                                  )}
                               </div>
                               <p className="text-gray-400 text-lg leading-relaxed max-w-3xl">{insight.message}</p>
                            </div>
                            <div className="flex gap-3">
                               <button 
                                 onClick={() => handleDismiss(insight._id)}
                                 className="p-3 glass-card-premium hover:bg-red-500/20 text-gray-500 hover:text-red-400 transition-all border-none"
                               >
                                 <FiX className="w-5 h-5" />
                               </button>
                            </div>
                          </div>
                          <div className="mt-8 text-[10px] font-black text-gray-600 uppercase tracking-[0.2em]">
                             Generated {new Date(insight.createdAt).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {readInsights.length > 0 && (
            <div className="opacity-40 hover:opacity-100 transition-all duration-500">
               <h2 className="text-xl font-black mb-8 text-gray-500 uppercase tracking-widest">Signal Archive</h2>
               <div className="grid gap-4">
                  {readInsights.map((insight) => {
                    const category = getInsightCategory(insight.type);
                    const Icon = insightIcons[category] || FiTrendingUp;
                    return (
                      <div key={insight._id} className="glass-card-premium p-6 flex items-center justify-between group">
                         <div className="flex items-center gap-6">
                            <Icon className="w-5 h-5 text-gray-600" />
                            <div>
                               <div className="font-black text-gray-400 uppercase text-xs">{insight.title}</div>
                               <div className="text-sm text-gray-600 truncate max-w-md">{insight.message}</div>
                            </div>
                         </div>
                         <button onClick={() => handleDismiss(insight._id)} className="p-2 opacity-0 group-hover:opacity-100 hover:text-red-500 transition-all">
                            <FiX className="w-4 h-4" />
                         </button>
                      </div>
                    );
                  })}
               </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
