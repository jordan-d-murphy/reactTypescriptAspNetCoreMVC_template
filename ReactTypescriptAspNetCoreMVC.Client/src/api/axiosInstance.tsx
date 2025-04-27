import axios from "axios";
import { getToken } from "../auth/tokenStorage";
import { handleApiError } from "./handleApiError";

const api = axios.create({
  baseURL: "http://localhost:5197/api", // .NET api base URL, should probably load this from a config
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
  (error) => handleApiError(error)
);

export default api;
