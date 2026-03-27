import { EyeInvisibleOutlined, EyeTwoTone } from "@ant-design/icons";
import { Button, Card, Form, Input, Space, Typography } from "antd";
import { useContext, useState } from "react";
import { useTranslation } from "react-i18next";
import { AuthContext } from "../../core/context/AuthContext";
import { LanguageSwitcher } from "../components/LanguageSwitcher";

const { Title, Text } = Typography;

export default function Login() {
  const [form] = Form.useForm();
  const { handleLogin } = useContext(AuthContext);
  const { t } = useTranslation();

  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const onSubmit = async () => {
    setErr(null);
    setLoading(true);

    try {
      const formData = await form.validateFields();

      await handleLogin({
        email: formData.email,
        password: formData.password,
      });
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : t("login.connectionError");
      setErr(message || t("login.connectionError"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        width: "100%",
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#f5f5f5",
        position: "relative",
      }}
    >
      <div style={{ position: "absolute", top: 24, right: 24 }}>
        <LanguageSwitcher />
      </div>
      <Card
        style={{
          width: 420,
          padding: "2rem 2.2rem",
          borderRadius: 12,
          boxShadow: "0 8px 20px rgba(0,0,0,0.06)",
        }}
      >
        <Space direction="vertical" style={{ width: "100%" }} size="large">
          <Title level={3} style={{ textAlign: "center", margin: 0 }}>
            {t("login.title")}
          </Title>

          <Form form={form} onFinish={onSubmit} layout="vertical">
            <Form.Item
              label={t("login.email")}
              name="email"
              rules={[
                { required: true, message: t("login.emailRequired") },
                { type: "email", message: t("login.emailInvalid") },
              ]}
            >
              <Input placeholder={t("login.placeholderEmail")} size="large" />
            </Form.Item>

            <Form.Item
              label={t("login.password")}
              name="password"
              rules={[
                { required: true, message: t("login.passwordRequired") },
              ]}
            >
              <Input.Password
                placeholder={t("login.passwordMask")}
                size="large"
                iconRender={(visible) =>
                  visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
                }
              />
            </Form.Item>

            <Button
              type="primary"
              htmlType="submit"
              block
              size="large"
              disabled={loading}
              style={{ marginTop: 8 }}
            >
              {loading ? t("login.submitting") : t("login.submit")}
            </Button>
          </Form>

          {err && (
            <Card
              size="small"
              style={{
                background: "#ff6a6dff",
                display: "flex",
                justifyContent: "center",
              }}
            >
              <Text style={{ color: "white" }}>{err}</Text>
            </Card>
          )}
        </Space>
      </Card>
    </div>
  );
}
