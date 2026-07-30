import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import {
  Form,
  Button,
  Input,
  Card,
  Space,
  Divider,
  Switch,
  InputNumber,
  message,
  Collapse,
  Empty,
  Tag,
  Upload,
  Typography,
} from "antd";
import {
  PlusOutlined,
  DeleteOutlined,
  BookOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import type { IChapter } from "../../core/interfaces/chapter.interface";
import { useCreateLessonMutation } from "@core/api/lesson.api";
import { useCreateChapterMutation } from "@core/api/chapter.api";
import AdminLayout from "../components/AdminLayout/AdminLayout";
import { NavLink, useParams, useNavigate } from "react-router-dom";

type LocalChapter = Pick<
  IChapter,
  "title" | "description" | "image" | "status" | "position"
> & {
  images?: string[];
};

type LocalLesson = {
  id: string;
  title: string;
  description: string;
  chapters: LocalChapter[];
};

export const AddCourse: React.FC = () => {
  const { Text } = Typography;
  const { t } = useTranslation();
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [lessons, setLessons] = useState<LocalLesson[]>([]);
  const [createLesson, { isLoading: isCreatingLesson }] =
    useCreateLessonMutation();
  const [createChapter, { isLoading: isCreatingChapters }] =
    useCreateChapterMutation();
  const isCreating = isCreatingLesson || isCreatingChapters;
  const isEditMode = Boolean(courseId);

  useEffect(() => {
    if (courseId) {
      // TODO: brancher useGetLessonByIdQuery pour préremplir en mode édition
      message.info("Le mode édition n'est pas encore branché à l'API");
    }
  }, [courseId]);

  const handleAddLesson = () => {
    setLessons([
      ...lessons,
      {
        id: crypto.randomUUID?.() ?? Date.now().toString(),
        title: "",
        description: "",
        chapters: [],
      },
    ]);
  };

  const handleDeleteLesson = (lessonIndex: number) => {
    setLessons(lessons.filter((_, i) => i !== lessonIndex));
    message.success(t("addCourse.lessonDeleted"));
  };

  const handleLessonChange = (
    lessonIndex: number,
    field: keyof Omit<LocalLesson, "chapters" | "id">,
    value: any,
  ) => {
    const next = [...lessons];
    next[lessonIndex] = { ...next[lessonIndex], [field]: value };
    setLessons(next);
  };

  const handleAddChapter = (lessonIndex: number) => {
    const next = [...lessons];
    const chapters = next[lessonIndex].chapters || [];
    next[lessonIndex] = {
      ...next[lessonIndex],
      chapters: [
        ...chapters,
        {
          title: "",
          description: "",
          image: "",
          images: [],
          status: false,
          position: chapters.length + 1,
        },
      ],
    };
    setLessons(next);
  };

  const handleDeleteChapter = (lessonIndex: number, chapterIndex: number) => {
    const next = [...lessons];
    next[lessonIndex] = {
      ...next[lessonIndex],
      chapters: next[lessonIndex].chapters.filter((_, i) => i !== chapterIndex),
    };
    setLessons(next);
    message.success(t("addCourse.chapterDeleted"));
  };

  const handleChapterChange = (
    lessonIndex: number,
    chapterIndex: number,
    field: keyof LocalChapter,
    value: any,
  ) => {
    const next = [...lessons];
    const chapters = [...(next[lessonIndex].chapters || [])];
    chapters[chapterIndex] = { ...chapters[chapterIndex], [field]: value };
    next[lessonIndex] = { ...next[lessonIndex], chapters };
    setLessons(next);
  };

  const handleAddChapterImages = async (
    lessonIndex: number,
    chapterIndex: number,
    _newFiles: File[],
  ) => {
    const next = [...lessons];
    const chapters = [...(next[lessonIndex].chapters || [])];
    const existing =
      chapters[chapterIndex].images ??
      (chapters[chapterIndex].image ? [chapters[chapterIndex].image] : []);

    const uploaded = [""];

    const nextImages = [...existing, ...uploaded];

    chapters[chapterIndex] = {
      ...chapters[chapterIndex],
      images: nextImages,
      image: nextImages[0] ?? "",
    };

    next[lessonIndex] = { ...next[lessonIndex], chapters };
    setLessons(next);
  };

  const handleRemoveChapterImage = (
    lessonIndex: number,
    chapterIndex: number,
    imageIndex: number,
  ) => {
    const next = [...lessons];
    const chapters = [...(next[lessonIndex].chapters || [])];
    const current =
      chapters[chapterIndex].images ??
      (chapters[chapterIndex].image ? [chapters[chapterIndex].image] : []);

    const nextImages = current.filter((_, idx) => idx !== imageIndex);

    chapters[chapterIndex] = {
      ...chapters[chapterIndex],
      images: nextImages,
      image: nextImages[0] ?? "",
    };

    next[lessonIndex] = { ...next[lessonIndex], chapters };
    setLessons(next);
    message.success(t("addCourse.imageRemoved"));
  };

  const onSubmit = async (values: any) => {
    try {
      if (isEditMode && courseId) {
        message.warning("Édition pas encore branchée à l'API");
        return;
      }

      // Le backend ne connaît que Lesson > Chapter : le cours saisi devient la
      // leçon, et tous les chapitres des blocs du formulaire lui sont rattachés.
      const chaptersToCreate = lessons.flatMap((lesson) => lesson.chapters);

      if (chaptersToCreate.some((chapter) => !chapter.title?.trim())) {
        message.error(t("addCourse.chapterTitleRequired"));
        return;
      }

      const payload = {
        title: values.title,
        description: values.description,
      };

      const created = await createLesson(payload).unwrap();

      // Les chapitres ne peuvent pas être créés en même temps que la leçon
      // (LessonCreateDTO.chapters attend des ids existants à connecter), il faut
      // un POST /chapters par chapitre, en série pour préserver l'ordre.
      let createdChapters = 0;
      try {
        for (const [index, chapter] of chaptersToCreate.entries()) {
          await createChapter({
            title: chapter.title.trim(),
            description: chapter.description ?? "",
            image: chapter.image ?? "",
            status: chapter.status ?? false,
            position: index + 1,
            lessonId: created.id,
          }).unwrap();
          createdChapters += 1;
        }
      } catch (chapterError) {
        message.warning(
          t("addCourse.chaptersPartialError", {
            created: createdChapters,
            total: chaptersToCreate.length,
          }),
        );
        console.error(chapterError);
        navigate(`/courses/${created.id}`);
        return;
      }

      message.success(
        createdChapters > 0
          ? t("addCourse.createdWithChapters", { count: createdChapters })
          : t("addCourse.createdSuccess"),
      );
      form.resetFields();
      setLessons([]);
      navigate(`/courses/${created.id}`);
    } catch (e: any) {
      const msg = e?.data?.message ?? t("addCourse.createError");
      message.error(msg);
    }
  };

  return (
    <AdminLayout>
      <div style={{ maxWidth: 900, margin: "0 auto", padding: "24px" }}>
        <Card
          title={
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <BookOutlined style={{ fontSize: 24 }} />
              <span>
                {isEditMode
                  ? t("addCourse.titleEdit")
                  : t("addCourse.titleCreate")}
              </span>
            </div>
          }
          style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.1)" }}
        >
          <Form
            form={form}
            layout="vertical"
            onFinish={onSubmit}
            autoComplete="off"
          >
            <div style={{ marginBottom: 24 }}>
              <h3 style={{ marginBottom: 16, color: "#1890ff" }}>
                {t("addCourse.sectionCourseInfo")}
              </h3>

              <Form.Item
                label={t("addCourse.fieldCourseTitle")}
                name="title"
                rules={[
                  {
                    required: true,
                    message: t("addCourse.fieldCourseTitleRequired"),
                  },
                ]}
              >
                <Input
                  placeholder={t("addCourse.fieldCourseTitlePlaceholder")}
                  size="large"
                  allowClear
                />
              </Form.Item>

              <Form.Item
                label={t("addCourse.fieldDescription")}
                name="description"
                rules={[
                  {
                    required: true,
                    message: t("addCourse.fieldDescriptionRequired"),
                  },
                ]}
              >
                <Input.TextArea
                  placeholder={t("addCourse.fieldDescriptionPlaceholder")}
                  rows={4}
                  allowClear
                />
              </Form.Item>
            </div>

            <Divider />

            <div style={{ marginBottom: 24 }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: 16,
                }}
              >
                <h3 style={{ margin: 0, color: "#1890ff" }}>
                  {t("addCourse.lessonsHeading", { count: lessons.length })}
                </h3>
                <Button
                  type="primary"
                  icon={<PlusOutlined />}
                  onClick={handleAddLesson}
                >
                  {t("addCourse.addLesson")}
                </Button>
              </div>

              {lessons.length === 0 ? (
                <Empty
                  description={t("addCourse.noLessons")}
                  style={{ padding: "40px 0" }}
                />
              ) : (
                <Collapse
                  accordion
                  items={lessons.map((lesson, lessonIndex) => ({
                    key: lesson.id,
                    label: (
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          width: "100%",
                        }}
                      >
                        <span>
                          {lesson.title ||
                            t("addCourse.lessonFallback", {
                              number: lessonIndex + 1,
                            })}
                        </span>
                        <Tag color="blue">
                          {t("addCourse.chaptersCount", {
                            count: lesson.chapters.length,
                          })}
                        </Tag>
                      </div>
                    ),
                    children: (
                      <Space
                        orientation="vertical"
                        style={{ width: "100%" }}
                        size="large"
                      >
                        <Form.Item
                          label={t("addCourse.fieldLessonTitle")}
                          required
                        >
                          <Input
                            placeholder={t(
                              "addCourse.fieldLessonTitlePlaceholder",
                            )}
                            value={lesson.title}
                            onChange={(e) =>
                              handleLessonChange(
                                lessonIndex,
                                "title",
                                e.target.value,
                              )
                            }
                          />
                        </Form.Item>
                        <Form.Item
                          label={t("addCourse.fieldLessonDescription")}
                        >
                          <Input.TextArea
                            placeholder={t(
                              "addCourse.fieldLessonDescriptionPlaceholder",
                            )}
                            value={lesson.description}
                            onChange={(e) =>
                              handleLessonChange(
                                lessonIndex,
                                "description",
                                e.target.value,
                              )
                            }
                          />
                        </Form.Item>

                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                          }}
                        >
                          <h4 style={{ margin: 0 }}>
                            {t("addCourse.chaptersHeading", {
                              count: lesson.chapters.length,
                            })}
                          </h4>
                          <Button
                            type="dashed"
                            icon={<PlusOutlined />}
                            onClick={() => handleAddChapter(lessonIndex)}
                          >
                            {t("addCourse.addChapter")}
                          </Button>
                        </div>

                        {lesson.chapters.length === 0 ? (
                          <Empty description={t("addCourse.noChapters")} />
                        ) : (
                          <Collapse
                            items={lesson.chapters.map(
                              (chapter, chapterIndex) => ({
                                key: `${lesson.id}-${chapterIndex}`,
                                label: (
                                  <div
                                    style={{
                                      display: "flex",
                                      justifyContent: "space-between",
                                      width: "100%",
                                    }}
                                  >
                                    <span>
                                      {chapter.title ||
                                        t("addCourse.chapterFallback", {
                                          number: chapterIndex + 1,
                                        })}
                                      <Tag
                                        color={chapter.status ? "green" : "red"}
                                        style={{ marginLeft: 8 }}
                                      >
                                        {chapter.status
                                          ? t("addCourse.statusOn")
                                          : t("addCourse.statusOff")}
                                      </Tag>
                                    </span>
                                  </div>
                                ),
                                children: (
                                  <Space
                                    orientation="vertical"
                                    style={{ width: "100%" }}
                                    size="large"
                                  >
                                    <Form.Item
                                      label={t("addCourse.fieldChapterTitle")}
                                      required
                                    >
                                      <Input
                                        placeholder={t(
                                          "addCourse.fieldChapterTitlePlaceholder",
                                        )}
                                        value={chapter.title || ""}
                                        onChange={(e) =>
                                          handleChapterChange(
                                            lessonIndex,
                                            chapterIndex,
                                            "title",
                                            e.target.value,
                                          )
                                        }
                                      />
                                    </Form.Item>

                                    <Form.Item
                                      label={t(
                                        "addCourse.fieldChapterDescription",
                                      )}
                                    >
                                      <Input.TextArea
                                        placeholder={t(
                                          "addCourse.fieldChapterDescriptionPlaceholder",
                                        )}
                                        rows={3}
                                        value={chapter.description || ""}
                                        onChange={(e) =>
                                          handleChapterChange(
                                            lessonIndex,
                                            chapterIndex,
                                            "description",
                                            e.target.value,
                                          )
                                        }
                                      />
                                    </Form.Item>

                                    <Form.Item
                                      label={t("addCourse.fieldChapterImages")}
                                    >
                                      <Space
                                        orientation="vertical"
                                        style={{ width: "100%" }}
                                      >
                                        <Upload
                                          accept="image/*"
                                          multiple
                                          showUploadList={false}
                                          beforeUpload={async (file) => {
                                            try {
                                              await handleAddChapterImages(
                                                lessonIndex,
                                                chapterIndex,
                                                [file],
                                              );
                                              message.success(
                                                t("addCourse.imageImported"),
                                              );
                                            } catch (err) {
                                              message.error(
                                                t(
                                                  "addCourse.imageImportFailed",
                                                ),
                                              );
                                              console.error(err);
                                            }
                                            return false;
                                          }}
                                        >
                                          <Button icon={<UploadOutlined />}>
                                            {t("addCourse.addImages")}
                                          </Button>
                                        </Upload>

                                        {(() => {
                                          const chapterImages =
                                            (chapter.images as
                                              | string[]
                                              | undefined) ??
                                            (chapter.image
                                              ? [chapter.image as string]
                                              : []);

                                          return chapterImages.length > 0 ? (
                                            <Space wrap>
                                              {chapterImages.map(
                                                (img, imgIndex) => (
                                                  <div
                                                    key={`${lesson.id}-${chapterIndex}-${imgIndex}`}
                                                    style={{
                                                      position: "relative",
                                                      width: 140,
                                                      height: 100,
                                                      borderRadius: 8,
                                                      overflow: "hidden",
                                                      boxShadow:
                                                        "0 1px 4px rgba(0,0,0,0.15)",
                                                    }}
                                                  >
                                                    <img
                                                      src={img}
                                                      alt={t(
                                                        "addCourse.previewAlt",
                                                      )}
                                                      style={{
                                                        width: "100%",
                                                        height: "100%",
                                                        objectFit: "cover",
                                                      }}
                                                    />
                                                    <Button
                                                      size="small"
                                                      type="primary"
                                                      danger
                                                      icon={<DeleteOutlined />}
                                                      onClick={() =>
                                                        handleRemoveChapterImage(
                                                          lessonIndex,
                                                          chapterIndex,
                                                          imgIndex,
                                                        )
                                                      }
                                                      style={{
                                                        position: "absolute",
                                                        top: 8,
                                                        right: 8,
                                                        padding: "0 6px",
                                                      }}
                                                    />
                                                  </div>
                                                ),
                                              )}
                                            </Space>
                                          ) : (
                                            <Text type="secondary">
                                              {t("addCourse.noChapterImages")}
                                            </Text>
                                          );
                                        })()}
                                      </Space>
                                    </Form.Item>
                                    <Space
                                      style={{ width: "100%" }}
                                      align="center"
                                    >
                                      <Form.Item
                                        label={t("addCourse.position")}
                                        style={{ margin: 0 }}
                                      >
                                        <InputNumber
                                          min={1}
                                          value={
                                            chapter.position || chapterIndex + 1
                                          }
                                          onChange={(value) =>
                                            handleChapterChange(
                                              lessonIndex,
                                              chapterIndex,
                                              "position",
                                              value,
                                            )
                                          }
                                          style={{ width: 100 }}
                                        />
                                      </Form.Item>

                                      <Form.Item
                                        label={t("addCourse.statusLabel")}
                                        style={{ margin: 0 }}
                                        extra={
                                          <Text type="secondary">
                                            {chapter.status
                                              ? t("addCourse.statusHintOn")
                                              : t("addCourse.statusHintOff")}
                                          </Text>
                                        }
                                      >
                                        <Switch
                                          checked={chapter.status || false}
                                          checkedChildren={t(
                                            "addCourse.statusOn",
                                          )}
                                          unCheckedChildren={t(
                                            "addCourse.statusOff",
                                          )}
                                          onChange={(value) =>
                                            handleChapterChange(
                                              lessonIndex,
                                              chapterIndex,
                                              "status",
                                              value,
                                            )
                                          }
                                        />
                                      </Form.Item>
                                    </Space>

                                    <Button
                                      danger
                                      type="dashed"
                                      block
                                      icon={<DeleteOutlined />}
                                      onClick={() =>
                                        handleDeleteChapter(
                                          lessonIndex,
                                          chapterIndex,
                                        )
                                      }
                                    >
                                      {t("addCourse.deleteChapter")}
                                    </Button>
                                  </Space>
                                ),
                              }),
                            )}
                          />
                        )}

                        <Button
                          danger
                          type="dashed"
                          icon={<DeleteOutlined />}
                          onClick={() => handleDeleteLesson(lessonIndex)}
                          block
                        >
                          {t("addCourse.deleteLesson")}
                        </Button>
                      </Space>
                    ),
                  }))}
                />
              )}
            </div>

            <Divider />

            <Space style={{ width: "100%" }}>
              <Button
                type="primary"
                htmlType="submit"
                size="large"
                loading={isCreating}
                style={{ minWidth: 150 }}
              >
                {isEditMode
                  ? t("addCourse.submitEdit")
                  : t("addCourse.submitCreate")}
              </Button>
              <Button size="large">
                <NavLink to="/courses">{t("addCourse.cancel")}</NavLink>
              </Button>
            </Space>
          </Form>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AddCourse;
