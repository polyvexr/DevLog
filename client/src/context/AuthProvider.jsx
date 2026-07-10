import { useState, useEffect, useCallback, useMemo } from "react";
import { AuthContext } from "./AuthContext";
import api from "../api/axios";

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  // Fetch user info from API
  const fetchUserInfo = useCallback(async () => {
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const response = await api.get("/auth/me");
      const userData = response.data.data?.user;

      if (response.data.success && userData) {
        setUser(userData);
      }
    } catch (error) {
      // If token is invalid, clear everything
      if (error.response?.status === 401) {
        logout();
      }
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchUserInfo();
  }, [fetchUserInfo]);

  const login = (t) => {
    localStorage.setItem("token", t);
    setToken(t);
    // Fetch fresh user info after login
    setTimeout(() => fetchUserInfo(), 100);
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
  };

  const refreshUser = useCallback(() => {
    fetchUserInfo();
  }, [fetchUserInfo]);

  const value = useMemo(() => ({
    token,
    user,
    loading,
    login,
    logout,
    refreshUser
  }), [token, user, loading, refreshUser]); // login and logout are stable

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
