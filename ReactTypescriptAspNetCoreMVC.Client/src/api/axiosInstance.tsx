// src/api/axiosInstance.ts
import axios from "axios";
import { getToken, removeToken } from "../auth/tokenStorage";

const api = axios.create({
  baseURL: "http://localhost:5197/api", // .NET backend base URL, should probably load this from a config
  withCredentials: false, // NO cookies, we're using jwt
  headers: {
    "Content-Type": "application/json", // adds this globally
  },
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
      // Maybe show a toast? Depends on UX...
    }
    return Promise.reject(error);
  }
);

export default api;
