import AdminLayout from "../components/AdminLayout/AdminLayout";
import Card from "antd/es/card/Card";
import React from "react";
import { useTranslation } from "react-i18next";

export const Users: React.FC = () => {
  const { t } = useTranslation();

  return (
    <AdminLayout>
      <Card>
        <div className="users-page">
          <h1>{t("users.title")}</h1>
          <p>{t("users.welcome")}</p>
        </div>
      </Card>
    </AdminLayout>
  );
};
