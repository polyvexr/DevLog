import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDashboard, usePlatformRefresh } from "../hooks/useApi";
import FullPageLoader from "../components/FullPageLoader";
import Dialog from "../components/Dialog";
import PlatformCard from "../components/PlatformCard";
import SummarySection from "../components/SummarySection";
import { FiBarChart2 } from "react-icons/fi";

export default function Dashboard() {
  const navigate = useNavigate();
  const { data, loading, error, refresh } = useDashboard();
  const { refresh: triggerRefresh } = usePlatformRefresh();

  const [messageDialog, setMessageDialog] = useState({
    open: false,
    title: "",
    message: "",
    type: "info"
  });

  const handleRefresh = async (platform) => {
    const success = await triggerRefresh(platform, () => {
      refresh(); // Reload all data
      setMessageDialog({
        open: true,
        title: "Stats Updated",
        message: `${platform} stats have been refreshed successfully.`,
        type: "success",
      });
    });

    if (!success) {
      setMessageDialog({
        open: true,
        title: "Refresh Refused",
        message: "This node is currently on a cooldown cycle. Please try again later.",
        type: "warning"
      });
    }
  };

  if (loading && !data) return <FullPageLoader />;

  const stats = data?.platforms || [];
  const summary = data?.summary || null;
  const username = data?.user?.email?.split('@')[0] || "Developer";

  return (
    <>
      <div className="mb-12 fade-in-scale">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[10px] font-black uppercase tracking-widest mb-6">
          System Access Granted • Welcome, {username}
        </div>
        <h1 className="text-5xl md:text-8xl font-black mb-4 tracking-tight">
          <span className="text-white opacity-90 italic">Your Coding</span>
          <br />
          <span className="animate-text-shine inline-block italic">Dashboard</span>
        </h1>
        <p className="text-gray-400 text-xl md:text-2xl font-medium max-w-2xl leading-relaxed">
          Monitor your coding activity across the multiverse in real-time. Everything is synchronized.
        </p>
      </div>

      <SummarySection summary={summary} loading={false} />

      {stats.length === 0 ? (
        <div className="glass-card-premium p-16 md:p-24 text-center fade-in-up">
          <div className="w-24 h-24 bg-blue-600/10 border border-blue-500/20 rounded-3xl flex items-center justify-center mx-auto mb-10 shadow-2xl pulse-ring">
            <FiBarChart2 className="text-5xl text-blue-500" />
          </div>
          <h3 className="text-4xl font-black mb-4 text-white italic lowercase">No Accounts Linked</h3>
          <p className="text-gray-500 text-xl max-w-md mx-auto mb-12 font-medium leading-relaxed">
            You haven't connected any platforms yet. Connect your accounts to see your combined stats here.
          </p>
          <button
            onClick={() => navigate('/link')}
            className="px-10 py-5 bg-blue-600 hover:bg-blue-500 text-white font-black text-lg rounded-2xl transition-all shadow-2xl shadow-blue-500/30 active:scale-95 group uppercase tracking-widest"
          >
            Connect Account <span className="inline-block group-hover:translate-x-2 transition-transform ml-2">→</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {stats.map((item) => (
            <PlatformCard
              key={item.platform}
              platform={item.platform}
              stats={item.stats}
              username={item.username}

              canRefresh={item.canRefresh}
              nextRefreshAvailable={item.nextRefreshAvailable}
              onRefresh={handleRefresh}
              onClick={() => navigate(`/${item.platform}`)}
            />
          ))}
        </div>
      )}

      <Dialog
        open={messageDialog.open}
        title={messageDialog.title}
        message={messageDialog.message}
        type={messageDialog.type}
        confirmText="Got it"
        onConfirm={() => setMessageDialog(prev => ({ ...prev, open: false }))}
      />
    </>
  );
}
