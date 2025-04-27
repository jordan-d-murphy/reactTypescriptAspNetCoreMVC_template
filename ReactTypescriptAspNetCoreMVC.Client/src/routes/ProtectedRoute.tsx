import { Navigate } from "react-router-dom";
import { useAuth } from "../auth/useAuth";
import { JSX } from "react";

export function ProtectedRoute({ children }: { children: JSX.Element }) {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>; // to do: add spinner or loader
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
