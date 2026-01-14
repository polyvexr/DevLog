import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Loader from "../components/Loader";
import { getAllHistory } from "../api/axios";
import { SiLeetcode, SiCodeforces, SiGithub, SiCodechef } from "react-icons/si";

const platformIcons = {
  leetcode: SiLeetcode,
  codeforces: SiCodeforces,
  github: SiGithub,
  codechef: SiCodechef,
  atcoder: null,
};

const platformColors = {
  leetcode: "#FFA116",
  codeforces: "#1F8ACB",
  github: "#FFFFFF",
  codechef: "#5B4638",
  atcoder: "#222222",
};

export default function History() {
  const [history, setHistory] = useState({});
  const [loading, setLoading] = useState(true);
  const [selectedPlatform, setSelectedPlatform] = useState("all");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await getAllHistory();
        const data = res.data.data?.history || res.data.history || {};
        setHistory(data);
        
        // Set first available platform as default
        const platforms = Object.keys(data);
        if (platforms.length > 0) {
          setSelectedPlatform(platforms[0]);
        }
      } catch {
        console.error("Failed to fetch history");
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, []);

  if (loading) return <Loader />;

  const platforms = Object.keys(history);
  const selectedData = selectedPlatform === "all" 
    ? Object.values(history).flat() 
    : history[selectedPlatform] || [];

  // Sort by date
  const sortedData = [...selectedData].sort((a, b) => 
    new Date(a.snapshotDate) - new Date(b.snapshotDate)
  );


  // Calculate progress between first and last snapshot
  const calculateProgress = (platform) => {
    const data = history[platform] || [];
    if (data.length < 2) return null;
    
    const sorted = [...data].sort((a, b) => 
      new Date(a.snapshotDate) - new Date(b.snapshotDate)
    );
    
    const first = sorted[0]?.metrics || {};
    const last = sorted[sorted.length - 1]?.metrics || {};
    
    const metrics = {};
    Object.keys(last).forEach(key => {
      if (typeof last[key] === 'number' && typeof first[key] === 'number') {
        metrics[key] = last[key] - first[key];
      }
    });
    
    return metrics;
  };

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
          <span className="text-white opacity-90">Progress</span>
          <br />
          <span className="animate-text-shine inline-block">History</span>
        </h1>
        <p className="text-gray-400 text-xl font-medium">
          Track your coding journey over time.
        </p>
      </div>

      {platforms.length === 0 ? (
        <div className="glass-card-premium p-12 text-center">
          <div className="text-6xl mb-6">📊</div>
          <h3 className="text-2xl font-bold text-white mb-4">No History Available</h3>
          <p className="text-gray-400 max-w-md mx-auto">
            History snapshots are created daily. Link your platforms and check back tomorrow!
          </p>
        </div>
      ) : (
        <>
          {/* Platform Selector */}
          <div className="flex flex-wrap gap-3 mb-10 fade-in-up">
            {platforms.map((platform) => {
              const Icon = platformIcons[platform];
              const isSelected = selectedPlatform === platform;
              const color = platformColors[platform];
              
              return (
                <button
                  key={platform}
                  onClick={() => setSelectedPlatform(platform)}
                  className={`px-5 py-3 rounded-xl flex items-center gap-3 transition-all ${
                    isSelected
                      ? "bg-white/10 ring-2 ring-white/20"
                      : "bg-white/5 hover:bg-white/10"
                  }`}
                >
                  {Icon ? (
                    <Icon style={{ color: isSelected ? color : "#9CA3AF" }} />
                  ) : (
                    <span 
                      className="w-5 h-5 flex items-center justify-center font-bold text-xs rounded"
                      style={{ 
                        backgroundColor: isSelected ? color : "#374151",
                        color: "#FFFFFF"
                      }}
                    >
                      AT
                    </span>
                  )}
                  <span className={`font-bold capitalize ${isSelected ? "text-white" : "text-gray-400"}`}>
                    {platform}
                  </span>
                  <span className="text-xs bg-white/10 px-2 py-0.5 rounded-full text-gray-500">
                    {(history[platform] || []).length}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Progress Summary */}
          {selectedPlatform !== "all" && (
            <div className="mb-10">
              <h2 className="text-xl font-black mb-6 text-white uppercase tracking-widest flex items-center gap-3">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                Progress Summary
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {(() => {
                  const progress = calculateProgress(selectedPlatform);
                  if (!progress) return (
                    <div className="col-span-full text-gray-500 text-center py-4">
                      Need at least 2 snapshots to calculate progress
                    </div>
                  );
                  
                  return Object.entries(progress).map(([key, value]) => (
                    <div key={key} className="glass-card-premium p-6">
                      <div className="text-xs font-black uppercase tracking-widest text-gray-500 mb-2">
                        {key.replace(/([A-Z])/g, " $1").trim()}
                      </div>
                      <div className={`text-3xl font-black ${value >= 0 ? "text-green-400" : "text-red-400"}`}>
                        {value >= 0 ? "+" : ""}{value}
                      </div>
                    </div>
                  ));
                })()}
              </div>
            </div>
          )}

          {/* Snapshot Timeline */}
          <div>
            <h2 className="text-xl font-black mb-6 text-white uppercase tracking-widest flex items-center gap-3">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
              Snapshot Timeline
            </h2>
            
            {sortedData.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                No snapshots available for this platform
              </div>
            ) : (
              <div className="space-y-4">
                {sortedData.slice(-30).reverse().map((snapshot, idx) => {
                  const platform = snapshot.platform;
                  const Icon = platformIcons[platform];
                  const color = platformColors[platform];
                  const metrics = snapshot.metrics || {};
                  
                  return (
                    <div 
                      key={snapshot._id || idx} 
                      className="glass-card-premium p-6 hover:bg-white/5 transition-all"
                    >
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-4">
                          {Icon ? (
                            <Icon className="w-5 h-5" style={{ color }} />
                          ) : (
                            <span 
                              className="w-5 h-5 flex items-center justify-center font-bold text-xs rounded text-white"
                              style={{ backgroundColor: color }}
                            >
                              AT
                            </span>
                          )}
                          <span className="font-bold text-white capitalize">{platform}</span>
                        </div>
                        <span className="text-sm text-gray-500 font-medium">
                          {new Date(snapshot.snapshotDate).toLocaleDateString("en-US", {
                            weekday: "short",
                            month: "short",
                            day: "numeric",
                            year: "numeric"
                          })}
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {Object.entries(metrics).map(([key, value]) => (
                          <div key={key} className="bg-white/5 rounded-xl p-3">
                            <div className="text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-1">
                              {key.replace(/([A-Z])/g, " $1").trim()}
                            </div>
                            <div className="text-lg font-black text-white">
                              {typeof value === 'number' ? value.toLocaleString() : value ?? "—"}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </>
      )}
    </>
  );
}
