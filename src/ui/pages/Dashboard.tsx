import React, { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import AdminLayout from "../components/AdminLayout";

export default function Dashboard() {
  const { user, logout } = useContext(AuthContext);

  return (
    <AdminLayout>
      <h1>Dashboard Admin</h1>
      <div>
        <strong>Connecté en tant que:</strong> {user?.email}
      </div>
      <div style={{ marginTop: 12 }}>
        <button onClick={() => logout()}>Se déconnecter</button>
      </div>
      {/* ici ajouter gestion des chapitres, leçons... */}
    </AdminLayout>
  );
}
