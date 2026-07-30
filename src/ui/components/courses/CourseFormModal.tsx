import { Modal } from "antd";
import { useTranslation } from "react-i18next";
import { BookOutlined } from "@ant-design/icons";
import type { ILesson } from "@core/interfaces";
import { CourseForm } from "./CourseForm";

type Props = {
  open: boolean;
  onClose: () => void;
  onCreated?: (lesson: ILesson) => void;
};

export const CourseFormModal: React.FC<Props> = ({
  open,
  onClose,
  onCreated,
}) => {
  const { t } = useTranslation();

  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={null}
      width={900}
      // Le formulaire garde son état (leçons, chapitres) dans du state local :
      // on le démonte à la fermeture pour repartir vide à la réouverture.
      destroyOnHidden
      maskClosable={false}
      title={
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <BookOutlined style={{ fontSize: 20 }} />
          <span>{t("addCourse.titleCreate")}</span>
        </div>
      }
      styles={{ body: { maxHeight: "70vh", overflowY: "auto" } }}
    >
      <CourseForm
        onCancel={onClose}
        onCreated={(lesson) => {
          onCreated?.(lesson);
          onClose();
        }}
      />
    </Modal>
  );
};

export default CourseFormModal;
