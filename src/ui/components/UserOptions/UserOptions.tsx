import React from "react";
import { Dropdown, Avatar, Menu } from "antd";
import {
  UserOutlined,
  SettingOutlined,
  LogoutOutlined,
  UserSwitchOutlined,
} from "@ant-design/icons";
import type { MenuProps } from "antd";

interface UserOptionsProps {
  userImage?: string;
  userName?: string;
  userEmail?: string;
  onLogout: () => void;
  onSettings?: () => void;
  onProfile?: () => void;
}

export const UserOptions: React.FC<UserOptionsProps> = ({
  userImage,
  userName = "User",
  userEmail,
  onLogout,
  onSettings,
  onProfile,
}) => {
  const menuItems: MenuProps["items"] = [
    {
      key: "user-info",
      label: (
        <div style={{ padding: "8px 0" }}>
          <div style={{ fontWeight: 600, fontSize: "14px" }}>{userName}</div>
          {userEmail && (
            <div style={{ fontSize: "12px", color: "#8c8c8c" }}>
              {userEmail}
            </div>
          )}
        </div>
      ),
      disabled: true,
    },
    {
      type: "divider",
    },
    {
      key: "profile",
      label: "Profil",
      icon: <UserSwitchOutlined />,
      onClick: onProfile,
      disabled: !onProfile,
    },
    {
      key: "settings",
      label: "Paramètres",
      icon: <SettingOutlined />,
      onClick: onSettings,
      disabled: !onSettings,
    },
    {
      type: "divider",
    },
    {
      key: "logout",
      label: "Déconnexion",
      icon: <LogoutOutlined />,
      danger: true,
      onClick: onLogout,
    },
  ];

  return (
    <div style={{ position: "fixed", top: 16, right: 16, zIndex: 1000 }}>
      <Dropdown
        menu={{ items: menuItems }}
        trigger={["click"]}
        placement="bottomRight"
      >
        <Avatar
          size={40}
          src={userImage}
          icon={<UserOutlined />}
          style={{ cursor: "pointer", border: "2px solid #e8e8e8" }}
        />
      </Dropdown>
    </div>
  );
};

export default UserOptions;
