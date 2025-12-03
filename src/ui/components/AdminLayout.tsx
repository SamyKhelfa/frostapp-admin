import React, { ReactNode } from "react";
import { Link } from "react-router-dom";

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      <aside style={{ width: 220, padding: 16, borderRight: "1px solid #eee" }}>
        <h3>Backoffice</h3>
        <nav>
          <ul style={{ listStyle: "none", padding: 0 }}>
            <li>
              <Link to="/dashboard">Accueil</Link>
            </li>
            {/* ajouter liens: chapters, lessons, users... */}
          </ul>
        </nav>
      </aside>
      <main style={{ flex: 1, padding: 20 }}>{children}</main>
    </div>
  );
}
