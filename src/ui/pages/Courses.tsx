import AdminLayout from "../components/AdminLayout/AdminLayout";
import { Button, Card, Empty, List, Space, Tag } from "antd";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router-dom";
import {
  loadMockCourses,
  clearMockCourses,
  type MockCourse,
} from "../../core/mocks/course.mock";

export default function Courses() {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const [courses, setCourses] = useState<MockCourse[]>([]);

  useEffect(() => {
    setCourses(loadMockCourses());
  }, []);

  const handleClear = () => {
    clearMockCourses();
    setCourses([]);
  };

  const dateLocale = i18n.language.startsWith("en") ? "en-US" : "fr-FR";

  return (
    <AdminLayout>
      <Space direction="vertical" style={{ width: "100%" }} size="large">
        <Space style={{ width: "100%", justifyContent: "space-between" }}>
          <h1 style={{ margin: 0 }}>{t("courses.titleMock")}</h1>
          <Space>
            <Button onClick={() => setCourses(loadMockCourses())}>
              {t("courses.refresh")}
            </Button>
            <Button danger onClick={handleClear}>
              {t("courses.clearMock")}
            </Button>
            <Button type="primary">
              <Link to="/AddCourse" style={{ color: "white" }}>
                {t("courses.addNew")}
              </Link>
            </Button>
          </Space>
        </Space>

        {courses.length === 0 ? (
          <Empty description={t("courses.emptyMock")} />
        ) : (
          <List
            grid={{ gutter: 16, column: 2 }}
            dataSource={courses}
            renderItem={(course) => (
              <List.Item>
                <Card
                  title={course.title}
                  hoverable
                  onClick={() => navigate(`/courses/${course.id}`)}
                  style={{ cursor: "pointer" }}
                  extra={
                    <Space>
                      <Tag color="purple">
                        {t("courses.lessons", {
                          count: course.lessons?.length || 0,
                        })}
                      </Tag>
                      <Tag color="blue">
                        {t("courses.chapters", {
                          count: (course.lessons || []).reduce(
                            (acc, l) => acc + (l.chapters?.length || 0),
                            0
                          ),
                        })}
                      </Tag>
                    </Space>
                  }
                >
                  <p>{course.description}</p>
                  <p style={{ color: "#888", fontSize: 12 }}>
                    {t("courses.createdAt", {
                      date: new Date(course.createdAt).toLocaleString(
                        dateLocale
                      ),
                    })}
                  </p>
                </Card>
              </List.Item>
            )}
          />
        )}
      </Space>
    </AdminLayout>
  );
}
