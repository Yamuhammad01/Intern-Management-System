import React from "react";
import { useAuth } from "./AuthContext";
import { Loader2, AlertCircle, Lock } from "lucide-react";

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: string[];
  fallback?: React.ReactNode;
}

/**
 * Protects a route/view by checking authentication state and role.
 * - If loading, shows a loading spinner.
 * - If not authenticated, renders nothing (auth pages handle login).
 * - If roles are specified and user doesn't match, shows access denied.
 * - Otherwise renders children.
 */
export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  allowedRoles,
  fallback,
}) => {
  const { user, loading, isMockMode } = useAuth();

  // Loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="flex flex-col items-center gap-3 text-gray-400">
          <Loader2 className="w-6 h-6 animate-spin text-emerald-500" />
          <p className="text-xs font-medium">Verifying access...</p>
        </div>
      </div>
    );
  }

  // Not logged in
  if (!user) {
    return null;
  }

  // Role check (skip in mock mode for testing flexibility)
  if (allowedRoles && allowedRoles.length > 0 && !isMockMode) {
    const hasRole = allowedRoles.includes(user.role);
    if (!hasRole) {
      // Show access denied if fallback not provided
      if (fallback) return <>{fallback}</>;
      return (
        <div className="bg-white rounded-xl border border-black/[0.07] p-8 shadow-sm flex flex-col items-center justify-center text-center gap-4 max-w-md mx-auto my-12 animate-fade-in">
          <div className="w-12 h-12 bg-red-50 border border-red-100 rounded-full flex items-center justify-center text-red-500">
            <Lock className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-gray-800">Access Restricted</h3>
            <p className="text-xs text-gray-500 mt-1 leading-relaxed">
              Your account role (<strong>{user.role}</strong>) does not have permission to access this module.
            </p>
          </div>
        </div>
      );
    }
  }

  return <>{children}</>;
};