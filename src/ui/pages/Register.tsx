import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { AuthContext } from "../../core/context/AuthContext";
import { Input, Button, Typography, Form, Card, Space } from "antd";
import { LanguageSwitcher } from "../components/LanguageSwitcher";

export default function Register() {
  const { register } = useContext(AuthContext);
  const nav = useNavigate();
  const { t } = useTranslation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const onFinish = async () => {
    setErr(null);
    setLoading(true);
    try {
      const res = await register({ email, password, name });
      const user = (res as { user?: unknown })?.user ?? res;
      if (user && typeof user === "object" && "isAdmin" in user && !(user as { isAdmin?: boolean }).isAdmin) {
      }
      nav("/");
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : t("register.error");
      setErr(message || t("register.error"));
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
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          margin: "0 auto",
        }}
      >
        <Space direction="vertical" style={{ width: "100%" }} size="large">
          <Typography.Title
            level={3}
            style={{ textAlign: "center", margin: 0 }}
          >
            {t("register.title")}
          </Typography.Title>
          <Form layout="vertical" onFinish={onFinish}>
            <Form.Item label={t("register.name")} required>
              <Input
                placeholder={t("register.placeholderName")}
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </Form.Item>
            <Form.Item label={t("register.email")} required>
              <Input
                placeholder={t("register.placeholderEmail")}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </Form.Item>
            <Form.Item label={t("register.password")} required>
              <Input.Password
                placeholder={t("register.placeholderPassword")}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit" block disabled={loading}>
                {loading ? t("register.submitting") : t("register.submit")}
              </Button>
            </Form.Item>
          </Form>
          {err && <div style={{ color: "red", marginTop: 8 }}>{err}</div>}
          <div style={{ textAlign: "center" }}>
            {t("register.hasAccount")}{" "}
            <a href="/login">{t("register.signIn")}</a>
          </div>
        </Space>
      </Card>
    </div>
  );
}
