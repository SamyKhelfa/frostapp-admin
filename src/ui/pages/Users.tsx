import { useGetUsersQuery } from "@core/api";
import type { IUser } from "@core/interfaces";
import AdminLayout from "../components/AdminLayout/AdminLayout";
import { UsersTableSkeleton } from "../components/user/UsersTableSkeleton";
import Card from "antd/es/card/Card";
import { Skeleton, Table, Tag } from "antd";
import type { ColumnsType } from "antd/es/table";
import React, { useMemo } from "react";
import { useTranslation } from "react-i18next";

export const Users: React.FC = () => {
  const { data: users, isLoading } = useGetUsersQuery();
  const { t, i18n } = useTranslation();

  const dateLocale = i18n.language.startsWith("en") ? "en-US" : "fr-FR";

  const columns: ColumnsType<IUser> = useMemo(
    () => [
      {
        title: t("users.colId"),
        dataIndex: "id",
        key: "id",
        width: 80,
        sorter: (a, b) => a.id - b.id,
      },
      {
        title: t("users.colName"),
        dataIndex: "name",
        key: "name",
        sorter: (a, b) => a.name.localeCompare(b.name),
      },
      {
        title: t("users.colEmail"),
        dataIndex: "email",
        key: "email",
        sorter: (a, b) => a.email.localeCompare(b.email),
      },
      {
        title: t("users.colRole"),
        dataIndex: "role",
        key: "role",
        render: (role: string | undefined) => {
          if (role === "admin") return t("users.roleAdmin");
          if (role === "user") return t("users.roleUser");
          return role ?? "—";
        },
      },
      {
        title: t("users.colActive"),
        dataIndex: "active",
        key: "active",
        render: (active: boolean | undefined) =>
          active ? (
            <Tag color="success">{t("users.activeYes")}</Tag>
          ) : (
            <Tag>{t("users.activeNo")}</Tag>
          ),
      },
      {
        title: t("users.colCreatedAt"),
        dataIndex: "createdAt",
        key: "createdAt",
        render: (v: string) =>
          v ? new Date(v).toLocaleString(dateLocale) : "—",
      },
      {
        title: t("users.colUpdatedAt"),
        dataIndex: "updatedAt",
        key: "updatedAt",
        render: (v: string) =>
          v ? new Date(v).toLocaleString(dateLocale) : "—",
      },
    ],
    [t, dateLocale]
  );

  return (
    <AdminLayout>
      <Card>
        {isLoading ? (
          <div>
            <Skeleton
              active
              title={{ width: 200 }}
              paragraph={false}
              style={{ marginBottom: 24 }}
            />
            <UsersTableSkeleton />
          </div>
        ) : (
          <div>
            <h1 style={{ marginTop: 0, marginBottom: 24 }}>
              {t("users.title")}
            </h1>
            <Table<IUser>
              rowKey="id"
              columns={columns}
              dataSource={users ?? []}
              scroll={{ x: "max-content" }}
              styles={{
                body: { cell: { whiteSpace: "nowrap" } },
                header: { cell: { whiteSpace: "nowrap" } },
              }}
              pagination={{
                pageSize: 10,
                showSizeChanger: true,
                pageSizeOptions: [10, 20, 50],
                showTotal: (total, range) =>
                  t("users.paginationTotal", {
                    start: range[0],
                    end: range[1],
                    total,
                  }),
              }}
            />
          </div>
        )}
      </Card>
    </AdminLayout>
  );
};
