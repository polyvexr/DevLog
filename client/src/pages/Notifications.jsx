import React from "react";
import { useNavigate } from "react-router-dom";
import { useNotifications } from "../hooks/useApi";
import FullPageLoader from "../components/FullPageLoader";
import { 
  FiBell, 
  FiCheck, 
  FiTrash2, 
  FiTarget, 
  FiAward, 
  FiAlertCircle, 
  FiInfo,
  FiX
} from "react-icons/fi";

const notificationIcons = {
  contest_reminder: FiTarget,
  weekly_summary: FiInfo,
  streak_broken: FiAlertCircle,
  streak_warning: FiAlertCircle,
  refresh_available: FiAward,
  milestone_achieved: FiAward,
  insight_generated: FiBell,
  system: FiInfo,
};

const notificationColors = {
  contest_reminder: "text-blue-400 bg-blue-500/10 border-blue-500/20",
  weekly_summary: "text-purple-400 bg-purple-500/10 border-purple-500/20",
  streak_broken: "text-red-400 bg-red-500/10 border-red-500/20",
  streak_warning: "text-yellow-400 bg-yellow-500/10 border-yellow-500/20",
  refresh_available: "text-green-400 bg-green-500/10 border-green-500/20",
  milestone_achieved: "text-amber-400 bg-amber-500/10 border-amber-500/20",
  insight_generated: "text-pink-400 bg-pink-500/10 border-pink-500/20",
  system: "text-gray-400 bg-gray-500/10 border-gray-500/20",
};

export default function Notifications() {
  const navigate = useNavigate();
  const { notifications, loading, markRead, markAllRead, removeNotification } = useNotifications();

  if (loading) return <FullPageLoader />;

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <button
        onClick={() => navigate("/")}
        className="mb-10 text-gray-400 hover:text-white flex items-center gap-2 group transition-all"
      >
        <span className="group-hover:-translate-x-1 transition-transform">←</span>
        <span className="font-bold uppercase tracking-widest text-[10px]">Command Center</span>
      </button>

      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
        <div>
          <h1 className="text-6xl md:text-8xl font-black mb-6 tracking-tight italic">
            Neural <span className="animate-text-shine">Logs</span>
          </h1>
          <p className="text-gray-400 text-xl font-medium max-w-2xl leading-relaxed">
             Real-time asynchronous updates from synchronized coding nodes.
          </p>
        </div>
        
        {notifications.length > 0 && (
          <button
            onClick={markAllRead}
            disabled={unreadCount === 0}
            className="px-8 py-4 glass-card-premium hover:bg-white/10 text-white font-black rounded-2xl transition-all flex items-center gap-3 border-none disabled:opacity-20 disabled:cursor-not-allowed active:scale-95 uppercase tracking-widest text-xs"
          >
            <FiCheck className="text-lg" />
            Clear Channels
          </button>
        )}
      </div>

      {notifications.length === 0 ? (
        <div className="glass-card-premium p-24 text-center">
          <div className="w-24 h-24 bg-blue-500/10 rounded-3xl flex items-center justify-center mx-auto mb-10 shadow-inner">
            <FiBell className="text-5xl text-blue-500/50" />
          </div>
          <h3 className="text-3xl font-black text-white mb-4 italic uppercase">Silence</h3>
          <p className="text-gray-500 max-w-md mx-auto font-medium">No signals are currently traversing your neural network.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {notifications.map((notification) => {
            const Icon = notificationIcons[notification.type] || FiInfo;
            const colorClass = notificationColors[notification.type] || notificationColors.system;
            
            return (
              <div 
                key={notification._id} 
                className={`glass-card-premium p-8 flex items-start gap-8 transition-all group relative overflow-hidden border-none ring-1 ${
                  !notification.read ? "ring-blue-500/40 bg-blue-500/5" : "ring-white/5 opacity-50"
                }`}
              >
                {!notification.read && <div className="absolute top-0 left-0 w-1 h-full bg-blue-500"></div>}
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 border ${colorClass} shadow-lg`}>
                  <Icon className="text-2xl" />
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-6 mb-4">
                    <div>
                      <h3 className={`font-black text-2xl italic ${!notification.read ? "text-white" : "text-gray-400"}`}>
                        {notification.title}
                      </h3>
                      <div className="text-gray-600 text-[10px] font-black uppercase tracking-[0.2em]">
                        {new Date(notification.createdAt).toLocaleDateString()} // {new Date(notification.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>
                    <div className="flex gap-3">
                       {!notification.read && (
                        <button
                          onClick={() => markRead(notification._id)}
                          className="p-3 glass-card-premium hover:bg-green-500/20 text-gray-500 hover:text-green-400 transition-all border-none"
                          title="Acknowledge"
                        >
                          <FiCheck size={18} />
                        </button>
                      )}
                      <button
                        onClick={() => removeNotification(notification._id)}
                        className="p-3 glass-card-premium hover:bg-red-500/20 text-gray-500 hover:text-red-400 transition-all border-none"
                        title="Purge"
                      >
                        <FiTrash2 size={18} />
                      </button>
                    </div>
                  </div>
                  <p className={`text-lg leading-relaxed ${!notification.read ? "text-gray-300" : "text-gray-500"}`}>
                    {notification.message}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
