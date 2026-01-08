import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL || "http://localhost:5000/api",
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Auth API
export const getMe = () => api.get("/auth/me");
export const updateProfile = (data) => api.put("/auth/profile", data);
export const updatePassword = (data) => api.put("/auth/password", data);
export const updateSettings = (data) => api.put("/auth/settings", data);

// Stats API
export const getAllStats = () => api.get("/stats/all");
export const getStatsSummary = () => api.get("/stats/summary");
export const refreshPlatformStats = (platform) =>
  api.post(`/stats/refresh/${platform}`);

export default api;
