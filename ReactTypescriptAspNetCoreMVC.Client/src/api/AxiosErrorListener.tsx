import { useEffect } from "react";
import { useAuth } from "../auth/useAuth";
import api from "../api/axiosInstance";
import { toast } from "react-toastify";

export default function AxiosErrorListener() {
  const { logout } = useAuth();

  useEffect(() => {
    console.log("Interceptor attached");
    const interceptor = api.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          //   ↓ use this for prod
          //   toast.error("Session expired. Please log in again.");

          //   ↓ use this to prevent duplicate toast in dev
          if (!toast.isActive("session-expired")) {
            toast.error("Session expired. Please log in again.", { toastId: "session-expired" });
          }

          logout();
        }
        return Promise.reject(error);
      }
    );

    return () => {
      api.interceptors.response.eject(interceptor);
    };
  }, [logout]);

  return null;
}
