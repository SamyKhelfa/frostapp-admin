import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import {
  Form,
  Button,
  Input,
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
  UploadOutlined,
} from "@ant-design/icons";
import type { ILesson } from "@core/interfaces";
import { useCreateLessonFullMutation } from "@core/api/lesson.api";

/**
 * Vocabulaire : ce que l'admin appelle cours / leçon / chapitre correspond
 * respectivement à Lesson / Chapter / SubChapter côté API. Les types locaux
 * sont nommés d'après l'entité créée, les libellés affichés d'après le
 * vocabulaire métier.
 */

/** Un « chapitre » dans l'UI. */
type DraftSubChapter = {
  title: string;
  description: string;
  video: string;
  duration: number;
  status: boolean;
  position: number;
};

/** Une « leçon » dans l'UI. */
type DraftChapter = {
  key: string;
  title: string;
  description: string;
  images: string[];
  status: boolean;
  position: number;
  subChapters: DraftSubChapter[];
};

type Props = {
  /** Renseigné en mode édition (pas encore branché à l'API). */
  courseId?: string;
  /** Appelé après une création réussie, avec le cours créé. */
  onCreated?: (lesson: ILesson) => void;
  /** Rendu du bouton d'annulation, à la main de l'appelant (page ou modale). */
  onCancel?: () => void;
};

