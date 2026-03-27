import { Card } from "antd";
import { useTranslation } from "react-i18next";
import AdminLayout from "../components/AdminLayout/AdminLayout";

export default function Dashboard() {
  const { t } = useTranslation();

  return (
    <AdminLayout>
      <Card>
        <h1>{t("dashboard.title")}</h1>
      </Card>
    </AdminLayout>
  );
}
