import React from "react";
import { Navigate } from "react-router-dom";
import { useAuthContext } from "../../core/context/AuthContext";

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, isLogging } = useAuthContext();

  if (isLogging) return <div>Chargement...</div>;
  
  if (!user) return <Navigate to="/login" replace />;
  
  return children;
}
