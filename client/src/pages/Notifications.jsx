import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Loader from "../components/Loader";
import { 
  getNotifications, 
  markNotificationRead, 
  markAllNotificationsRead, 
  deleteNotification 
} from "../api/axios";
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
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const fetchNotifications = async () => {
    try {
      const res = await getNotifications();
      setNotifications(res.data.data?.notifications || res.data.notifications || []);
    } catch {
      setError("Failed to load notifications");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const handleMarkRead = async (id) => {
    try {
      await markNotificationRead(id);
      setNotifications(notifications.map(n => n._id === id ? { ...n, read: true } : n));
    } catch {
      console.error("Failed to mark notification as read");
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await markAllNotificationsRead();
      setNotifications(notifications.map(n => ({ ...n, read: true })));
    } catch {
      console.error("Failed to mark all notifications as read");
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteNotification(id);
      setNotifications(notifications.filter(n => n._id !== id));
    } catch {
      console.error("Failed to delete notification");
    }
  };

  if (loading) return <Loader />;

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <>
      <button
        onClick={() => navigate("/")}
        className="mb-10 text-gray-400 hover:text-white flex items-center gap-2 group transition-all fade-in-scale"
      >
        <span className="group-hover:-translate-x-1 transition-transform">←</span>
        <span className="font-bold uppercase tracking-widest text-xs">Return to Dashboard</span>
      </button>

      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 fade-in-scale">
        <div>
          <h1 className="text-5xl md:text-6xl font-black mb-4 tracking-tight">
            <span className="text-white opacity-90">Attention</span>
            <br />
            <span className="animate-text-shine inline-block">Center</span>
          </h1>
          <p className="text-gray-400 text-xl font-medium">Keep track of your neural link updates.</p>
        </div>
        
        {notifications.length > 0 && (
          <button
            onClick={handleMarkAllRead}
            disabled={unreadCount === 0}
            className="px-6 py-3 bg-white/5 hover:bg-white/10 text-white font-bold rounded-xl transition-all flex items-center gap-3 border border-white/5 disabled:opacity-50 disabled:cursor-not-allowed active:scale-95"
          >
            <FiCheck className="text-lg" />
            Mark all read
          </button>
        )}
      </div>

      {error && (
        <div className="mb-8 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400">
          {error}
        </div>
      )}

      {notifications.length === 0 ? (
        <div className="glass-card-premium p-12 text-center fade-in-up">
          <div className="w-20 h-20 bg-blue-500/10 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-inner">
            <FiBell className="text-4xl text-blue-500/50" />
          </div>
          <h3 className="text-2xl font-bold text-white mb-4 italic">No Feed Items</h3>
          <p className="text-gray-400 max-w-md mx-auto">
            Your consciousness is currently quiet. New notifications will appear here when systems update.
          </p>
        </div>
      ) : (
        <div className="space-y-4 fade-in-up">
          {notifications.map((notification) => {
            const Icon = notificationIcons[notification.type] || FiInfo;
            const colorClass = notificationColors[notification.type] || notificationColors.system;
            
            return (
              <div 
                key={notification._id} 
                className={`glass-card-premium p-6 flex items-start gap-6 transition-all hover:bg-white/[0.03] ${
                  !notification.read ? "ring-1 ring-blue-500/30" : "opacity-70"
                }`}
              >
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 border ${colorClass}`}>
                  <Icon className="text-xl" />
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-4 mb-2">
                    <div>
                      <h3 className={`font-black text-lg ${!notification.read ? "text-white" : "text-gray-400"}`}>
                        {notification.title}
                      </h3>
                      <p className="text-gray-500 text-sm font-medium">
                        {new Date(notification.createdAt).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit"
                        })}
                      </p>
                    </div>
                    <div className="flex gap-2">
                       {!notification.read && (
                        <button
                          onClick={() => handleMarkRead(notification._id)}
                          className="p-2 rounded-lg bg-white/5 hover:bg-green-500/20 text-gray-500 hover:text-green-400 transition-all"
                          title="Mark as read"
                        >
                          <FiCheck size={16} />
                        </button>
                      )}
                      <button
                        onClick={() => handleDelete(notification._id)}
                        className="p-2 rounded-lg bg-white/5 hover:bg-red-500/20 text-gray-500 hover:text-red-400 transition-all"
                        title="Delete"
                      >
                        <FiTrash2 size={16} />
                      </button>
                    </div>
                  </div>
                  <p className={`${!notification.read ? "text-gray-300" : "text-gray-500"} leading-relaxed`}>
                    {notification.message}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </>
  );
}
