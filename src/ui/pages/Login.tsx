import React, { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function Login() {
  const { login } = useContext(AuthContext);
  const nav = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr(null);
    setLoading(true);
    try {
      const res = await login(email, password);
      const user = res.user ?? res;
      if (!user?.isAdmin) throw new Error("Accès admin requis");
      nav("/dashboard");
    } catch (error: any) {
      setErr(error?.message || "Erreur de connexion");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 420, margin: "4rem auto" }}>
      <h2>Admin Login</h2>
      <form onSubmit={onSubmit}>
        <div>
          <input
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div style={{ marginTop: 8 }}>
          <input
            placeholder="Mot de passe"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div style={{ marginTop: 12 }}>
          <button type="submit" disabled={loading}>
            {loading ? "Connexion..." : "Se connecter"}
          </button>
        </div>
      </form>
      {err && <div style={{ color: "red", marginTop: 8 }}>{err}</div>}
      <div style={{ marginTop: 12 }}>
        <Link to="/register">Créer un compte admin</Link>
      </div>
    </div>
  );
}
