import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Card,
  Space,
  Tag,
  Button,
  Collapse,
  Empty,
  Descriptions,
  Image,
  Typography,
} from "antd";
import {
  ArrowLeftOutlined,
  BookOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  EditOutlined,
} from "@ant-design/icons";
import AdminLayout from "../components/AdminLayout/AdminLayout";
import {
  loadMockCourses,
  type MockCourse,
} from "../../core/services/mockCourses";

const { Title, Text } = Typography;

export default function CourseDetail() {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();
  const [course, setCourse] = useState<MockCourse | null>(null);

  useEffect(() => {
    const courses = loadMockCourses();
    const found = courses.find((c) => c.id === courseId);
    setCourse(found || null);
  }, [courseId]);

  if (!course) {
    return (
      <AdminLayout>
        <Space direction="vertical" style={{ width: "100%" }} size="large">
          <Button
            icon={<ArrowLeftOutlined />}
            onClick={() => navigate("/courses")}
          >
            Retour aux cours
          </Button>
          <Empty description="Cours introuvable" />
        </Space>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "24px" }}>
        <Space direction="vertical" style={{ width: "100%" }} size="large">
          <Button
            icon={<ArrowLeftOutlined />}
            onClick={() => navigate("/courses")}
          >
            Retour aux cours
          </Button>

          <Card
            title={
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <BookOutlined style={{ fontSize: 28, color: "#1890ff" }} />
                <Title level={2} style={{ margin: 0 }}>
                  {course.title}
                </Title>
              </div>
            }
            extra={
              <Space>
                <Tag color="purple">{course.lessons?.length || 0} leçon(s)</Tag>
                <Tag color="blue">
                  {(course.lessons || []).reduce(
                    (acc, l) => acc + (l.chapters?.length || 0),
                    0
                  )}{" "}
                  chapitre(s)
                </Tag>
                <Button
                  type="primary"
                  icon={<EditOutlined />}
                  onClick={() => navigate(`/courses/edit/${course.id}`)}
                >
                  Modifier
                </Button>
              </Space>
            }
          >
            <Descriptions column={1} bordered>
              <Descriptions.Item label="Description">
                {course.description}
              </Descriptions.Item>
              <Descriptions.Item label="Date de création">
                {new Date(course.createdAt).toLocaleString("fr-FR")}
              </Descriptions.Item>
              <Descriptions.Item label="ID">{course.id}</Descriptions.Item>
            </Descriptions>
          </Card>

          <Card title="Contenu du cours">
            {!course.lessons || course.lessons.length === 0 ? (
              <Empty description="Aucune leçon dans ce cours" />
            ) : (
              <Collapse
                accordion
                items={course.lessons.map((lesson, lessonIndex) => ({
                  key: lesson.id,
                  label: (
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        width: "100%",
                        alignItems: "center",
                      }}
                    >
                      <Text strong>
                        Leçon {lessonIndex + 1}: {lesson.title}
                      </Text>
                      <Tag color="blue">
                        {lesson.chapters?.length || 0} chapitre(s)
                      </Tag>
                    </div>
                  ),
                  children: (
                    <Space
                      direction="vertical"
                      style={{ width: "100%" }}
                      size="large"
                    >
                      {lesson.description && (
                        <Card size="small" type="inner">
                          <Text>{lesson.description}</Text>
                        </Card>
                      )}

                      {!lesson.chapters || lesson.chapters.length === 0 ? (
                        <Empty description="Aucun chapitre dans cette leçon" />
                      ) : (
                        <Collapse
                          size="small"
                          items={lesson.chapters.map(
                            (chapter, chapterIndex) => ({
                              key: `${lesson.id}-chapter-${chapterIndex}`,
                              label: (
                                <div
                                  style={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    width: "100%",
                                    alignItems: "center",
                                  }}
                                >
                                  <Text>
                                    Chapitre {chapterIndex + 1}: {chapter.title}
                                  </Text>
                                  <Space>
                                    <Tag color="cyan">
                                      Position:{" "}
                                      {chapter.position || chapterIndex + 1}
                                    </Tag>
                                    {chapter.status ? (
                                      <Tag
                                        icon={<CheckCircleOutlined />}
                                        color="success"
                                      >
                                        Actif
                                      </Tag>
                                    ) : (
                                      <Tag
                                        icon={<CloseCircleOutlined />}
                                        color="default"
                                      >
                                        Inactif
                                      </Tag>
                                    )}
                                  </Space>
                                </div>
                              ),
                              children: (
                                <Space
                                  direction="vertical"
                                  style={{ width: "100%" }}
                                  size="middle"
                                >
                                  {chapter.description && (
                                    <div>
                                      <Text strong>Description:</Text>
                                      <div style={{ marginTop: 8 }}>
                                        <Text>{chapter.description}</Text>
                                      </div>
                                    </div>
                                  )}

                                  {(() => {
                                    const chapterImages =
                                      (chapter.images as
                                        | string[]
                                        | undefined) ??
                                      (chapter.image
                                        ? [chapter.image as string]
                                        : []);

                                    return chapterImages.length > 0 ? (
                                      <div>
                                        <Text strong>
                                          Images ({chapterImages.length}):
                                        </Text>
                                        <div style={{ marginTop: 12 }}>
                                          <Image.PreviewGroup>
                                            <Space wrap>
                                              {chapterImages.map(
                                                (img, imgIndex) => (
                                                  <Image
                                                    key={`${lesson.id}-${chapterIndex}-img-${imgIndex}`}
                                                    src={img}
                                                    alt={`Image ${
                                                      imgIndex + 1
                                                    }`}
                                                    width={150}
                                                    height={100}
                                                    style={{
                                                      objectFit: "cover",
                                                      borderRadius: 8,
                                                    }}
                                                  />
                                                )
                                              )}
                                            </Space>
                                          </Image.PreviewGroup>
                                        </div>
                                      </div>
                                    ) : (
                                      <Text type="secondary" italic>
                                        Aucune image pour ce chapitre
                                      </Text>
                                    );
                                  })()}
                                </Space>
                              ),
                            })
                          )}
                        />
                      )}
                    </Space>
                  ),
                }))}
              />
            )}
          </Card>
        </Space>
      </div>
    </AdminLayout>
  );
}
