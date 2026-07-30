import { useEffect } from "react";
import { Modal, Form, Input, InputNumber, Switch, message } from "antd";
import { useTranslation } from "react-i18next";
import type { IChapter } from "@core/interfaces";
import {
  useCreateChapterMutation,
  useUpdateChapterMutation,
} from "@core/api/chapter.api";

type Values = {
  title: string;
  description: string;
  image: string;
  position: number;
  status: boolean;
};

type Props = {
  open: boolean;
  onClose: () => void;
  /** Cours auquel rattacher le chapitre créé. */
  lessonId: number;
  /** Chapitre à modifier ; absent = création. */
  chapter?: IChapter | null;
  /** Position proposée à la création. */
  nextPosition?: number;
};

/** Création / édition d'un chapitre (Chapter côté API). */
export const ChapterFormModal: React.FC<Props> = ({
  open,
  onClose,
  lessonId,
  chapter,
  nextPosition = 1,
}) => {
  const { t } = useTranslation();
  const [form] = Form.useForm<Values>();
  const [createChapter, { isLoading: isCreating }] = useCreateChapterMutation();
  const [updateChapter, { isLoading: isUpdating }] = useUpdateChapterMutation();
  const isEdit = Boolean(chapter);

  useEffect(() => {
    if (!open) return;
    form.setFieldsValue({
      title: chapter?.title ?? "",
      description: chapter?.description ?? "",
      image: chapter?.image ?? "",
      position: chapter?.position ?? nextPosition,
      status: chapter?.status ?? false,
    });
  }, [open, chapter, nextPosition, form]);

  const onFinish = async (values: Values) => {
    try {
      if (isEdit && chapter) {
        await updateChapter({ id: chapter.id, body: values }).unwrap();
        message.success(t("chapterForm.updated"));
      } else {
        await createChapter({ ...values, lessonId }).unwrap();
        message.success(t("chapterForm.created"));
      }
      onClose();
    } catch (e: unknown) {
      const msg = (e as { data?: { message?: string | string[] } })?.data
        ?.message;
      message.error(
        Array.isArray(msg) ? msg.join(", ") : (msg ?? t("chapterForm.error")),
      );
    }
  };

  return (
    <Modal
      open={open}
      onCancel={onClose}
      onOk={() => form.submit()}
      okText={isEdit ? t("chapterForm.submitEdit") : t("chapterForm.submit")}
      cancelText={t("addCourse.cancel")}
      confirmLoading={isCreating || isUpdating}
      destroyOnHidden
      title={isEdit ? t("chapterForm.titleEdit") : t("chapterForm.titleCreate")}
    >
      <Form form={form} layout="vertical" onFinish={onFinish}>
        <Form.Item
          name="title"
          label={t("addCourse.fieldChapterTitle")}
          rules={[
            { required: true, message: t("addCourse.chapterTitleRequired") },
          ]}
        >
          <Input placeholder={t("addCourse.fieldChapterTitlePlaceholder")} />
        </Form.Item>

        <Form.Item
          name="description"
          label={t("addCourse.fieldChapterDescription")}
        >
          <Input.TextArea
            rows={3}
            placeholder={t("addCourse.fieldChapterDescriptionPlaceholder")}
          />
        </Form.Item>

        <Form.Item name="image" label={t("chapterForm.image")}>
          <Input placeholder={t("chapterForm.imagePlaceholder")} />
        </Form.Item>

        <Form.Item name="position" label={t("addCourse.position")}>
          <InputNumber min={1} style={{ width: 120 }} />
        </Form.Item>

        <Form.Item
          name="status"
          label={t("addCourse.statusChapterLabel")}
          valuePropName="checked"
        >
          <Switch />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default ChapterFormModal;
