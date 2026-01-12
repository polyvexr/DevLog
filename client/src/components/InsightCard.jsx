import { useState } from "react";
import { FaLightbulb, FaFire, FaChartLine, FaExclamationTriangle, FaTrophy, FaTimes } from "react-icons/fa";
import api from "../api/axios";

/**
 * InsightCard - Displays actionable insights with icons and dismiss action
 */
export default function InsightCard({ insight, onDismiss }) {
  const [dismissing, setDismissing] = useState(false);

  const handleDismiss = async () => {
    try {
      setDismissing(true);
      await api.patch(`/insights/${insight._id}/dismiss`);
      onDismiss?.(insight._id);
    } catch (err) {
      console.error("Failed to dismiss insight:", err);
      setDismissing(false);
    }
  };

  const typeConfig = {
    rating_stagnant: {
      icon: FaExclamationTriangle,
      color: "text-yellow-400",
      bgColor: "bg-yellow-400/10",
      borderColor: "border-yellow-400/30",
    },
    topic_strength: {
      icon: FaTrophy,
      color: "text-green-400",
      bgColor: "bg-green-400/10",
      borderColor: "border-green-400/30",
    },
    topic_weakness: {
      icon: FaLightbulb,
      color: "text-blue-400",
      bgColor: "bg-blue-400/10",
      borderColor: "border-blue-400/30",
    },
    activity_drop: {
      icon: FaChartLine,
      color: "text-orange-400",
      bgColor: "bg-orange-400/10",
      borderColor: "border-orange-400/30",
    },
    streak_alert: {
      icon: FaFire,
      color: "text-red-400",
      bgColor: "bg-red-400/10",
      borderColor: "border-red-400/30",
    },
    milestone_reached: {
      icon: FaTrophy,
      color: "text-purple-400",
      bgColor: "bg-purple-400/10",
      borderColor: "border-purple-400/30",
    },
    consistency_praise: {
      icon: FaChartLine,
      color: "text-green-400",
      bgColor: "bg-green-400/10",
      borderColor: "border-green-400/30",
    },
    rating_improvement: {
      icon: FaChartLine,
      color: "text-green-400",
      bgColor: "bg-green-400/10",
      borderColor: "border-green-400/30",
    },
    problem_recommendation: {
      icon: FaLightbulb,
      color: "text-blue-400",
      bgColor: "bg-blue-400/10",
      borderColor: "border-blue-400/30",
    },
  };

  const config = typeConfig[insight.type] || {
    icon: FaLightbulb,
    color: "text-gray-400",
    bgColor: "bg-gray-400/10",
    borderColor: "border-gray-400/30",
  };

  const Icon = config.icon;

  const priorityBadge = {
    high: "bg-red-500/20 text-red-300",
    medium: "bg-yellow-500/20 text-yellow-300",
    low: "bg-gray-500/20 text-gray-300",
  };

  return (
    <div
      className={`relative group rounded-xl p-4 border backdrop-blur-sm transition-all duration-300 hover:scale-[1.02] ${config.bgColor} ${config.borderColor}`}
    >
      {/* Priority badge */}
      {insight.priority && (
        <span
          className={`absolute top-2 right-10 text-xs px-2 py-0.5 rounded-full ${
            priorityBadge[insight.priority]
          }`}
        >
          {insight.priority}
        </span>
      )}

      {/* Dismiss button */}
      <button
        onClick={handleDismiss}
        disabled={dismissing}
        className="absolute top-2 right-2 p-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity bg-gray-700/50 hover:bg-gray-600 text-gray-400 hover:text-white"
      >
        <FaTimes size={12} />
      </button>

      <div className="flex items-start gap-3">
        {/* Icon */}
        <div className={`p-2.5 rounded-lg ${config.bgColor}`}>
          <Icon className={config.color} size={20} />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <h4 className="text-white font-medium text-sm mb-1">{insight.title}</h4>
          <p className="text-gray-400 text-sm leading-relaxed">{insight.message}</p>

          {/* Platform badge */}
          {insight.platform && (
            <span className="inline-block mt-2 text-xs px-2 py-0.5 rounded-full bg-gray-700/50 text-gray-300 capitalize">
              {insight.platform}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