export const CourseForm: React.FC<Props> = ({
  courseId,
  onCreated,
  onCancel,
}) => {
  const { Text } = Typography;
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const [chapters, setChapters] = useState<DraftChapter[]>([]);
  const [createLessonFull, { isLoading: isCreating }] =
    useCreateLessonFullMutation();
  const isEditMode = Boolean(courseId);

  useEffect(() => {
    if (courseId) {
      // TODO: brancher useGetLessonByIdQuery pour préremplir en mode édition
      message.info("Le mode édition n'est pas encore branché à l'API");
    }
  }, [courseId]);

  /* ----------------------------- Leçons (Chapter) ---------------------------- */

  const handleAddChapter = () => {
    setChapters([
      ...chapters,
      {
        key: crypto.randomUUID?.() ?? Date.now().toString(),
        title: "",
        description: "",
        images: [],
        status: false,
        position: chapters.length + 1,
        subChapters: [],
      },
    ]);
  };

  const handleDeleteChapter = (chapterIndex: number) => {
    setChapters(chapters.filter((_, i) => i !== chapterIndex));
    message.success(t("addCourse.lessonDeleted"));
  };

  const handleChapterChange = (
    chapterIndex: number,
    field: keyof Omit<DraftChapter, "key" | "subChapters">,
    value: unknown,
  ) => {
    const next = [...chapters];
    next[chapterIndex] = { ...next[chapterIndex], [field]: value };
    setChapters(next);
  };

  const handleAddChapterImages = async (chapterIndex: number) => {
    // TODO: uploader le fichier (module Cloudinary côté back) et pousser l'URL
    // renvoyée. En attendant, l'image reste vide et n'est pas persistée.
    const uploaded = [""];

    const next = [...chapters];
    next[chapterIndex] = {
      ...next[chapterIndex],
      images: [...next[chapterIndex].images, ...uploaded],
    };
    setChapters(next);
  };

  const handleRemoveChapterImage = (
    chapterIndex: number,
    imageIndex: number,
  ) => {
    const next = [...chapters];
    next[chapterIndex] = {
      ...next[chapterIndex],
      images: next[chapterIndex].images.filter((_, i) => i !== imageIndex),
    };
    setChapters(next);
    message.success(t("addCourse.imageRemoved"));
  };

  /* -------------------------- Chapitres (SubChapter) ------------------------- */

  const handleAddSubChapter = (chapterIndex: number) => {
    const next = [...chapters];
    const subChapters = next[chapterIndex].subChapters;
    next[chapterIndex] = {
      ...next[chapterIndex],
      subChapters: [
        ...subChapters,
        {
          title: "",
          description: "",
          video: "",
          duration: 0,
          status: false,
          position: subChapters.length + 1,
        },
      ],
    };
    setChapters(next);
  };

  const handleDeleteSubChapter = (
    chapterIndex: number,
    subChapterIndex: number,
  ) => {
    const next = [...chapters];
    next[chapterIndex] = {
      ...next[chapterIndex],
      subChapters: next[chapterIndex].subChapters.filter(
        (_, i) => i !== subChapterIndex,
      ),
    };
    setChapters(next);
    message.success(t("addCourse.chapterDeleted"));
  };

  const handleSubChapterChange = (
    chapterIndex: number,
    subChapterIndex: number,
    field: keyof DraftSubChapter,
    value: unknown,
  ) => {
    const next = [...chapters];
    const subChapters = [...next[chapterIndex].subChapters];
    subChapters[subChapterIndex] = {
      ...subChapters[subChapterIndex],
      [field]: value,
    };
    next[chapterIndex] = { ...next[chapterIndex], subChapters };
    setChapters(next);
  };

  /* ---------------------------------- Submit --------------------------------- */

  const onSubmit = async (values: { title: string; description: string }) => {
    try {
      if (isEditMode && courseId) {
        message.warning("Édition pas encore branchée à l'API");
        return;
      }

      if (chapters.some((chapter) => !chapter.title.trim())) {
        message.error(t("addCourse.lessonTitleRequired"));
        return;
      }

      if (
        chapters.some((chapter) =>
          chapter.subChapters.some((subChapter) => !subChapter.title.trim()),
        )
      ) {
        message.error(t("addCourse.chapterTitleRequired"));
        return;
      }

      // Une seule requête : le back crée le cours, ses leçons et ses chapitres
      // dans la même transaction.
      const created = await createLessonFull({
        title: values.title,
        description: values.description,
        chapters: chapters.map((chapter, chapterIndex) => ({
          title: chapter.title.trim(),
          description: chapter.description,
          image: chapter.images[0] ?? "",
          status: chapter.status,
          position: chapter.position || chapterIndex + 1,
          subChapters: chapter.subChapters.map(
            (subChapter, subChapterIndex) => ({
              title: subChapter.title.trim(),
              description: subChapter.description,
              video: subChapter.video,
              duration: subChapter.duration || 0,
              status: subChapter.status,
              position: subChapter.position || subChapterIndex + 1,
            }),
          ),
        })),
      }).unwrap();

      const subChapterCount = chapters.reduce(
        (total, chapter) => total + chapter.subChapters.length,
        0,
      );

      message.success(
        t("addCourse.createdWithContent", {
          lessons: chapters.length,
          chapters: subChapterCount,
        }),
      );
      form.resetFields();
      setChapters([]);
      onCreated?.(created);
    } catch (e: unknown) {
      const msg =
        (e as { data?: { message?: string } })?.data?.message ??
        t("addCourse.createError");
      message.error(Array.isArray(msg) ? msg.join(", ") : msg);
    }
  };

  return (
    <Form form={form} layout="vertical" onFinish={onSubmit} autoComplete="off">
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
            {t("addCourse.lessonsHeading", { count: chapters.length })}
          </h3>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={handleAddChapter}
          >
            {t("addCourse.addLesson")}
          </Button>
        </div>

        {chapters.length === 0 ? (
          <Empty
            description={t("addCourse.noLessons")}
            style={{ padding: "40px 0" }}
          />
        ) : (
          <Collapse
            accordion
            items={chapters.map((chapter, chapterIndex) => ({
              key: chapter.key,
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
                      t("addCourse.lessonFallback", {
                        number: chapterIndex + 1,
                      })}
                  </span>
                  <Space>
                    <Tag color={chapter.status ? "green" : "red"}>
                      {chapter.status
                        ? t("addCourse.statusOn")
                        : t("addCourse.statusOff")}
                    </Tag>
                    <Tag color="blue">
                      {t("addCourse.chaptersCount", {
                        count: chapter.subChapters.length,
                      })}
                    </Tag>
                  </Space>
                </div>
              ),
              children: (
                <Space
                  orientation="vertical"
                  style={{ width: "100%" }}
                  size="large"
                >
                  <Form.Item label={t("addCourse.fieldLessonTitle")} required>
                    <Input
                      placeholder={t("addCourse.fieldLessonTitlePlaceholder")}
                      value={chapter.title}
                      onChange={(e) =>
                        handleChapterChange(
                          chapterIndex,
                          "title",
                          e.target.value,
                        )
                      }
                    />
                  </Form.Item>

                  <Form.Item label={t("addCourse.fieldLessonDescription")}>
                    <Input.TextArea
                      placeholder={t(
                        "addCourse.fieldLessonDescriptionPlaceholder",
                      )}
                      rows={3}
                      value={chapter.description}
                      onChange={(e) =>
                        handleChapterChange(
                          chapterIndex,
                          "description",
                          e.target.value,
                        )
                      }
                    />
                  </Form.Item>

                  <Form.Item label={t("addCourse.fieldLessonImages")}>
                    <Space orientation="vertical" style={{ width: "100%" }}>
                      <Upload
                        accept="image/*"
                        multiple
                        showUploadList={false}
                        beforeUpload={async () => {
                          try {
                            await handleAddChapterImages(chapterIndex);
                            message.success(t("addCourse.imageImported"));
                          } catch (err) {
                            message.error(t("addCourse.imageImportFailed"));
                            console.error(err);
                          }
                          return false;
                        }}
                      >
                        <Button icon={<UploadOutlined />}>
                          {t("addCourse.addImages")}
                        </Button>
                      </Upload>

                      {chapter.images.length > 0 ? (
                        <Space wrap>
                          {chapter.images.map((img, imgIndex) => (
                            <div
                              key={`${chapter.key}-img-${imgIndex}`}
                              style={{
                                position: "relative",
                                width: 140,
                                height: 100,
                                borderRadius: 8,
                                overflow: "hidden",
                                boxShadow: "0 1px 4px rgba(0,0,0,0.15)",
                              }}
                            >
                              <img
                                src={img}
                                alt={t("addCourse.previewAlt")}
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
                          ))}
                        </Space>
                      ) : (
                        <Text type="secondary">
                          {t("addCourse.noLessonImages")}
                        </Text>
                      )}
                    </Space>
                  </Form.Item>

                  <Space style={{ width: "100%" }} align="center">
                    <Form.Item
                      label={t("addCourse.position")}
                      style={{ margin: 0 }}
                    >
                      <InputNumber
                        min={1}
                        value={chapter.position || chapterIndex + 1}
                        onChange={(value) =>
                          handleChapterChange(chapterIndex, "position", value)
                        }
                        style={{ width: 100 }}
                      />
                    </Form.Item>

                    <Form.Item
                      label={t("addCourse.statusLessonLabel")}
                      style={{ margin: 0 }}
                    >
                      <Switch
                        checked={chapter.status}
                        onChange={(value) =>
                          handleChapterChange(chapterIndex, "status", value)
                        }
                      />
                    </Form.Item>
                  </Space>

                  <Divider style={{ margin: 0 }} />

                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <h4 style={{ margin: 0 }}>
                      {t("addCourse.chaptersHeading", {
                        count: chapter.subChapters.length,
                      })}
                    </h4>
                    <Button
                      type="dashed"
                      icon={<PlusOutlined />}
                      onClick={() => handleAddSubChapter(chapterIndex)}
                    >
                      {t("addCourse.addChapter")}
                    </Button>
                  </div>

                  {chapter.subChapters.length === 0 ? (
                    <Empty description={t("addCourse.noChapters")} />
                  ) : (
                    <Collapse
                      items={chapter.subChapters.map(
                        (subChapter, subChapterIndex) => ({
                          key: `${chapter.key}-${subChapterIndex}`,
                          label: (
                            <div
                              style={{
                                display: "flex",
                                justifyContent: "space-between",
                                width: "100%",
                              }}
                            >
                              <span>
                                {subChapter.title ||
                                  t("addCourse.chapterFallback", {
                                    number: subChapterIndex + 1,
                                  })}
                              </span>
                              <Tag color={subChapter.status ? "green" : "red"}>
                                {subChapter.status
                                  ? t("addCourse.statusOn")
                                  : t("addCourse.statusOff")}
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
                                label={t("addCourse.fieldChapterTitle")}
                                required
                              >
                                <Input
                                  placeholder={t(
                                    "addCourse.fieldChapterTitlePlaceholder",
                                  )}
                                  value={subChapter.title}
                                  onChange={(e) =>
                                    handleSubChapterChange(
                                      chapterIndex,
                                      subChapterIndex,
                                      "title",
                                      e.target.value,
                                    )
                                  }
                                />
                              </Form.Item>

                              <Form.Item
                                label={t("addCourse.fieldChapterDescription")}
                              >
                                <Input.TextArea
                                  placeholder={t(
                                    "addCourse.fieldChapterDescriptionPlaceholder",
                                  )}
                                  rows={3}
                                  value={subChapter.description}
                                  onChange={(e) =>
                                    handleSubChapterChange(
                                      chapterIndex,
                                      subChapterIndex,
                                      "description",
                                      e.target.value,
                                    )
                                  }
                                />
                              </Form.Item>

                              <Form.Item
                                label={t("addCourse.fieldChapterVideo")}
                              >
                                <Input
                                  placeholder={t(
                                    "addCourse.fieldChapterVideoPlaceholder",
                                  )}
                                  value={subChapter.video}
                                  onChange={(e) =>
                                    handleSubChapterChange(
                                      chapterIndex,
                                      subChapterIndex,
                                      "video",
                                      e.target.value,
                                    )
                                  }
                                />
                              </Form.Item>

                              <Space style={{ width: "100%" }} align="center">
                                <Form.Item
                                  label={t("addCourse.fieldChapterDuration")}
                                  style={{ margin: 0 }}
                                >
                                  <InputNumber
                                    min={0}
                                    value={subChapter.duration}
                                    onChange={(value) =>
                                      handleSubChapterChange(
                                        chapterIndex,
                                        subChapterIndex,
                                        "duration",
                                        value ?? 0,
                                      )
                                    }
                                    style={{ width: 120 }}
                                  />
                                </Form.Item>

                                <Form.Item
                                  label={t("addCourse.position")}
                                  style={{ margin: 0 }}
                                >
                                  <InputNumber
                                    min={1}
                                    value={
                                      subChapter.position || subChapterIndex + 1
                                    }
                                    onChange={(value) =>
                                      handleSubChapterChange(
                                        chapterIndex,
                                        subChapterIndex,
                                        "position",
                                        value,
                                      )
                                    }
                                    style={{ width: 100 }}
                                  />
                                </Form.Item>

                                <Form.Item
                                  label={t("addCourse.statusChapterLabel")}
                                  style={{ margin: 0 }}
                                >
                                  <Switch
                                    checked={subChapter.status}
                                    onChange={(value) =>
                                      handleSubChapterChange(
                                        chapterIndex,
                                        subChapterIndex,
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
                                  handleDeleteSubChapter(
                                    chapterIndex,
                                    subChapterIndex,
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
                    onClick={() => handleDeleteChapter(chapterIndex)}
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

      <Space style={{ width: "100%", justifyContent: "flex-end" }}>
        {onCancel && (
          <Button size="large" onClick={onCancel} disabled={isCreating}>
            {t("addCourse.cancel")}
          </Button>
        )}
        <Button
          type="primary"
          htmlType="submit"
          size="large"
          loading={isCreating}
          style={{ minWidth: 150 }}
        >
          {isEditMode ? t("addCourse.submitEdit") : t("addCourse.submitCreate")}
        </Button>
      </Space>
    </Form>
  );
};

export default CourseForm;
