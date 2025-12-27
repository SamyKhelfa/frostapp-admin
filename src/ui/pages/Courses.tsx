import AdminLayout from "../components/AdminLayout/AdminLayout";
import { Button, Card, Empty, List, Space, Tag } from "antd";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  loadMockCourses,
  clearMockCourses,
  type MockCourse,
} from "../../core/services/mockCourses";

export default function Courses() {
  const navigate = useNavigate();
  const [courses, setCourses] = useState<MockCourse[]>([]);

  useEffect(() => {
    setCourses(loadMockCourses());
  }, []);

  const handleClear = () => {
    clearMockCourses();
    setCourses([]);
  };

  return (
    <AdminLayout>
      <Space direction="vertical" style={{ width: "100%" }} size="large">
        <Space style={{ width: "100%", justifyContent: "space-between" }}>
          <h1 style={{ margin: 0 }}>Courses (mock)</h1>
          <Space>
            <Button onClick={() => setCourses(loadMockCourses())}>
              Refresh
            </Button>
            <Button danger onClick={handleClear}>
              Clear mock data
            </Button>
            <Button type="primary">
              <Link to="/AddCourse" style={{ color: "white" }}>
                + Add New Course
              </Link>
            </Button>
          </Space>
        </Space>

        {courses.length === 0 ? (
          <Empty description="Aucun cours mock" />
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
                        {course.lessons?.length || 0} leçon(s)
                      </Tag>
                      <Tag color="blue">
                        {(course.lessons || []).reduce(
                          (acc, l) => acc + (l.chapters?.length || 0),
                          0
                        )}{" "}
                        chapitre(s)
                      </Tag>
                    </Space>
                  }
                >
                  <p>{course.description}</p>
                  <p style={{ color: "#888", fontSize: 12 }}>
                    Créé le {new Date(course.createdAt).toLocaleString()}
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
