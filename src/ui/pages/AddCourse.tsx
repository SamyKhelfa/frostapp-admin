import React, { useState } from "react";
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
} from "antd";
import { PlusOutlined, DeleteOutlined, BookOutlined } from "@ant-design/icons";
import type { IChapter } from "../../core/interfaces/chapter.interface";
import {
  saveMockCourse,
  type MockLesson,
} from "../../core/services/mockCourses";
import AdminLayout from "../components/AdminLayout/AdminLayout";

export const AddCourse: React.FC = () => {
  const [form] = Form.useForm();
  const [lessons, setLessons] = useState<MockLesson[]>([]);
  const [loading, setLoading] = useState(false);

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
    message.success("Leçon supprimée");
  };

  const handleLessonChange = (
    lessonIndex: number,
    field: keyof Omit<MockLesson, "chapters" | "id">,
    value: any
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
    message.success("Chapitre supprimé");
  };

  const handleChapterChange = (
    lessonIndex: number,
    chapterIndex: number,
    field: keyof IChapter,
    value: any
  ) => {
    const next = [...lessons];
    const chapters = [...(next[lessonIndex].chapters || [])];
    chapters[chapterIndex] = { ...chapters[chapterIndex], [field]: value };
    next[lessonIndex] = { ...next[lessonIndex], chapters };
    setLessons(next);
  };

  const onSubmit = async (values: any) => {
    setLoading(true);
    try {
      const courseData = {
        ...values,
        lessons,
      };

      const saved = saveMockCourse(courseData);
      console.log("Mock course saved:", saved);
      message.success("Cours créé avec succès!");
      form.resetFields();
      setLessons([]);
    } catch (error: any) {
      message.error(error?.message || "Erreur lors de la création du cours");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout>
      <div style={{ maxWidth: 900, margin: "0 auto", padding: "24px" }}>
        <Card
          title={
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <BookOutlined style={{ fontSize: 24 }} />
              <span>Créer un nouveau cours</span>
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
                Informations du cours
              </h3>

              <Form.Item
                label="Titre du cours"
                name="title"
                rules={[
                  {
                    required: true,
                    message: "Le titre du cours est obligatoire",
                  },
                ]}
              >
                <Input
                  placeholder="Ex: Introduction à React"
                  size="large"
                  allowClear
                />
              </Form.Item>

              <Form.Item
                label="Description"
                name="description"
                rules={[
                  {
                    required: true,
                    message: "La description du cours est obligatoire",
                  },
                ]}
              >
                <Input.TextArea
                  placeholder="Entrez la description complète du cours..."
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
                  Leçons ({lessons.length})
                </h3>
                <Button
                  type="primary"
                  icon={<PlusOutlined />}
                  onClick={handleAddLesson}
                >
                  Ajouter une leçon
                </Button>
              </div>

              {lessons.length === 0 ? (
                <Empty
                  description="Aucune leçon ajoutée"
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
                          {lesson.title || `Leçon ${lessonIndex + 1}`}
                        </span>
                        <Tag color="blue">
                          {lesson.chapters.length} chapitres
                        </Tag>
                      </div>
                    ),
                    children: (
                      <Space
                        direction="vertical"
                        style={{ width: "100%" }}
                        size="large"
                      >
                        <Form.Item label="Titre de la leçon" required>
                          <Input
                            placeholder="Titre de la leçon"
                            value={lesson.title}
                            onChange={(e) =>
                              handleLessonChange(
                                lessonIndex,
                                "title",
                                e.target.value
                              )
                            }
                          />
                        </Form.Item>
                        <Form.Item label="Description de la leçon">
                          <Input.TextArea
                            placeholder="Description de la leçon"
                            value={lesson.description}
                            onChange={(e) =>
                              handleLessonChange(
                                lessonIndex,
                                "description",
                                e.target.value
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
                            Chapitres ({lesson.chapters.length})
                          </h4>
                          <Button
                            type="dashed"
                            icon={<PlusOutlined />}
                            onClick={() => handleAddChapter(lessonIndex)}
                          >
                            Ajouter un chapitre
                          </Button>
                        </div>

                        {lesson.chapters.length === 0 ? (
                          <Empty description="Aucun chapitre" />
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
                                        `Chapitre ${chapterIndex + 1}`}
                                      {chapter.status && (
                                        <Tag
                                          color="green"
                                          style={{ marginLeft: 8 }}
                                        >
                                          Actif
                                        </Tag>
                                      )}
                                    </span>
                                  </div>
                                ),
                                children: (
                                  <Space
                                    direction="vertical"
                                    style={{ width: "100%" }}
                                    size="large"
                                  >
                                    <Form.Item
                                      label="Titre du chapitre"
                                      required
                                    >
                                      <Input
                                        placeholder="Entrez le titre du chapitre"
                                        value={chapter.title || ""}
                                        onChange={(e) =>
                                          handleChapterChange(
                                            lessonIndex,
                                            chapterIndex,
                                            "title",
                                            e.target.value
                                          )
                                        }
                                      />
                                    </Form.Item>

                                    <Form.Item label="Description">
                                      <Input
                                        placeholder="Entrez la description du chapitre"
                                        rows={3}
                                        value={chapter.description || ""}
                                        onChange={(e) =>
                                          handleChapterChange(
                                            lessonIndex,
                                            chapterIndex,
                                            "description",
                                            e.target.value
                                          )
                                        }
                                      />
                                    </Form.Item>

                                    <Form.Item label="Image">
                                      <Input
                                        placeholder="URL de l'image"
                                        value={chapter.image || ""}
                                        onChange={(e) =>
                                          handleChapterChange(
                                            lessonIndex,
                                            chapterIndex,
                                            "image",
                                            e.target.value
                                          )
                                        }
                                      />
                                    </Form.Item>

                                    <Space
                                      style={{ width: "100%" }}
                                      align="center"
                                    >
                                      <Form.Item
                                        label="Position"
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
                                              value
                                            )
                                          }
                                          style={{ width: 100 }}
                                        />
                                      </Form.Item>

                                      <Form.Item
                                        label="Statut"
                                        style={{ margin: 0 }}
                                      >
                                        <Switch
                                          checked={chapter.status || false}
                                          onChange={(value) =>
                                            handleChapterChange(
                                              lessonIndex,
                                              chapterIndex,
                                              "status",
                                              value
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
                                          chapterIndex
                                        )
                                      }
                                    >
                                      Supprimer ce chapitre
                                    </Button>
                                  </Space>
                                ),
                              })
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
                          Supprimer cette leçon
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
                loading={loading}
                style={{ minWidth: 150 }}
              >
                Créer le cours
              </Button>
              <Button size="large">Annuler</Button>
            </Space>
          </Form>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AddCourse;
