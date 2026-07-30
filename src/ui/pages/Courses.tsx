import AdminLayout from "../components/AdminLayout/AdminLayout";
import { Card, Table, Button, Tag, Popconfirm, message } from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  useGetLessonsQuery,
  useDeleteLessonMutation,
} from "@core/api/lesson.api";
import { ColumnsType } from "antd/es/table";
import { ILesson } from "@core/interfaces";
import { LessonsTableSkeleton } from "../components/courses/LessonsTableSkeleton";
import { useNavigate } from "react-router-dom";
import { CourseFormModal } from "../components/courses/CourseFormModal";

export const Courses: React.FC = () => {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  const { data, isLoading } = useGetLessonsQuery({
    page,
    limit: pageSize,
    enablePagination: true,
  });

  const courses = data?.data ?? [];
  const total = data?.total ?? 0;

  const { t, i18n } = useTranslation();

  const navigate = useNavigate();

  const [deleteLesson, { isLoading: isDeleting }] = useDeleteLessonMutation();

  const handleDelete = async (id: number, title: string) => {
    try {
      await deleteLesson(id).unwrap();
      message.success(`Cours "${title}" supprimé`);
    } catch (e: any) {
      message.error(e?.data?.message ?? "Erreur lors de la suppression");
    }
  };

  const dateLocale = i18n.language.startsWith("en") ? "en-US" : "fr-FR";

  const columns: ColumnsType<ILesson> = [
    {
      title: t("Chapitres"),
      key: "chaptersCount",
      render: (_, record) => <Tag>{record.chapters?.length ?? 0}</Tag>,
    },
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
      render: (users: string[]) => users?.join(", "),
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
    {
      title: t("Actions"),
      key: "actions",
      width: 80,
      fixed: "right",
      align: "center",
      render: (_, record) => (
        // La ligne entière navigue vers le détail : on isole la cellule
        // d'actions, popup de confirmation comprise (React propage les events
        // à travers le portail).
        <div onClick={(e) => e.stopPropagation()}>
          <Popconfirm
            title="Supprimer ce cours ?"
            description={`"${record.title}" et tous ses chapitres seront supprimés définitivement.`}
            okText="Oui, supprimer"
            cancelText="Annuler"
            okButtonProps={{ danger: true, loading: isDeleting }}
            onConfirm={() => handleDelete(record.id, record.title)}
          >
            <Button type="text" danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </div>
      ),
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
              <h1>{t("Cours")}</h1>
              <Button
                style={{
                  backgroundColor: "#4196ff",
                  color: "white",
                  justifyContent: "end",
                }}
                onClick={() => setIsCreateOpen(true)}
              >
                + Ajouter un cours
              </Button>
            </div>
            <Table<ILesson>
              rowKey="id"
              columns={columns}
              dataSource={courses ?? []}
              onRow={(record) => ({
                onClick: () => navigate(`/courses/${record.id}`),
                style: { cursor: "pointer" },
              })}
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

      {/* La création reste sur /courses : la liste se rafraîchit via
          l'invalidation du tag Lessons, sans redirection. */}
      <CourseFormModal
        open={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
      />
    </AdminLayout>
  );
};
