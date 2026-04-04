import AdminLayout from "../components/AdminLayout/AdminLayout";
import { Card, Table } from "antd";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useGetLessonsQuery } from "@core/api/lesson.api";
import { ColumnsType } from "antd/es/table";
import { ILesson } from "@core/interfaces";
import { LessonsTableSkeleton } from "../components/courses/LessonsTableSkeleton";

export const Courses: React.FC = () => {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const { data, isLoading } = useGetLessonsQuery();

  const courses = data ?? [];
  const total = courses.length;

  const { t, i18n } = useTranslation();

  const dateLocale = i18n.language.startsWith("en") ? "en-US" : "fr-FR";

  const columns: ColumnsType<ILesson> = [
    {
      title: t("Titre"),
      dataIndex: "title",
      key: "title",
      width: 80,
      sorter: (a, b) => a.id - b.id,
    },
    {
      title: t("Durée"),
      dataIndex: "duration",
      key: "duration",
      render: (duration: number) => `${duration} min`,
    },
    {
      title: t("Utilisateurs associés"),
      dataIndex: "users",
      key: "users",
      render: (users: string[]) => users.join(", "),
    },
    {
      title: t("Créé le :"),
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date: string) =>
        new Date(date).toLocaleDateString(dateLocale, {
          year: "numeric",
          month: "short",
          day: "numeric",
        }),
    },
  ];

  return (
    <AdminLayout>
      <Card>
        {isLoading ? (
          <LessonsTableSkeleton />
        ) : (
          <div>
            <h1>{t("Cours")}</h1>
            <Table<ILesson>
              rowKey="id"
              columns={columns}
              dataSource={courses ?? []}
              scroll={{ x: "max-content" }}
              styles={{
                body: { cell: { whiteSpace: "nowrap" } },
                header: { cell: { whiteSpace: "nowrap" } },
              }}
              pagination={{
                current: page,
                pageSize,
                total,
                showSizeChanger: true,
                pageSizeOptions: ["5", "10", "20", "50"],
                showTotal: (totalCount: number, range: [number, number]) =>
                  t("Page", {
                    start: range[0],
                    end: range[1],
                    total: totalCount,
                  }),
                onChange: (newPage: number, newPageSize: number) => {
                  setPage(newPage);
                  setPageSize(newPageSize);
                },
              }}
            />
          </div>
        )}
      </Card>
    </AdminLayout>
  );
};
