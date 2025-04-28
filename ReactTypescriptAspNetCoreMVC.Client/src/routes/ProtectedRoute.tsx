import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../auth/useAuth";

export function ProtectedRoute() {
  const { isAuthenticated, loading } = useAuth();

  if (loading) return <div>Loading...</div>;

  if (!isAuthenticated) {
    console.log("User not authenticated, redirecting to login...");
    return <Navigate to="/login" replace />;
  }

  return <Outlet />; // Allows child route to render (safe)
}
