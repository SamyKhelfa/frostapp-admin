import { Descriptions, List, Tag, Button, Space, Empty } from "antd";
import { EditOutlined, DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import type { ILesson } from "@core/interfaces";

type Props = {
  lesson: ILesson;
};

export const CourseDetailPreview: React.FC<Props> = ({ lesson }) => {
  const navigate = useNavigate();

  return (
    <div style={{ padding: 8 }}>
      <Descriptions column={1} size="small" style={{ marginBottom: 16 }}>
        <Descriptions.Item label="Description">
          {lesson.description || <em>Aucune description</em>}
        </Descriptions.Item>
      </Descriptions>

      <div style={{ marginBottom: 16 }}>
        <h4 style={{ margin: "0 0 8px" }}>
          Chapitres ({lesson.chapters?.length ?? 0})
        </h4>

        {lesson.chapters?.length ? (
          <List
            size="small"
            bordered
            dataSource={[...lesson.chapters].sort(
              (a, b) => a.position - b.position,
            )}
            renderItem={(chapter) => (
              <List.Item>
                <Space>
                  <Tag>#{chapter.position}</Tag>
                  <span>{chapter.title}</span>
                </Space>
                <Tag color={chapter.status ? "green" : "default"}>
                  {chapter.status ? "Actif" : "Inactif"}
                </Tag>
              </List.Item>
            )}
          />
        ) : (
          <Empty
            description="Aucun chapitre"
            image={Empty.PRESENTED_IMAGE_SIMPLE}
          />
        )}
        <Space>
          <Button
            type="primary"
            icon={<EditOutlined />}
            onClick={() => navigate(`/courses/${lesson.id}`)}
          >
            Éditer
          </Button>
          <Button
            icon={<PlusOutlined />}
            onClick={() => navigate(`/courses/${lesson.id}?addChapter=true`)}
          >
            Ajouter un chapitre
          </Button>
          <Button danger icon={<DeleteOutlined />}>
            Supprimer
          </Button>
        </Space>
      </div>
    </div>
  );
};
