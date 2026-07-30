import AdminLayout from "../components/AdminLayout/AdminLayout";
import { Card, Table, Tag, Button } from "antd";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useGetChaptersQuery } from "@core/api/chapter.api";
import { ColumnsType } from "antd/es/table";
import { IChapter } from "@core/interfaces";
import { LessonsTableSkeleton } from "../components/courses/LessonsTableSkeleton";
import { useNavigate } from "react-router-dom";

export const Chapters: React.FC = () => {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const { data, isLoading } = useGetChaptersQuery({
    page,
    limit: pageSize,
    enablePagination: true,
  });

  const chapters = data?.data ?? [];
  const total = data?.total ?? 0;

  const { t, i18n } = useTranslation();

  const navigate = useNavigate();

  const dateLocale = i18n.language.startsWith("en") ? "en-US" : "fr-FR";

  const columns: ColumnsType<IChapter> = [
    {
      title: t("Titre du chapitre"),
      dataIndex: "title",
      key: "title",
      width: 80,
      sorter: (a, b) => a.id - b.id,
    },
    {
      title: t("Position"),
      dataIndex: "position",
      key: "position",
      sorter: (a, b) => a.position - b.position,
    },
    {
      title: t("Statut"),
      dataIndex: "status",
      key: "status",
      render: (status: boolean) =>
        status ? (
          <Tag color="green">{t("courseDetail.statusActive")}</Tag>
        ) : (
          <Tag color="red">{t("courseDetail.statusInactive")}</Tag>
        ),
    },
    {
      title: t("Cours"),
      dataIndex: "lesson",
      key: "lesson",
      render: (lesson: IChapter["lesson"]) => lesson?.title ?? "—",
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
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <h1>{t("Chapitres")}</h1>
              <Button
                style={{
                  backgroundColor: "#4196ff",
                  color: "white",
                  justifyContent: "end",
                }}
                onClick={() => navigate("/AddChapter")}
              >
                + Ajouter un chapitre
              </Button>
            </div>
            <Table<IChapter>
              rowKey="id"
              columns={columns}
              dataSource={chapters ?? []}
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
