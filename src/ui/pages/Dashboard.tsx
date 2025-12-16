import React, { useContext } from "react";
import { AuthContext } from "../../core/context/AuthContext";
import AdminLayout from "../components/AdminLayout/AdminLayout";
import { Card, Button } from "antd";

export default function Dashboard() {
  const { logout } = useContext(AuthContext);

  return (
    <AdminLayout>
      <Card>
        <h1>Dashboard Admin</h1>
        <div style={{ marginTop: 20 }}>
          <Button
            style={{ backgroundColor: "#001529", color: "#fff" }}
            onClick={() => logout()}
          >
            Se déconnecter
          </Button>
        </div>
      </Card>
    </AdminLayout>
  );
}
