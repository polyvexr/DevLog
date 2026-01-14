import { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
} from "recharts";
import api from "../api/axios";

/**
 * ProgressChart - Displays historical progress data with Recharts
 */
const periodDays = {
  week: 7,
  month: 30,
  quarter: 90,
};

export default function ProgressChart({ platform, metricKey, title, color = "#8884d8" }) {
  const [data, setData] = useState([]);
  const [period, setPeriod] = useState("week");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/history/${platform}?days=${periodDays[period]}`);
        
        if (response.data.success) {
          const history = response.data.history.map((h) => ({
            date: new Date(h.snapshotDate).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
            }),
            value: h.metrics?.[metricKey] || 0,
            fullDate: h.snapshotDate,
          }));
          setData(history);
        }
        setError(null);
      } catch (err) {
        setError("Failed to load history");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, [platform, period, metricKey]); // Added metricKey and periodDays is constant so it's fine

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-gray-800/95 backdrop-blur-sm border border-gray-700 rounded-lg px-3 py-2 shadow-xl">
          <p className="text-gray-400 text-xs">{label}</p>
          <p className="text-white font-semibold">
            {payload[0].value} {metricKey === "rating" ? "pts" : "solved"}
          </p>
        </div>
      );
    }
    return null;
  };

  if (loading) {
    return (
      <div className="bg-gray-800/50 rounded-xl p-6 animate-pulse">
        <div className="h-6 w-32 bg-gray-700 rounded mb-4"></div>
        <div className="h-48 bg-gray-700/50 rounded"></div>
      </div>
    );
  }

  if (error || data.length === 0) {
    return (
      <div className="bg-gray-800/50 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>
        <div className="h-48 flex items-center justify-center text-gray-500">
          {error || "No historical data yet. Check back tomorrow!"}
        </div>
      </div>
    );
  }

  // Calculate growth
  const firstValue = data[0]?.value || 0;
  const lastValue = data[data.length - 1]?.value || 0;
  const growth = lastValue - firstValue;
  const growthPercent = firstValue > 0 ? ((growth / firstValue) * 100).toFixed(1) : 0;

  return (
    <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700/50">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-white">{title}</h3>
          <p className="text-sm text-gray-400">
            {period === "week" ? "Last 7 days" : period === "month" ? "Last 30 days" : "Last 90 days"}
          </p>
        </div>
        
        {/* Growth indicator */}
        <div className={`text-right ${growth >= 0 ? "text-green-400" : "text-red-400"}`}>
          <span className="text-lg font-bold">
            {growth >= 0 ? "+" : ""}{growth}
          </span>
          <p className="text-xs opacity-75">
            {growth >= 0 ? "+" : ""}{growthPercent}%
          </p>
        </div>
      </div>

      {/* Period tabs */}
      <div className="flex gap-2 mb-4">
        {["week", "month", "quarter"].map((p) => (
          <button
            key={p}
            onClick={() => setPeriod(p)}
            className={`px-3 py-1 text-sm rounded-lg transition-colors ${
              period === p
                ? "bg-purple-600 text-white"
                : "bg-gray-700/50 text-gray-400 hover:bg-gray-700"
            }`}
          >
            {p.charAt(0).toUpperCase() + p.slice(1)}
          </button>
        ))}
      </div>

      {/* Chart */}
      <div className="h-48">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
            <defs>
              <linearGradient id={`gradient-${platform}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={color} stopOpacity={0.3} />
                <stop offset="95%" stopColor={color} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" vertical={false} />
            <XAxis
              dataKey="date"
              stroke="#6b7280"
              fontSize={11}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              stroke="#6b7280"
              fontSize={11}
              tickLine={false}
              axisLine={false}
              domain={["dataMin - 5", "dataMax + 5"]}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="value"
              stroke={color}
              strokeWidth={2}
              fill={`url(#gradient-${platform})`}
              dot={{ fill: color, strokeWidth: 0, r: 3 }}
              activeDot={{ r: 5, strokeWidth: 0 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
