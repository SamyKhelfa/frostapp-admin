import type { ReactNode } from "react";
import { Layout, Menu, Card } from "antd";
import { HomeOutlined, BookOutlined, TeamOutlined, UserOutlined, LogoutOutlined } from "@ant-design/icons";
import { useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAuthContext } from "@core/context/AuthContext";
import { LanguageSwitcher } from "@ui/components/LanguageSwitcher";
import flake from "../../../assets/flake.png";

const { Sider, Content } = Layout;

export default function AdminLayout({ children }: { children: ReactNode }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { handleLogout } = useAuthContext();
  const { t } = useTranslation();

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Card style={{ background: "#001529" }}>
        <Sider width={220}>
          <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
            <div
              style={{
                color: "#fff",
                fontSize: 24,
                padding: "16px",
                textAlign: "center",
                fontWeight: "bold",
              }}
            >
              {t("layout.backoffice")}
              <img
                src={flake}
                alt={t("layout.snowflakeAlt")}
                style={{ marginLeft: 8, height: 24 }}
              />
            </div>

            <Menu
              theme="dark"
              mode="inline"
              selectedKeys={[location.pathname]}
              onClick={({ key }) => navigate(key)}
              items={[
                {
                  key: "/",
                  icon: <HomeOutlined />,
                  label: t("layout.home"),
                },
                {
                  key: "/courses",
                  icon: <BookOutlined />,
                  label: t("layout.courses"),
                },
                {
                  key: "/community",
                  icon: <TeamOutlined />,
                  label: t("layout.community"),
                },
                {
                  key: "/users",
                  icon: <UserOutlined />,
                  label: t("layout.users"),
                }
              ]}
            />
            <Menu
              theme="dark"
              mode="inline"
              selectable={false}
              style={{ marginTop: "auto", borderTop: "1px solid rgba(255,255,255,0.1)" }}
              items={[
                {
                  key: "logout",
                  icon: <LogoutOutlined />,
                  label: t("layout.logout"),
                  danger: true,
                  onClick: () => {
                    handleLogout();
                    navigate("/");
                  },
                },
              ]}
            />
            <div style={{ padding: "0 16px 16px" }}>
              <LanguageSwitcher style={{ width: "100%" }} />
            </div>
          </div>
        </Sider>
      </Card>

      <Layout>
        <Content style={{ padding: 24 }}>{children}</Content>
      </Layout>
    </Layout>
  );
}
