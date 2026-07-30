import { useTranslation } from "react-i18next";
import { Card } from "antd";
import { BookOutlined } from "@ant-design/icons";
import { useNavigate, useParams } from "react-router-dom";
import AdminLayout from "../components/AdminLayout/AdminLayout";
import { CourseForm } from "../components/courses/CourseForm";

/**
 * La création passe désormais par la modale de la liste des cours
 * (CourseFormModal) ; cette page ne sert plus qu'à l'édition.
 */
export const AddCourse: React.FC = () => {
  const { t } = useTranslation();
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();

  return (
    <AdminLayout>
      <div style={{ maxWidth: 900, margin: "0 auto", padding: "24px" }}>
        <Card
          title={
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <BookOutlined style={{ fontSize: 24 }} />
              <span>
                {courseId
                  ? t("addCourse.titleEdit")
                  : t("addCourse.titleCreate")}
              </span>
            </div>
          }
          style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.1)" }}
        >
          <CourseForm
            courseId={courseId}
            onCancel={() => navigate("/courses")}
            onCreated={(lesson) => navigate(`/courses/${lesson.id}`)}
          />
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AddCourse;
