import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./ui/pages/Login";
import Register from "./ui/pages/Register";
import Dashboard from "./ui/pages/Dashboard";
import { ProtectedRoute } from "./infra/routes/ProtectedRoute";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route
        path="/dashboard/*"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}
