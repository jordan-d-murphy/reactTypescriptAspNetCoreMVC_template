import { Navigate } from "react-router-dom";
import { useAuth } from "../auth/useAuth";
import type { ReactNode } from "react";

interface ProtectedRouteProps {
  children: ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isAuthenticated, loading } = useAuth();

  console.log("!!! ProtectedRoute hit: ", { loading, isAuthenticated });

  if (loading) return <div>Loading...</div>;

  if (!isAuthenticated) {
    console.log("User not authenticated, redirecting to login...");
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>; // MUST stay as {children}, do not update to <Outlet />
}
