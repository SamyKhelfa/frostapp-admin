import React from "react";
import AdminLayout from "../components/AdminLayout/AdminLayout";
import Card from "antd/es/card/Card";
import { List, Input } from "antd";

export const Community: React.FC = () => {
  return (
    <AdminLayout>
      <Card>
        <div className="community-page">
          <h1>Community</h1>
          <Input placeholder="Rechercher un utilisateur" />
          <p>Utilisateurs inscrits récemment</p>
          <List
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
