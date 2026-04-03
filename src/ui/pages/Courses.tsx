import AdminLayout from "../components/AdminLayout/AdminLayout";
import { Button, Card, Empty, List, Space, Tag } from "antd";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router-dom";
import {
  useGetLessonsQuery,
  useGetLessonByIdQuery,
} from "@core/api/lesson.api";
import { ColumnsType } from "antd/es/table";
import { IChapter, ILesson } from "@core/interfaces";
import { LessonsTableSkeleton } from "../components/courses/LessonsTableSkeleton";

export const Courses: React.FC = () => {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const { data, isLoading } = useGetLessonsQuery({
    page,
    limit: pageSize,
    enablePagination: true,
  });

  const courses = data?.data ?? [];
  const total = data?.total ?? 0;

  const navigate = useNavigate();
  const { t, i18n } = useTranslation();

  const dateLocale = i18n.language.startsWith("en") ? "en-US" : "fr-FR";

  const columns: ColumnsType<ILesson> = [
    {
      title: t("courses.lessonId"),
      dataIndex: "id",
      key: "id",
      width: 80,
      sorter: (a, b) => a.id - b.id,
    },
    {
      title: t("courses.lessonTitle"),
      dataIndex: "title",
      key: "title",
      width: 80,
      sorter: (a, b) => a.id - b.id,
    },
    {
      title: t("courses.lessonDuration"),
      dataIndex: "duration",
      key: "duration",
      render: (duration: number) => `${duration} min`,
    },
    {
      title: t("courses.userAssociated"),
      dataIndex: "users",
      key: "users",
      render: (users: string[]) => users.join(", "),
    },
    {
      title: t("courses.colCreatedAt"),
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
          <List
            dataSource={courses}
            renderItem={(course) => (
              <List.Item>
                <List.Item.Meta
                  title={
                    <Link to={`/courses/${course.id}`}>{course.title}</Link>
                  }
                  description={course.description}
                />
              </List.Item>
            )}
          />
        )}
      </Card>
    </AdminLayout>
  );
};
