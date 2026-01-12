import Loader from "../components/Loader";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api, { getStatsSummary, refreshPlatformStats } from "../api/axios";
import Dialog from "../components/Dialog";
import FilterButtons from "../components/FilterButtons";
import PlatformCard from "../components/PlatformCard";
import SummarySection from "../components/SummarySection";
import { FiBarChart2 } from "react-icons/fi";

// Filter persistence key
const FILTER_STORAGE_KEY = "dashboardFilter";

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [summary, setSummary] = useState(null);
  const [summaryLoading, setSummaryLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState(() => {
    return localStorage.getItem(FILTER_STORAGE_KEY) || "all";
  });
  const navigate = useNavigate();
  const [messageDialog, setMessageDialog] = useState({
    open: false,
    title: "",
    message: "",
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
      // Update the stats with the refreshed data
      setStats((prevStats) =>
        prevStats.map((s) => (s.platform === platform ? res.data.stat : s))
      );
      // Refresh summary too
      fetchSummary();
      setMessageDialog({
        open: true,
        title: "Stats Updated",
        message: `${platform} stats have been refreshed successfully.`,
      });
    } catch (err) {
      const msg =
        err?.response?.data?.message || err.message || "Error refreshing stats";
      setMessageDialog({ open: true, title: "Refresh Failed", message: msg });
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
      .then((res) => setStats(res.data.stats))
      .catch(() => setStats([]));

    fetchSummary();
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
