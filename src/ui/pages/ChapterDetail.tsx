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
import { SubChapterFormModal } from "../components/courses/SubChapterFormModal";
import { useGetChapterByIdQuery } from "@core/api/chapter.api";
import { useDeleteSubChapterMutation } from "@core/api/subchapter.api";
import type { ISubchapter } from "@core/interfaces";

const { Title, Text } = Typography;

/** Vue d'un chapitre : la liste de ses sous-chapitres. */
export default function ChapterDetail() {
  const { courseId, chapterId } = useParams<{
    courseId: string;
    chapterId: string;
  }>();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const {
    data: chapter,
    isLoading,
    isError,
  } = useGetChapterByIdQuery(chapterId as string, { skip: !chapterId });

  const [deleteSubChapter, { isLoading: isDeleting }] =
    useDeleteSubChapterMutation();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editing, setEditing] = useState<ISubchapter | null>(null);

  const subChapters = [...(chapter?.subChapters ?? [])].sort(
    (a, b) => a.position - b.position,
  );

  const openCreate = () => {
    setEditing(null);
    setIsFormOpen(true);
  };

  const openEdit = (subChapter: ISubchapter) => {
    setEditing(subChapter);
    setIsFormOpen(true);
  };

  const handleDelete = async (subChapter: ISubchapter) => {
    try {
      await deleteSubChapter(subChapter.id).unwrap();
      message.success(t("subChapterForm.deleted"));
    } catch (e: unknown) {
      const msg = (e as { data?: { message?: string } })?.data?.message;
      message.error(msg ?? t("subChapterForm.deleteError"));
    }
  };

  const columns: ColumnsType<ISubchapter> = [
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
      title: t("chapterDetail.colTitle"),
      dataIndex: "title",
      key: "title",
    },
    {
      title: t("courseDetail.colDescription"),
      dataIndex: "description",
      key: "description",
      render: (description: string) =>
        description || <Text type="secondary">{t("courseDetail.empty")}</Text>,
    },
    {
      title: t("chapterDetail.colVideo"),
      dataIndex: "video",
      key: "video",
      render: (video: string) =>
        video ? (
          <a href={video} target="_blank" rel="noreferrer">
            {video}
          </a>
        ) : (
          <Text type="secondary">{t("courseDetail.empty")}</Text>
        ),
    },
    {
      title: t("chapterDetail.colDuration"),
      dataIndex: "duration",
      key: "duration",
      width: 120,
      sorter: (a, b) => a.duration - b.duration,
      render: (duration: number) => t("chapterDetail.minutes", { duration }),
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
      title: t("courseDetail.colActions"),
      key: "actions",
      width: 110,
      fixed: "right",
      align: "center",
      render: (_, record) => (
        <Space>
          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={() => openEdit(record)}
          />
          <Popconfirm
            title={t("subChapterForm.deleteTitle")}
            description={t("subChapterForm.deleteConfirm", {
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
      ),
    },
  ];

  const backButton = (
    <Button
      icon={<ArrowLeftOutlined />}
      onClick={() => navigate(courseId ? `/courses/${courseId}` : "/courses")}
    >
      {t("chapterDetail.backToCourse")}
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

  if (isError || !chapter) {
    return (
      <AdminLayout>
        <Card>
          <Space orientation="vertical" style={{ width: "100%" }} size="large">
            {backButton}
            <Empty description={t("chapterDetail.notFound")} />
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
                {chapter.title}
              </Title>
              <Space>
                <Tag color={chapter.status ? "green" : "red"}>
                  {chapter.status
                    ? t("courseDetail.statusActive")
                    : t("courseDetail.statusInactive")}
                </Tag>
                <Tag color="blue">
                  {t("chapterDetail.subChaptersCount", {
                    count: subChapters.length,
                  })}
                </Tag>
                <Button
                  type="primary"
                  icon={<PlusOutlined />}
                  onClick={openCreate}
                >
                  {t("addCourse.addSubChapter")}
                </Button>
              </Space>
            </div>
            <Text type="secondary">
              {chapter.description || t("courseDetail.empty")}
            </Text>
          </div>

          <Table<ISubchapter>
            rowKey="id"
            columns={columns}
            dataSource={subChapters}
            pagination={false}
            scroll={{ x: "max-content" }}
            styles={{
              body: { cell: { whiteSpace: "nowrap" } },
              header: { cell: { whiteSpace: "nowrap" } },
            }}
            locale={{
              emptyText: (
                <Empty description={t("chapterDetail.noSubChapters")} />
              ),
            }}
          />
        </Space>
      </Card>

      <SubChapterFormModal
        open={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        chapterId={chapter.id}
        subChapter={editing}
        nextPosition={subChapters.length + 1}
      />
    </AdminLayout>
  );
}
