import AdminLayout from "../components/AdminLayout/AdminLayout";
import Card from "antd/es/card/Card";
import { List, Input } from "antd";
import { useTranslation } from "react-i18next";

type CommunityUser = {
  id: string;
  name: string;
  email: string;
};

export const Community = () => {
  const { t } = useTranslation();

  return (
    <AdminLayout>
      <Card>
        <div className="community-page">
          <h1>{t("community.title")}</h1>
          <Input placeholder={t("community.searchPlaceholder")} />
          <p>{t("community.recentUsers")}</p>
          <List<CommunityUser>
            itemLayout="horizontal"
            dataSource={[]}
            renderItem={(item) => (
              <List.Item>
                <List.Item.Meta title={item.name} description={item.email} />
              </List.Item>
            )}
          />
        </div>
      </Card>
    </AdminLayout>
  );
};

export default Community;
