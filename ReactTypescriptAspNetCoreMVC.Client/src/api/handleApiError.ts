import { toast } from "react-toastify";

export function handleApiError(error: any) {
  if (error.response?.status === 403) {
    toast.warn("Access denied. You do not have permission.");
  }

  return Promise.reject(error);
}
