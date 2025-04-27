// src/api/axiosInstance.ts
import axios from "axios";
import { getToken, removeToken } from "../auth/tokenStorage";

const api = axios.create({
  baseURL: "http://localhost:5197/api", // <- your .NET backend base URL
  withCredentials: false, // NO cookies since we're using jwt
});

api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      removeToken();
      window.location.href = "/login"; // Redirect unauthorized users
    } else if (error.response?.status === 403) {
      console.warn("Forbidden - access denied.");
      // Maybe show a toast? Depends on your UX
    }
    return Promise.reject(error);
  }
);

export default api;
