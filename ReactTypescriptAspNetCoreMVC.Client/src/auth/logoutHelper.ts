import api from "../api/axiosInstance";
import { removeToken, removeUser } from "./tokenStorage";
import { getUserId } from "./userStorage";

export async function logoutUser() {
  try {
    const userId = getUserId();
    if (userId) {
      await api.post("/auth/logout", { userId });
    }
  } catch (err) {
    console.error("Error calling logout", err);
    // continue logout even if server error
  } finally {
    removeToken();
    removeUser();
    window.location.href = "/login";
  }
}
