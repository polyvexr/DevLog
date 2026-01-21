import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useHistory } from "../hooks/useApi";
import FullPageLoader from "../components/FullPageLoader";
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
  const navigate = useNavigate();
  const { data: history, loading } = useHistory();
  const [selectedPlatform, setSelectedPlatform] = useState("all");

  useEffect(() => {
    if (history && Object.keys(history).length > 0 && selectedPlatform === "all") {
      setSelectedPlatform(Object.keys(history)[0]);
    }
  }, [history]);

  if (loading) return <FullPageLoader />;

  const platforms = history ? Object.keys(history) : [];
  const selectedData = selectedPlatform === "all" 
    ? [] 
    : history[selectedPlatform] || [];

  const sortedData = [...selectedData].sort((a, b) => 
    new Date(a.snapshotDate) - new Date(b.snapshotDate)
  );

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
    <div className="max-w-7xl mx-auto py-8 px-4">
      <button
        onClick={() => navigate("/")}
        className="mb-10 text-gray-400 hover:text-white flex items-center gap-2 group transition-all"
      >
        <span className="group-hover:-translate-x-1 transition-transform">←</span>
        <span className="font-bold uppercase tracking-widest text-[10px]">Command Center</span>
      </button>

      <div className="mb-16">
        <h1 className="text-6xl md:text-8xl font-black mb-6 tracking-tight italic">
          Progress <span className="animate-text-shine">History</span>
        </h1>
        <p className="text-gray-400 text-xl font-medium max-w-2xl leading-relaxed">
          The chronicled evolution of your neural processing capability across the global ecosystem.
        </p>
      </div>

      {platforms.length === 0 ? (
        <div className="glass-card-premium p-24 text-center">
           <div className="text-6xl mb-8 opacity-20">📊</div>
           <h3 className="text-3xl font-black text-white mb-4 italic uppercase">Archive Empty</h3>
           <p className="text-gray-500 max-w-md mx-auto font-medium">History snapshots are generated during synchronization cycles. Initialize your nodes to begin archiving progress.</p>
        </div>
      ) : (
        <>
          <div className="flex flex-wrap gap-4 mb-12">
            {platforms.map((platform) => {
              const Icon = platformIcons[platform];
              const isSelected = selectedPlatform === platform;
              const color = platformColors[platform];
              
              return (
                <button
                  key={platform}
                  onClick={() => setSelectedPlatform(platform)}
                  className={`px-6 py-4 rounded-2xl flex items-center gap-4 transition-all duration-300 ${
                    isSelected
                      ? "glass-card-premium ring-2 ring-white/20 scale-105"
                      : "bg-white/5 hover:bg-white/10 opacity-50 hover:opacity-100"
                  }`}
                >
                  {Icon ? <Icon style={{ color: isSelected ? color : "#9CA3AF" }} /> : <span className="p-1 bg-white/10 rounded font-black text-[10px] text-white">AT</span>}
                  <span className={`font-black uppercase tracking-widest text-xs ${isSelected ? "text-white" : "text-gray-500"}`}>
                    {platform}
                  </span>
                  <span className="text-[10px] font-black bg-white/5 px-2 py-0.5 rounded-lg text-gray-500">
                    {(history[platform] || []).length} Snapshots
                  </span>
                </button>
              );
            })}
          </div>

          {selectedPlatform !== "all" && (
            <div className="mb-20">
              <h2 className="text-2xl font-black mb-8 text-white uppercase tracking-widest flex items-center gap-3">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                Evolutionary Vector
              </h2>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                {(() => {
                  const progress = calculateProgress(selectedPlatform);
                  if (!progress) return (
                    <div className="col-span-full glass-card-premium p-12 text-center text-gray-500 font-bold uppercase tracking-widest">
                       Dual snapshots required for progress computation
                    </div>
                  );
                  
                  return Object.entries(progress).map(([key, value]) => (
                    <div key={key} className="glass-card-premium p-8 group hover:bg-white/5 transition-all">
                      <div className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-4 group-hover:text-white transition-colors">
                        {key.replace(/([A-Z])/g, " $1").trim()}
                      </div>
                      <div className={`text-5xl font-black italic ${value >= 0 ? "text-green-400" : "text-red-400"}`}>
                        {value >= 0 ? "+" : ""}{value}
                      </div>
                    </div>
                  ));
                })()}
              </div>
            </div>
          )}

          <div>
             <h2 className="text-2xl font-black mb-8 text-white uppercase tracking-widest flex items-center gap-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                Temporal Timeline
             </h2>
             
             <div className="space-y-6">
                {sortedData.slice(-30).reverse().map((snapshot, idx) => {
                  const platform = snapshot.platform;
                  const Icon = platformIcons[platform];
                  const color = platformColors[platform];
                  const metrics = snapshot.metrics || {};
                  
                  return (
                    <div key={snapshot._id || idx} className="glass-card-premium p-8 hover:bg-white/5 transition-all group relative overflow-hidden">
                       <div className="absolute top-0 right-0 w-1 h-full bg-blue-500/20 group-hover:bg-blue-500/50 transition-all"></div>
                       
                       <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
                          <div>
                             <div className="flex items-center gap-4 mb-2">
                               {Icon ? <Icon className="w-4 h-4" style={{ color }} /> : <span className="text-[10px] font-black p-1 bg-white/10 rounded">AT</span>}
                               <span className="font-black text-white uppercase tracking-[0.2em] text-xs">{platform} snapshot</span>
                             </div>
                             <div className="text-gray-500 font-bold text-lg">
                                {new Date(snapshot.snapshotDate).toLocaleDateString("en-US", {
                                  weekday: "long", month: "long", day: "numeric", year: "numeric"
                                })}
                             </div>
                          </div>
                          
                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-x-12 gap-y-4">
                             {Object.entries(metrics).map(([key, value]) => (
                               <div key={key}>
                                  <div className="text-[10px] font-black uppercase tracking-widest text-gray-600 mb-1">
                                    {key.replace(/([A-Z])/g, " $1").trim()}
                                  </div>
                                  <div className="text-2xl font-black text-white italic">
                                    {typeof value === 'number' ? value.toLocaleString() : value ?? "—"}
                                  </div>
                               </div>
                             ))}
                          </div>
                       </div>
                    </div>
                  );
                })}
             </div>
          </div>
        </>
      )}
    </div>
  );
}
