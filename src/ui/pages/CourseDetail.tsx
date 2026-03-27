import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
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
} from "../../core/mocks/course.mock";

const { Title, Text } = Typography;

export default function CourseDetail() {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const [course, setCourse] = useState<MockCourse | null>(null);

  const dateLocale = i18n.language.startsWith("en") ? "en-US" : "fr-FR";

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
            {t("courseDetail.backToCourses")}
          </Button>
          <Empty description={t("courseDetail.notFound")} />
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
            {t("courseDetail.backToCourses")}
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
                <Button
                  type="primary"
                  icon={<EditOutlined />}
                  onClick={() => navigate(`/courses/edit/${course.id}`)}
                >
                  {t("courseDetail.edit")}
                </Button>
              </Space>
            }
          >
            <Descriptions column={1} bordered>
              <Descriptions.Item label={t("courseDetail.description")}>
                {course.description}
              </Descriptions.Item>
              <Descriptions.Item label={t("courseDetail.createdAt")}>
                {new Date(course.createdAt).toLocaleString(dateLocale)}
              </Descriptions.Item>
              <Descriptions.Item label={t("courseDetail.id")}>
                {course.id}
              </Descriptions.Item>
            </Descriptions>
          </Card>

          <Card title={t("courseDetail.contentTitle")}>
            {!course.lessons || course.lessons.length === 0 ? (
              <Empty description={t("courseDetail.noLessons")} />
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
                        {t("courseDetail.lessonTitle", {
                          number: lessonIndex + 1,
                          title: lesson.title,
                        })}
                      </Text>
                      <Tag color="blue">
                        {t("courseDetail.chaptersInLesson", {
                          count: lesson.chapters?.length || 0,
                        })}
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
                        <Empty
                          description={t("courseDetail.noChaptersInLesson")}
                        />
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
                                    {t("courseDetail.chapterTitle", {
                                      number: chapterIndex + 1,
                                      title: chapter.title,
                                    })}
                                  </Text>
                                  <Space>
                                    <Tag color="cyan">
                                      {t("courseDetail.positionLabel", {
                                        value:
                                          chapter.position || chapterIndex + 1,
                                      })}
                                    </Tag>
                                    {chapter.status ? (
                                      <Tag
                                        icon={<CheckCircleOutlined />}
                                        color="success"
                                      >
                                        {t("courseDetail.active")}
                                      </Tag>
                                    ) : (
                                      <Tag
                                        icon={<CloseCircleOutlined />}
                                        color="default"
                                      >
                                        {t("courseDetail.inactive")}
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
                                      <Text strong>
                                        {t("courseDetail.descriptionLabel")}
                                      </Text>
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
                                          {t("courseDetail.imagesLabel", {
                                            count: chapterImages.length,
                                          })}
                                        </Text>
                                        <div style={{ marginTop: 12 }}>
                                          <Image.PreviewGroup>
                                            <Space wrap>
                                              {chapterImages.map(
                                                (img, imgIndex) => (
                                                  <Image
                                                    key={`${lesson.id}-${chapterIndex}-img-${imgIndex}`}
                                                    src={img}
                                                    alt={t(
                                                      "courseDetail.imageAlt",
                                                      {
                                                        number: imgIndex + 1,
                                                      }
                                                    )}
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
                                        {t("courseDetail.noChapterImages")}
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
