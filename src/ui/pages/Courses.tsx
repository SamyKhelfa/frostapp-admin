import AdminLayout from "../components/AdminLayout/AdminLayout";
import {
  Card,
  Table,
  Button,
  Tag,
  Popconfirm,
  message,
  Modal,
  Input,
  Tooltip,
} from "antd";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  useGetLessonsQuery,
  useDeleteLessonMutation,
  useUpdateLessonMutation,
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
  const [updateLesson, { isLoading: isUpdating }] = useUpdateLessonMutation();

  const handleDelete = async (id: number, title: string) => {
    try {
      await deleteLesson(id).unwrap();
      message.success(`Cours "${title}" supprimé`);
    } catch (e: any) {
      message.error(e?.data?.message ?? "Erreur lors de la suppression");
    }
  };

  // Cours en cours de renommage : null = modale fermée
  const [editingLesson, setEditingLesson] = useState<ILesson | null>(null);
  const [draftTitle, setDraftTitle] = useState("");

  const openRenameModal = (lesson: ILesson) => {
    setEditingLesson(lesson);
    setDraftTitle(lesson.title);
  };

  const closeRenameModal = () => {
    setEditingLesson(null);
    setDraftTitle("");
  };

  const handleRenameTitle = async () => {
    if (!editingLesson) return;

    const trimmed = draftTitle.trim();

    if (!trimmed) {
      message.error("Le titre ne peut pas être vide");
      return;
    }

    if (trimmed === editingLesson.title) {
      closeRenameModal();
      return;
    }

    try {
      await updateLesson({
        id: editingLesson.id,
        data: { title: trimmed },
      }).unwrap();
      message.success("Titre mis à jour");
      closeRenameModal();
    } catch (e: any) {
      message.error(e?.data?.message ?? "Erreur lors de la mise à jour");
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
      sorter: (a, b) => a.title.localeCompare(b.title),
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
      width: 110,
      fixed: "right",
      align: "center",
      render: (_, record) => (
        // La ligne entière navigue vers le détail : on isole la cellule
        // d'actions, popup de confirmation comprise (React propage les events
        // à travers le portail).
        <div onClick={(e) => e.stopPropagation()}>
          <Tooltip title="Modifier le titre">
            <Button
              type="text"
              icon={<EditOutlined />}
              onClick={() => openRenameModal(record)}
            />
          </Tooltip>
          <Popconfirm
            title="Supprimer ce cours ?"
            description={`"${record.title}" et tous ses chapitres seront supprimés définitivement.`}
            okText="Oui, supprimer"
            cancelText="Annuler"
            okButtonProps={{ danger: true, loading: isDeleting }}
            onConfirm={() => handleDelete(record.id, record.title)}
          >
            <Tooltip title="Supprimer">
              <Button type="text" danger icon={<DeleteOutlined />} />
            </Tooltip>
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

      <Modal
        title="Modifier le titre du cours"
        open={editingLesson !== null}
        onOk={handleRenameTitle}
        onCancel={closeRenameModal}
        okText="Enregistrer"
        cancelText="Annuler"
        confirmLoading={isUpdating}
        destroyOnClose
      >
        <Input
          value={draftTitle}
          onChange={(e) => setDraftTitle(e.target.value)}
          onPressEnter={handleRenameTitle}
          placeholder="Titre du cours"
          maxLength={120}
          showCount
          autoFocus
        />
      </Modal>
    </AdminLayout>
  );
};
