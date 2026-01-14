import { useState, useEffect, useCallback } from "react";
import { AuthContext } from "./AuthContext";
import api from "../api/axios";

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  // Fetch user info including admin status from API
  const fetchUserInfo = useCallback(async () => {
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const response = await api.get("/auth/me");
      if (response.data.success && response.data.user) {
        setUser(response.data.user);
        // Check admin status from server response
        const adminStatus = response.data.user.role === "admin";
        setIsAdmin(adminStatus);
        // Keep localStorage in sync for quick UI checks (but server is source of truth)
        localStorage.setItem("isAdmin", adminStatus);
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

  const login = (t, admin = false) => {
    localStorage.setItem("token", t);
    localStorage.setItem("isAdmin", admin);
    setToken(t);
    setIsAdmin(admin);
    // Fetch fresh user info after login
    setTimeout(() => fetchUserInfo(), 100);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("isAdmin");
    setToken(null);
    setIsAdmin(false);
    setUser(null);
  };

  const refreshUser = () => {
    fetchUserInfo();
  };

  return (
    <AuthContext.Provider value={{ 
      token, 
      isAdmin, 
      user, 
      loading, 
      login, 
      logout,
      refreshUser 
    }}>
      {children}
    </AuthContext.Provider>
  );
};
