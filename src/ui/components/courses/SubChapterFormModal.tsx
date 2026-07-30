import { useEffect } from "react";
import { Modal, Form, Input, InputNumber, Switch, message } from "antd";
import { useTranslation } from "react-i18next";
import type { ISubchapter } from "@core/interfaces";
import {
  useCreateSubChapterMutation,
  useUpdateSubChapterMutation,
} from "@core/api/subchapter.api";

type Values = {
  title: string;
  description: string;
  video: string;
  duration: number;
  position: number;
  status: boolean;
};

type Props = {
  open: boolean;
  onClose: () => void;
  /** Chapitre auquel rattacher le sous-chapitre créé. */
  chapterId: number;
  /** Sous-chapitre à modifier ; absent = création. */
  subChapter?: ISubchapter | null;
  /** Position proposée à la création. */
  nextPosition?: number;
};

/** Création / édition d'un sous-chapitre (SubChapter côté API). */
export const SubChapterFormModal: React.FC<Props> = ({
  open,
  onClose,
  chapterId,
  subChapter,
  nextPosition = 1,
}) => {
  const { t } = useTranslation();
  const [form] = Form.useForm<Values>();
  const [createSubChapter, { isLoading: isCreating }] =
    useCreateSubChapterMutation();
  const [updateSubChapter, { isLoading: isUpdating }] =
    useUpdateSubChapterMutation();
  const isEdit = Boolean(subChapter);

  useEffect(() => {
    if (!open) return;
    form.setFieldsValue({
      title: subChapter?.title ?? "",
      description: subChapter?.description ?? "",
      video: subChapter?.video ?? "",
      duration: subChapter?.duration ?? 0,
      position: subChapter?.position ?? nextPosition,
      status: subChapter?.status ?? false,
    });
  }, [open, subChapter, nextPosition, form]);

  const onFinish = async (values: Values) => {
    try {
      if (isEdit && subChapter) {
        await updateSubChapter({ id: subChapter.id, body: values }).unwrap();
        message.success(t("subChapterForm.updated"));
      } else {
        // `active` n'est pas exposé dans l'admin : les sous-chapitres sont
        // créés actifs, la publication se pilote avec `status`.
        await createSubChapter({ ...values, active: true, chapterId }).unwrap();
        message.success(t("subChapterForm.created"));
      }
      onClose();
    } catch (e: unknown) {
      const msg = (e as { data?: { message?: string | string[] } })?.data
        ?.message;
      message.error(
        Array.isArray(msg)
          ? msg.join(", ")
          : (msg ?? t("subChapterForm.error")),
      );
    }
  };

  return (
    <Modal
      open={open}
      onCancel={onClose}
      onOk={() => form.submit()}
      okText={
        isEdit ? t("subChapterForm.submitEdit") : t("subChapterForm.submit")
      }
      cancelText={t("addCourse.cancel")}
      confirmLoading={isCreating || isUpdating}
      destroyOnHidden
      title={
        isEdit ? t("subChapterForm.titleEdit") : t("subChapterForm.titleCreate")
      }
    >
      <Form form={form} layout="vertical" onFinish={onFinish}>
        <Form.Item
          name="title"
          label={t("addCourse.fieldSubChapterTitle")}
          rules={[
            { required: true, message: t("addCourse.subChapterTitleRequired") },
          ]}
        >
          <Input placeholder={t("addCourse.fieldSubChapterTitlePlaceholder")} />
        </Form.Item>

        <Form.Item
          name="description"
          label={t("addCourse.fieldSubChapterDescription")}
        >
          <Input.TextArea
            rows={3}
            placeholder={t("addCourse.fieldSubChapterDescriptionPlaceholder")}
          />
        </Form.Item>

        <Form.Item name="video" label={t("addCourse.fieldSubChapterVideo")}>
          <Input placeholder={t("addCourse.fieldSubChapterVideoPlaceholder")} />
        </Form.Item>

        <Form.Item
          name="duration"
          label={t("addCourse.fieldSubChapterDuration")}
        >
          <InputNumber min={0} style={{ width: 120 }} />
        </Form.Item>

        <Form.Item name="position" label={t("addCourse.position")}>
          <InputNumber min={1} style={{ width: 120 }} />
        </Form.Item>

        <Form.Item
          name="status"
          label={t("addCourse.statusSubChapterLabel")}
          valuePropName="checked"
        >
          <Switch />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default SubChapterFormModal;
