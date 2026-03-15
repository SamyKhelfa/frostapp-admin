import AdminLayout from "../components/AdminLayout/AdminLayout";
import Card from "antd/es/card/Card";
import React from "react";

export const Users: React.FC = () => {
  return (
    <AdminLayout>
      <Card>
        <div className="users-page">
          <h1>Users</h1>
          <p>Welcome to the Users page</p>
        </div>
      </Card>
    </AdminLayout>
  );
}