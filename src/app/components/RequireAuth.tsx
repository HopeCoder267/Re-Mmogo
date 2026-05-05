/**
 * RequireAuth
 * Lightweight wrapper that redirects to "/" if no session exists.
 * Use this on every route that requires the user to be logged in.
 */
import { Navigate } from "react-router";
import { useAuth } from "../context/AuthContext";
 
export function RequireAuth({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/" replace />;
  return <>{children}</>;
}