import { useState, useEffect, useRef } from "react";
import { FaBell, FaCheckDouble, FaTrophy, FaCalendarAlt, FaChartLine, FaFire } from "react-icons/fa";
import api from "../api/axios";

/**
 * NotificationBell - Notification icon with dropdown list
 */
export default function NotificationBell() {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    fetchUnreadCount();
  }, []);

  useEffect(() => {
    // Close dropdown when clicking outside
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const fetchUnreadCount = async () => {
    try {
      const response = await api.get("/notifications/unread");
      if (response.data.success) {
        setUnreadCount(response.data.count);
      }
    } catch (err) {
      console.error("Failed to fetch unread count:", err);
    }
  };

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const response = await api.get("/notifications?limit=10");
      if (response.data.success) {
        setNotifications(response.data.notifications);
      }
    } catch (err) {
      console.error("Failed to fetch notifications:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggle = () => {
    if (!isOpen) {
      fetchNotifications();
    }
    setIsOpen(!isOpen);
  };

  const handleMarkAsRead = async (notificationId) => {
    try {
      await api.patch(`/notifications/${notificationId}/read`);
      setNotifications((prev) =>
        prev.map((n) => (n._id === notificationId ? { ...n, read: true } : n))
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch (err) {
      console.error("Failed to mark as read:", err);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await api.patch("/notifications/read-all");
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
      setUnreadCount(0);
    } catch (err) {
      console.error("Failed to mark all as read:", err);
    }
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case "contest_reminder":
        return <FaCalendarAlt className="text-blue-400" />;
      case "milestone_achieved":
        return <FaTrophy className="text-yellow-400" />;
      case "streak_broken":
      case "streak_warning":
        return <FaFire className="text-orange-400" />;
      case "insight_generated":
        return <FaChartLine className="text-purple-400" />;
      default:
        return <FaBell className="text-gray-400" />;
    }
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bell button */}
      <button
        onClick={handleToggle}
        className="relative p-2 rounded-lg hover:bg-gray-700/50 transition-colors"
      >
        <FaBell className="text-gray-400 hover:text-white transition-colors" size={20} />
        
        {/* Unread badge */}
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] flex items-center justify-center text-xs font-bold bg-red-500 text-white rounded-full px-1">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-gray-800/95 backdrop-blur-xl border border-gray-700 rounded-xl shadow-2xl overflow-hidden z-50">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-700">
            <h3 className="text-white font-semibold">Notifications</h3>
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllAsRead}
                className="text-xs text-purple-400 hover:text-purple-300 flex items-center gap-1"
              >
                <FaCheckDouble size={12} />
                Mark all read
              </button>
            )}
          </div>

          {/* Notification list */}
          <div className="max-h-80 overflow-y-auto">
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <div className="w-6 h-6 border-2 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : notifications.length === 0 ? (
              <div className="py-8 text-center text-gray-500">
                <FaBell size={24} className="mx-auto mb-2 opacity-50" />
                <p>No notifications yet</p>
              </div>
            ) : (
              notifications.map((notification) => (
                <div
                  key={notification._id}
                  onClick={() => !notification.read && handleMarkAsRead(notification._id)}
                  className={`flex items-start gap-3 px-4 py-3 border-b border-gray-700/50 cursor-pointer hover:bg-gray-700/30 transition-colors ${
                    !notification.read ? "bg-purple-900/10" : ""
                  }`}
                >
                  {/* Icon */}
                  <div className="mt-0.5">{getNotificationIcon(notification.type)}</div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm ${notification.read ? "text-gray-400" : "text-white"}`}>
                      {notification.title}
                    </p>
                    <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">
                      {notification.message}
                    </p>
                    <p className="text-xs text-gray-600 mt-1">
                      {formatTime(notification.createdAt)}
                    </p>
                  </div>

                  {/* Unread dot */}
                  {!notification.read && (
                    <span className="w-2 h-2 rounded-full bg-purple-500 mt-2"></span>
                  )}
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          {notifications.length > 0 && (
            <div className="px-4 py-2 border-t border-gray-700 text-center">
              <a href="/notifications" className="text-xs text-purple-400 hover:text-purple-300">
                View all notifications
              </a>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
