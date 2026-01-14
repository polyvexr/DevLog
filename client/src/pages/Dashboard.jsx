import Loader from "../components/Loader";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api, { getStatsSummary, refreshPlatformStats, getInsights, getNotifications } from "../api/axios";
import Dialog from "../components/Dialog";
import FilterButtons from "../components/FilterButtons";
import PlatformCard from "../components/PlatformCard";
import SummarySection from "../components/SummarySection";
import { FiBarChart2, FiTrendingUp, FiClock, FiBell } from "react-icons/fi";

// Filter persistence key
const FILTER_STORAGE_KEY = "dashboardFilter";

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [summary, setSummary] = useState(null);
  const [summaryLoading, setSummaryLoading] = useState(true);
  const [insightsCount, setInsightsCount] = useState(0);
  const [notificationsCount, setNotificationsCount] = useState(0);
  const [activeFilter, setActiveFilter] = useState(() => {
    return localStorage.getItem(FILTER_STORAGE_KEY) || "all";
  });
  const navigate = useNavigate();
  const [messageDialog, setMessageDialog] = useState({
    open: false,
    title: "",
    message: "",
    type: "info", // success, error, info, warning
  });

  // Filter change handler with localStorage persistence
  const handleFilterChange = (filter) => {
    setActiveFilter(filter);
    localStorage.setItem(FILTER_STORAGE_KEY, filter);
  };

  // Filter stats based on progress
  const getFilteredStats = () => {
    if (!stats) return [];
    if (activeFilter === "all") return stats;

    return stats.filter((item) => {
      const progress = item.progress || 0;
      switch (activeFilter) {
        case "high":
          return progress > 66;
        case "medium":
          return progress >= 33 && progress <= 66;
        case "low":
          return progress < 33;
        default:
          return true;
      }
    });
  };

  // Refresh handler
  const handleRefresh = async (platform) => {
    try {
      const res = await refreshPlatformStats(platform);
      const updatedStat = res.data.data?.stat || res.data.stat;
      
      // Update the stats with the refreshed data
      setStats((prevStats) =>
        prevStats.map((s) => (s.platform === platform ? updatedStat : s))
      );
      // Refresh summary too
      fetchSummary();
      setMessageDialog({
        open: true,
        title: "Stats Updated",
        message: `${platform} stats have been refreshed successfully.`,
        type: "success",
      });
    } catch (err) {
      const msg =
        err?.response?.data?.message || err.message || "Error refreshing stats";
      setMessageDialog({ open: true, title: "Refresh Failed", message: msg, type: "error" });
    }
  };

  // Navigate to platform detail
  const handlePlatformClick = (platform) => {
    navigate(`/${platform}`);
  };



  const fetchSummary = async () => {
    try {
      const res = await getStatsSummary();
      setSummary(res.data.summary);
    } catch (err) {
      console.error("Failed to fetch summary:", err);
    } finally {
      setSummaryLoading(false);
    }
  };

  useEffect(() => {
    api
      .get("/stats/all")
      .then((res) => {
        const statsData = res.data.data?.stats || res.data.stats || [];
        setStats(statsData);
      })
      .catch(() => setStats([]));

    fetchSummary();
    
    // Fetch insights count for badge
    getInsights()
      .then((res) => {
        const insights = res.data.data?.insights || res.data.insights || [];
        const unread = insights.filter(i => !i.read).length;
        setInsightsCount(unread);
      })
      .catch(() => {});

    // Fetch notifications count
    getNotifications()
      .then((res) => {
        const notifications = res.data.data?.notifications || res.data.notifications || [];
        const unread = notifications.filter(n => !n.read).length;
        setNotificationsCount(unread);
      })
      .catch(() => {});
  }, []);

  const filteredStats = getFilteredStats();

  return (
    <>
      <div className="mb-12 fade-in-scale">
        <h1 className="text-5xl md:text-8xl font-black mb-4 tracking-tight">
          <span className="text-white opacity-90">Developer</span>
          <br />
          <span className="animate-text-shine inline-block">Command Center</span>
        </h1>
        <p className="text-gray-400 text-xl md:text-2xl font-medium max-w-2xl leading-relaxed">
          Quantify your secondary consciousness. Track your neural coding progress across the global ecosystem.
        </p>
        
        {/* Quick Action Buttons */}
        <div className="flex gap-4 mt-8">
          <button
            onClick={() => navigate("/insights")}
            className="px-6 py-3 bg-purple-600/20 hover:bg-purple-600/30 text-purple-400 font-bold rounded-xl transition-all flex items-center gap-3 ring-1 ring-purple-500/20"
          >
            <FiTrendingUp className="w-5 h-5" />
            Insights
            {insightsCount > 0 && (
              <span className="bg-purple-500 text-white text-xs font-black px-2 py-0.5 rounded-full">
                {insightsCount}
              </span>
            )}
          </button>
          <button
            onClick={() => navigate("/history")}
            className="px-6 py-3 bg-cyan-600/20 hover:bg-cyan-600/30 text-cyan-400 font-bold rounded-xl transition-all flex items-center gap-3 ring-1 ring-cyan-500/20"
          >
            <FiClock className="w-5 h-5" />
            History
          </button>
          <button
            onClick={() => navigate("/notifications")}
            className="px-6 py-3 bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 font-bold rounded-xl transition-all flex items-center gap-3 ring-1 ring-blue-500/20"
          >
            <FiBell className="w-5 h-5" />
            Feed
            {notificationsCount > 0 && (
              <span className="bg-blue-500 text-white text-xs font-black px-2 py-0.5 rounded-full">
                {notificationsCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Summary Section */}
      <SummarySection summary={summary} loading={summaryLoading} />

      {!stats ? (
        <Loader />
      ) : stats.length === 0 ? (
        <div className="glass-card-premium p-16 md:p-24 text-center fade-in-up">
          <div className="w-24 h-24 bg-blue-600/10 border border-blue-500/20 rounded-3xl flex items-center justify-center mx-auto mb-10 shadow-2xl pulse-ring">
            <FiBarChart2 className="text-5xl text-blue-500" />
          </div>
          <h3 className="text-4xl font-black mb-4 text-white italic">
            System <span className="text-gray-600">Offline</span>
          </h3>
          <p className="text-gray-500 text-xl max-w-md mx-auto mb-12 font-medium leading-relaxed">
            No neural nodes are currently synchronized. Initialize your ecosystems to begin data aggregation.
          </p>
          <button 
            onClick={() => navigate('/link')}
            className="px-10 py-5 bg-blue-600 hover:bg-blue-500 text-white font-black text-lg rounded-2xl transition-all shadow-2xl shadow-blue-500/30 active:scale-95 group"
          >
            Connect Hub <span className="inline-block group-hover:translate-x-2 transition-transform ml-2">→</span>
          </button>
        </div>
      ) : (
        <>
          {/* Filter Buttons */}
          <div className="mb-6">
            <FilterButtons
              activeFilter={activeFilter}
              onFilterChange={handleFilterChange}
            />
          </div>

          {/* Platform Cards Grid */}
          {filteredStats.length === 0 ? (
            <div className="glass-card p-8 rounded-2xl text-center">
              <p className="text-[var(--text-secondary)]">
                No platforms match the selected filter. Try a different filter.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredStats.map((item) => (
                <PlatformCard
                  key={item._id}
                  platform={item.platform}
                  stats={item.stats}
                  username={item.username}
                  progress={item.progress || 0}
                  canRefresh={item.canRefresh}
                  nextRefreshAvailable={item.nextRefreshAvailable}
                  onRefresh={handleRefresh}
                  onClick={() => handlePlatformClick(item.platform)}
                />
              ))}
            </div>
          )}
        </>
      )}

      <Dialog
        open={messageDialog.open}
        title={messageDialog.title}
        message={messageDialog.message}
        type={messageDialog.type}
        confirmText="OK"
        cancelText=""
        onConfirm={() =>
          setMessageDialog({ open: false, title: "", message: "" })
        }
        onCancel={() =>
          setMessageDialog({ open: false, title: "", message: "" })
        }
      />
    </>
  );
}
