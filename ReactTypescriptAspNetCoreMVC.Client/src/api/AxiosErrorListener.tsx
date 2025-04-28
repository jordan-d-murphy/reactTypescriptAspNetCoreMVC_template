import { useEffect } from "react";
import api from "../api/axiosInstance";

export default function AxiosErrorListener() {
  useEffect(() => {
    console.log("Interceptor attached");

    // In future we can globally handle 403, 500, etc. errors here
    const interceptor = api.interceptors.response.use(
      (response) => response,
      (error) => {
        // No 401 handling here anymore!
        return Promise.reject(error);
      }
    );

    return () => {
      api.interceptors.response.eject(interceptor);
    };
  }, []);

  return null;
}
