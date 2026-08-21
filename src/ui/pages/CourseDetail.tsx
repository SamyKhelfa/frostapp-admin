import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  Card,
  Space,
  Tag,
  Button,
  Empty,
  Table,
  Typography,
  Popconfirm,
  message,
} from "antd";
import {
  ArrowLeftOutlined,
  DeleteOutlined,
  EditOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import AdminLayout from "../components/AdminLayout/AdminLayout";
import { LessonsTableSkeleton } from "../components/courses/LessonsTableSkeleton";
import { ChapterFormModal } from "../components/courses/ChapterFormModal";
import { useGetLessonByIdQuery } from "@core/api/lesson.api";
import { useDeleteChapterMutation } from "@core/api/chapter.api";
import type { IChapter } from "@core/interfaces";

const { Title, Text } = Typography;

export default function CourseDetail() {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();

  const {
    data: course,
    isLoading,
    isError,
  } = useGetLessonByIdQuery(courseId as string, { skip: !courseId });

  const [deleteChapter, { isLoading: isDeleting }] = useDeleteChapterMutation();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editing, setEditing] = useState<IChapter | null>(null);

  const dateLocale = i18n.language.startsWith("en") ? "en-US" : "fr-FR";

  const openCreate = () => {
    setEditing(null);
    setIsFormOpen(true);
  };

  const openEdit = (chapter: IChapter) => {
    setEditing(chapter);
    setIsFormOpen(true);
  };

  const handleDelete = async (chapter: IChapter) => {
    try {
      await deleteChapter(chapter.id).unwrap();
      message.success(t("chapterForm.deleted"));
    } catch (e: unknown) {
      const msg = (e as { data?: { message?: string } })?.data?.message;
      message.error(msg ?? t("chapterForm.deleteError"));
    }
  };

  const chapters = [...(course?.chapters ?? [])].sort(
    (a, b) => a.position - b.position,
  );

  const columns: ColumnsType<IChapter> = [
    {
      title: t("courseDetail.colPosition"),
      dataIndex: "position",
      key: "position",
      width: 100,
      sorter: (a, b) => a.position - b.position,
      defaultSortOrder: "ascend",
      render: (position: number) => <Tag>#{position}</Tag>,
    },
    {
      title: t("courseDetail.colTitle"),
      dataIndex: "title",
      key: "title",
      sorter: (a, b) => a.title.localeCompare(b.title),
    },
    {
      title: t("courseDetail.colDescription"),
      dataIndex: "description",
      key: "description",
      render: (description: string) =>
        description || <Text type="secondary">{t("courseDetail.empty")}</Text>,
    },
    {
      title: t("courseDetail.colSubChapters"),
      key: "subChapters",
      width: 120,
      render: (_, record) => <Tag>{record.subChapters?.length ?? 0}</Tag>,
    },
    {
      title: t("courseDetail.colStatus"),
      dataIndex: "status",
      key: "status",
      width: 140,
      filters: [
        { text: t("courseDetail.statusActive"), value: true },
        { text: t("courseDetail.statusInactive"), value: false },
      ],
      onFilter: (value, record) => record.status === value,
      render: (status: boolean) => (
        <Tag color={status ? "green" : "red"}>
          {status
            ? t("courseDetail.statusActive")
            : t("courseDetail.statusInactive")}
        </Tag>
      ),
    },
    {
      title: t("courseDetail.colCreatedAt"),
      dataIndex: "createdAt",
      key: "createdAt",
      width: 160,
      render: (date: string) =>
        date
          ? new Date(date).toLocaleDateString(dateLocale, {
              year: "numeric",
              month: "short",
              day: "numeric",
            })
          : "—",
    },
    {
      title: t("courseDetail.colActions"),
      key: "actions",
      width: 110,
      fixed: "right",
      align: "center",
      render: (_, record) => (
        <div onClick={(e) => e.stopPropagation()}>
          <Space>
            <Button
              type="text"
              icon={<EditOutlined />}
              onClick={() => openEdit(record)}
            />
            <Popconfirm
              title={t("chapterForm.deleteTitle")}
              description={t("chapterForm.deleteConfirm", {
                title: record.title,
              })}
              okText={t("courseDetail.deleteOk")}
              cancelText={t("addCourse.cancel")}
              okButtonProps={{ danger: true, loading: isDeleting }}
              onConfirm={() => handleDelete(record)}
            >
              <Button type="text" danger icon={<DeleteOutlined />} />
            </Popconfirm>
          </Space>
        </div>
      ),
    },
  ];

  const backButton = (
    <Button icon={<ArrowLeftOutlined />} onClick={() => navigate("/courses")}>
      {t("courseDetail.backToCourses")}
    </Button>
  );

  if (isLoading) {
    return (
      <AdminLayout>
        <Card>
          <LessonsTableSkeleton />
        </Card>
      </AdminLayout>
    );
  }

  if (isError || !course) {
    return (
      <AdminLayout>
        <Card>
          <Space orientation="vertical" style={{ width: "100%" }} size="large">
            {backButton}
            <Empty description={t("courseDetail.notFound")} />
          </Space>
        </Card>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <Card>
        <Space orientation="vertical" style={{ width: "100%" }} size="large">
          {backButton}

          <div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                gap: 16,
              }}
            >
              <Title level={2} style={{ margin: 0 }}>
                {course.title}
              </Title>
              <Space>
                <Tag color="blue">
                  {t("courseDetail.chaptersCount", { count: chapters.length })}
                </Tag>
                <Button
                  type="primary"
                  icon={<PlusOutlined />}
                  onClick={openCreate}
                >
                  {t("addCourse.addChapter")}
                </Button>
              </Space>
            </div>
            <Text type="secondary">
              {course.description || t("courseDetail.empty")}
            </Text>
          </div>

          <Table<IChapter>
            rowKey="id"
            columns={columns}
            dataSource={chapters}
            pagination={false}
            onRow={(record) => ({
              onClick: () =>
                navigate(`/courses/${course.id}/chapters/${record.id}`),
              style: { cursor: "pointer" },
            })}
            scroll={{ x: "max-content" }}
            styles={{
              body: { cell: { whiteSpace: "nowrap" } },
              header: { cell: { whiteSpace: "nowrap" } },
            }}
            locale={{
              emptyText: <Empty description={t("courseDetail.noChapters")} />,
            }}
          />
        </Space>
      </Card>

      <ChapterFormModal
        open={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        lessonId={course.id}
        chapter={editing}
        nextPosition={chapters.length + 1}
      />
    </AdminLayout>
  );
}
