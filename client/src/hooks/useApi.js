import { useState, useEffect, useCallback } from "react";
import api, { getDashboardData } from "../api/axios";

/**
 * Custom hook for fetching platform stats
 * Reduces duplicate API logic across platform detail pages
 */
export function usePlatformStats(platform) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await api.get("/stats/all");
        
        if (cancelled) return;
        
        const platformData = res.data.stats.find((s) => s.platform === platform);
        if (platformData) {
          setData(platformData);
        } else {
          setError(`${platform} not linked`);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err.message || "Failed to fetch data");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    fetchData();
    return () => { cancelled = true; };
  }, [platform]);

  return { data, loading, error, stats: data?.stats || {} };
}

/**
 * Custom hook for fetching combined dashboard data
 * Uses the optimized single-endpoint API
 */
export function useDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const refresh = useCallback(async () => {
    try {
      setLoading(true);
      const res = await getDashboardData();
      setData(res.data.data);
      setError(null);
    } catch (err) {
      setError(err.message || "Failed to fetch dashboard");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { data, loading, error, refresh };
}

/**
 * Custom hook for notifications with auto-refresh
 */
export function useNotifications(autoRefreshInterval = null) {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchNotifications = useCallback(async () => {
    try {
      const res = await api.get("/notifications");
      setNotifications(res.data.notifications || []);
      setUnreadCount(res.data.notifications?.filter(n => !n.read).length || 0);
    } catch (err) {
      console.error("Failed to fetch notifications:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  const markAsRead = useCallback(async (id) => {
    try {
      await api.patch(`/notifications/${id}/read`);
      setNotifications(prev => 
        prev.map(n => n._id === id ? { ...n, read: true } : n)
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (err) {
      console.error("Failed to mark as read:", err);
    }
  }, []);

  const markAllAsRead = useCallback(async () => {
    try {
      await api.patch("/notifications/read-all");
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
      setUnreadCount(0);
    } catch (err) {
      console.error("Failed to mark all as read:", err);
    }
  }, []);

  useEffect(() => {
    fetchNotifications();
    
    if (autoRefreshInterval) {
      const interval = setInterval(fetchNotifications, autoRefreshInterval);
      return () => clearInterval(interval);
    }
  }, [fetchNotifications, autoRefreshInterval]);

  return { notifications, unreadCount, loading, markAsRead, markAllAsRead, refresh: fetchNotifications };
}

/**
 * Custom hook for insights
 */
export function useInsights() {
  const [insights, setInsights] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchInsights = useCallback(async () => {
    try {
      const res = await api.get("/insights");
      setInsights(res.data.insights || []);
    } catch (err) {
      console.error("Failed to fetch insights:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  const dismissInsight = useCallback(async (id) => {
    try {
      await api.patch(`/insights/${id}/dismiss`);
      setInsights(prev => prev.filter(i => i._id !== id));
    } catch (err) {
      console.error("Failed to dismiss insight:", err);
    }
  }, []);

  useEffect(() => {
    fetchInsights();
  }, [fetchInsights]);

  return { insights, loading, dismissInsight, refresh: fetchInsights };
}

/**
 * Custom hook for platform refresh with cooldown
 */
export function usePlatformRefresh() {
  const [refreshing, setRefreshing] = useState({});
  const [cooldowns, setCooldowns] = useState({});

  const refresh = useCallback(async (platform, onSuccess) => {
    if (refreshing[platform] || cooldowns[platform]) return false;

    try {
      setRefreshing(prev => ({ ...prev, [platform]: true }));
      const res = await api.post(`/stats/refresh/${platform}`);
      
      if (res.data.success) {
        // Set cooldown
        setCooldowns(prev => ({ ...prev, [platform]: true }));
        setTimeout(() => {
          setCooldowns(prev => ({ ...prev, [platform]: false }));
        }, 6 * 60 * 60 * 1000); // 6 hours
        
        onSuccess?.(res.data.data);
        return true;
      }
      return false;
    } catch (err) {
      console.error(`Failed to refresh ${platform}:`, err);
      return false;
    } finally {
      setRefreshing(prev => ({ ...prev, [platform]: false }));
    }
  }, [refreshing, cooldowns]);

  return { refresh, refreshing, cooldowns };
}

/**
 * Custom hook for platform statistics history
 */
export function useHistory() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchHistory = useCallback(async () => {
    try {
      setLoading(true);
      const res = await getAllHistory();
      setData(res.data.data?.history || res.data.history || {});
      setError(null);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  return { data, loading, error, refresh: fetchHistory };
}
