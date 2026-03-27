import { Button, Card, Result } from "antd";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import AdminLayout from "../components/AdminLayout/AdminLayout";

export default function NotFound() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <AdminLayout>
      <Card>
        <Result
          status="404"
          title={t("notFound.title")}
          subTitle={t("notFound.subtitle")}
          extra={
            <Button type="primary" onClick={() => navigate("/")}>
              {t("notFound.backHome")}
            </Button>
          }
        />
      </Card>
    </AdminLayout>
  );
}
