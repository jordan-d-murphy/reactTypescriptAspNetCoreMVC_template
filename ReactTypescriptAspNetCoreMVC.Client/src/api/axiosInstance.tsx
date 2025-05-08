import axios from "axios";
import { getToken, setToken } from "../auth/tokenStorage";
import { handleApiError } from "./handleApiError";
import { getUserId } from "../auth/userStorage";
import { logoutUser } from "../auth/logoutHelper";

const api = axios.create({
  baseURL: "http://localhost:5197/api",
  withCredentials: true, // send cookies, HTTP Only for refresh token
  headers: {
    "Content-Type": "application/json",
  },
});

// Flag to avoid infinite refresh loops
let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

api.interceptors.request.use((config) => {
  const token = getToken();
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise(function (resolve, reject) {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return api(originalRequest);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // const userId = getUserId(); // already have decoded user object on client
        // const refreshResponse = await api.post("/auth/refresh", { userId });
        const refreshResponse = await api.post("/auth/refresh");

        const newAccessToken = refreshResponse.data.accessToken;
        setToken(newAccessToken);

        api.defaults.headers.common.Authorization = `Bearer ${newAccessToken}`;
        processQueue(null, newAccessToken);

        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        logoutUser(); // Clears everything
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return handleApiError(error);
  }
);

export default api;
