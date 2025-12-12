import React from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../../core/context/AuthContext";

export function ProtectedRoute({ children }: { children: JSX.Element }) {
  const { user, loading } = React.useContext(AuthContext);
  if (loading) return <div>Chargement...</div>;
  if (!user || !user.isAdmin) return <Navigate to="/login" replace />;
  return children;
}
