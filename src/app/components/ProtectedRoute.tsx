/**
 * ProtectedRoute
 * Wraps a page component. If the current user lacks the required permission,
 * shows an access-denied screen instead of the page.
 */

import { ShieldOff } from "lucide-react";
import { Navigate, useNavigate } from "react-router";
import { useAuth } from "../context/AuthContext";
 
interface ProtectedRouteProps {
  permissionKey: string;
  children: React.ReactNode;
}
 
export function ProtectedRoute({ permissionKey, children }: ProtectedRouteProps) {
  const { can, user } = useAuth();
  const navigate = useNavigate();
 
  // Not logged in — hard redirect to sign-in
  if (!user) {
    return <Navigate to="/" replace />;
  }
 
  // Logged in but no permission
  if (!can(permissionKey)) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4">
        <div className="max-w-sm w-full text-center">
          <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
            <ShieldOff className="w-8 h-8 text-red-500" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h1>
          <p className="text-gray-500 text-sm mb-6">
            Your <span className="font-semibold capitalize">{user.role}</span> account doesn't have
            permission to access this page. This feature is restricted to signatories.
          </p>
          <button
            onClick={() => navigate("/dashboard")}
            className="bg-[#1e1b4b] text-white px-6 py-2.5 rounded-lg font-semibold text-sm hover:bg-[#2d2755] transition-colors"
          >
            ← Back to Dashboard
          </button>
        </div>
      </div>
    );
  }
 
  return <>{children}</>;
}