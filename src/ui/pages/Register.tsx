import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

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
    <div style={{ maxWidth: 420, margin: "4rem auto" }}>
      <h2>Créer un compte admin</h2>
      <form onSubmit={onSubmit}>
        <div>
          <input
            placeholder="Nom"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div style={{ marginTop: 8 }}>
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
            {loading ? "Création..." : "Créer"}
          </button>
        </div>
      </form>
      {err && <div style={{ color: "red", marginTop: 8 }}>{err}</div>}
    </div>
  );
}
