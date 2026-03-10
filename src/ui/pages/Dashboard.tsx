import { useContext } from "react";
import { AuthContext } from "../../core/context/AuthContext";
import AdminLayout from "../components/AdminLayout/AdminLayout";
import { Card } from "antd";
import UserOptions from "../components/UserOptions/UserOptions";

export default function Dashboard() {
  const { logout } = useContext(AuthContext);

  return (
    <AdminLayout>
      <Card>
        <UserOptions onLogout={logout} />
        <h1>Dashboard Admin</h1>
      </Card>
    </AdminLayout>
  );
}
