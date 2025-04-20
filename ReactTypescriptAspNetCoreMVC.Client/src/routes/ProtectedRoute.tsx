import { Navigate } from 'react-router-dom';
import { useAuth } from '../auth/useAuth';
import { JSX } from 'react';

export function ProtectedRoute({ children }: { children: JSX.Element }) {
  const { isAuthenticated, loading } = useAuth();
  if (loading) return null;
  return isAuthenticated ? children : <Navigate to="/login" />;
}