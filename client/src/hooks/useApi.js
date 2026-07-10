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

        // Backend returns: { success: true, data: { stats: [] } }
        const stats = res.data.data?.stats || [];
        const platformData = stats.find((s) => s.platform === platform);

        if (platformData) {
          setData(platformData);
        } else {
          setError(`${platform} not linked`);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err.response?.data?.message || err.message || "Failed to fetch data");
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
      // Backend returns: { success: true, data: { ...dashboardData } }
      setData(res.data.data);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Failed to fetch dashboard");
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
 * Custom hook for platform refresh with cooldown
 */
export function usePlatformRefresh() {
  const [refreshing, setRefreshing] = useState({});

  const refresh = useCallback(async (platform, onSuccess) => {
    if (refreshing[platform]) return false;

    try {
      setRefreshing(prev => ({ ...prev, [platform]: true }));
      const res = await api.post(`/stats/refresh/${platform}`);

      if (res.data.success) {
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
  }, [refreshing]);

  return { refresh, refreshing, cooldowns: {} };
}


