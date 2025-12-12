import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../core/context/AuthContext";
import { Input, Button, Typography, Form, Card, Space } from "antd";

export default function Register() {
  const { register } = useContext(AuthContext);
  const nav = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr(null);
    setLoading(true);
    try {
      const res = await register({ email, password, name });
      const user = res.user ?? res;
      if (!user?.isAdmin) {
        // depending on backend you may need to promote account
      }
      nav("/dashboard");
    } catch (error: any) {
      setErr(error?.message || "Erreur inscription");
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
            Créer un compte admin
          </Typography.Title>
          <Form layout="vertical" onFinish={onSubmit}>
            <Form.Item label="Nom" required>
              <Input
                placeholder="Nom"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </Form.Item>
            <Form.Item label="Email" required>
              <Input
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </Form.Item>
            <Form.Item label="Mot de passe" required>
              <Input.Password
                placeholder="Mot de passe"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit" block disabled={loading}>
                {loading ? "Création..." : "Créer"}
              </Button>
            </Form.Item>
          </Form>
          {err && <div style={{ color: "red", marginTop: 8 }}>{err}</div>}
          <div style={{ textAlign: "center" }}>
            Déjà un compte ? <a href="/login">Connectez-vous</a>
          </div>
        </Space>
      </Card>
    </div>
  );
}
