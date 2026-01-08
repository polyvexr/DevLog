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
  const [confirmDialog, setConfirmDialog] = useState({
    open: false,
    platform: null,
  });
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

  const handleUnlink = (platform, e) => {
    if (e) e.stopPropagation();
    setConfirmDialog({ open: true, platform });
  };

  const doUnlink = async () => {
    const platform = confirmDialog.platform;
    setConfirmDialog({ open: false, platform: null });
    try {
      await api.delete(`/platforms/${platform}`);
      const res = await api.get("/stats/all");
      setStats(res.data.stats);
      fetchSummary();
      setMessageDialog({
        open: true,
        title: "Unlinked",
        message: `${platform} has been unlinked.`,
      });
    } catch (err) {
      const msg = err?.response?.data?.message || err.message || "Error";
      const retry = err?.response?.data?.retryAfter;
      if (retry) {
        const when = new Date(retry).toLocaleString();
        setMessageDialog({
          open: true,
          title: "Action blocked",
          message: `${msg}\n\nTry again after ${when}.`,
        });
      } else {
        setMessageDialog({ open: true, title: "Error", message: msg });
      }
    }
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
      <div className="mb-8 fade-in-scale">
        <h1 className="text-4xl font-black mb-3 text-[var(--text-primary)]">
          Dashboard
        </h1>
        <p className="text-[var(--text-secondary)] text-lg">
          Track your coding journey across platforms
        </p>
      </div>

      {/* Summary Section */}
      <SummarySection summary={summary} loading={summaryLoading} />

      {!stats ? (
        <Loader />
      ) : stats.length === 0 ? (
        <div className="glass-card p-12 rounded-2xl text-center">
          <FiBarChart2 className="text-6xl mb-4 opacity-30 mx-auto" />
          <h3 className="text-2xl font-bold mb-2 text-gray-300">
            No Stats Yet
          </h3>
          <p className="text-gray-500">
            Link your coding platforms to start tracking
          </p>
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
        open={confirmDialog.open}
        title="Confirm Unlink"
        message={
          confirmDialog.platform
            ? `Are you sure you want to unlink ${confirmDialog.platform}? You can re-add it after 15 days (one-time re-add allowed once).`
            : ""
        }
        confirmText="Unlink"
        cancelText="Cancel"
        onConfirm={doUnlink}
        onCancel={() => setConfirmDialog({ open: false, platform: null })}
      />

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
