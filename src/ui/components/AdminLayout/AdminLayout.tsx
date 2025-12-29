import React, { ReactNode } from "react";
import { Layout, Menu, Card } from "antd";
import { HomeOutlined, BookOutlined, TeamOutlined, UserOutlined } from "@ant-design/icons";
import { useLocation, useNavigate } from "react-router-dom";
import flake from "../../../assets/flake.png";

const { Sider, Content } = Layout;

export default function AdminLayout({ children }: { children: ReactNode }) {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Card style={{ background: "#001529" }}>
        <Sider width={220}>
          <div
            style={{
              color: "#fff",
              fontSize: 24,
              padding: "16px",
              textAlign: "center",
              fontWeight: "bold",
            }}
          >
            Backoffice
            <img
              src={flake}
              alt="Snowflake"
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
                key: "/dashboard",
                icon: <HomeOutlined />,
                label: "Accueil",
              },
              {
                key: "/courses",
                icon: <BookOutlined />,
                label: "Courses",
              },
              {
                key: "/community",
                icon: <TeamOutlined />,
                label: "Community",
              },
              {
                key: "/users",
                icon: <UserOutlined />,
                label: "Users",
              }
            ]}
          />
        </Sider>
      </Card>

      <Layout>
        <Content style={{ padding: 24 }}>{children}</Content>
      </Layout>
    </Layout>
  );
}
