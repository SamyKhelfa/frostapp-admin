import { EyeInvisibleOutlined, EyeTwoTone } from "@ant-design/icons";
import { Button, Card, Form, Input, Space, Typography } from "antd";
import { useContext, useState } from "react";
import { AuthContext } from "../../core/context/AuthContext";

const { Title, Text } = Typography;

export default function Login() {
  const [form] = Form.useForm();

  const { handleLogin } = useContext(AuthContext);

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

      // nav("/dashboard");
    } catch (error: any) {
      setErr(error?.message || "Erreur de connexion");
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
      }}
    >
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
            Admin Login
          </Title>

          <Form form={form} onFinish={onSubmit} layout="vertical">
            <Form.Item
              label="Email"
              name="email"
              rules={[
                { required: true, message: "L'email est obligatoire" },
                { type: "email", message: "L'email est invalide" },
              ]}
            >
              <Input placeholder="your-name@gmail.com" size="large" />
            </Form.Item>

            <Form.Item
              label="Password"
              name="password"
              rules={[
                { required: true, message: "Veuillez saisir le mot de passe" },
              ]}
            >
              <Input.Password
                placeholder="***********"
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
              {loading ? "Connexion..." : "Se connecter"}
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
