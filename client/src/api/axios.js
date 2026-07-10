import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL || "http://localhost:5000/api",
  timeout: 30000, // 30 second timeout
});

// Request interceptor - add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - handle 401 errors and auto-logout
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid - clear auth and redirect
      localStorage.removeItem("token");

      // Only redirect if not already on auth pages
      const currentPath = window.location.pathname;
      const authPages = ["/login", "/register", "/forgot-password", "/reset-password"];
      const isAuthPage = authPages.some(page => currentPath.startsWith(page));

      if (!isAuthPage) {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

// Auth API
export const getMe = () => api.get("/auth/me");
export const updateProfile = (data) => api.put("/user/profile", data);
export const updatePassword = (data) => api.put("/user/password", data);
export const updateSettings = (data) => api.put("/user/settings", data);


// Stats API
export const getAllStats = () => api.get("/stats/all");
export const getStatsSummary = () => api.get("/stats/summary");
export const refreshPlatformStats = (platform) =>
  api.post(`/stats/refresh/${platform}`);

// Platforms API
export const getPlatforms = () => api.get("/platforms");
export const linkPlatform = (data) => api.post("/platforms/link", data);
export const unlinkPlatform = (platform) => api.delete(`/platforms/${platform}`);

// Contests API
export const getContests = () => api.get("/contests");
export const getContestsByPlatform = (platform) => api.get(`/contests/${platform}`);

// Dashboard API (combined endpoint for performance)
export const getDashboardData = () => api.get("/dashboard");

// User API
export const deleteAccount = () => api.delete("/user/account");

export default api;
