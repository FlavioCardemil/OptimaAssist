import { createClient } from "@/lib/supabase/server";

export default async function ContactosPage() {
  const supabase = await createClient();
  const { data: contactos } = await supabase
    .from("contactos")
    .select("*")
    .order("created_at", { ascending: false });

  function formatFecha(iso: string) {
    return new Date(iso).toLocaleDateString("es-CL", {
      day: "2-digit", month: "2-digit", year: "numeric",
      hour: "2-digit", minute: "2-digit",
    });
  }

  return (
    <main style={{ maxWidth: "1040px", margin: "0 auto", padding: "32px 24px" }}>
      <div className="om-stagger">
        <div style={{ marginBottom: "28px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <h1 style={{ fontFamily: "var(--font-lora-var, serif)", fontSize: "1.5rem", fontWeight: 700, color: "#1C1917" }}>
              Contactos
            </h1>
            <p style={{ fontFamily: "var(--font-outfit-var, sans-serif)", fontSize: "14px", color: "#78716C", marginTop: "6px" }}>
              Formularios enviados desde la landing page.
            </p>
          </div>
          <div style={{
            background: "#FFFFFF", border: "1px solid rgba(0,0,0,0.07)", borderRadius: "10px",
            padding: "10px 18px", textAlign: "center",
          }}>
            <div style={{ fontFamily: "var(--font-lora-var, serif)", fontSize: "1.5rem", fontWeight: 700, color: "#0B6E72", lineHeight: 1 }}>
              {contactos?.length ?? 0}
            </div>
            <div style={{ fontFamily: "var(--font-outfit-var, sans-serif)", fontSize: "11px", color: "#9B9188", marginTop: "3px" }}>
              total
            </div>
          </div>
        </div>

        {!contactos || contactos.length === 0 ? (
          <div className="om-card" style={{ padding: "48px", textAlign: "center" }}>
            <p style={{ fontFamily: "var(--font-outfit-var, sans-serif)", fontSize: "14px", color: "#9B9188" }}>
              Aún no hay contactos registrados.
            </p>
          </div>
        ) : (
          <div className="om-table-wrap">
            <table className="om-table">
              <thead>
                <tr>
                  <th>Nombre</th>
                  <th>Email</th>
                  <th>Especialidad</th>
                  <th>Mensaje</th>
                  <th>Fecha</th>
                </tr>
              </thead>
              <tbody>
                {contactos.map(c => (
                  <tr key={c.id}>
                    <td>
                      <span style={{ fontWeight: 600, color: "#1C1917", fontSize: "14px" }}>{c.nombre}</span>
                    </td>
                    <td>
                      <a
                        href={`mailto:${c.email}`}
                        style={{ fontFamily: "var(--font-outfit-var, sans-serif)", fontSize: "13px", color: "#0B6E72", textDecoration: "none" }}
                      >
                        {c.email}
                      </a>
                    </td>
                    <td>
                      <span style={{ fontFamily: "var(--font-outfit-var, sans-serif)", fontSize: "13px", color: "#78716C" }}>
                        {c.especialidad || "—"}
                      </span>
                    </td>
                    <td style={{ maxWidth: "320px" }}>
                      <p style={{
                        fontFamily: "var(--font-outfit-var, sans-serif)", fontSize: "13px",
                        color: "#44403C", lineHeight: 1.5,
                        overflow: "hidden", display: "-webkit-box",
                        WebkitLineClamp: 2, WebkitBoxOrient: "vertical",
                      }}>
                        {c.mensaje || "—"}
                      </p>
                    </td>
                    <td style={{ whiteSpace: "nowrap" }}>
                      <span style={{ fontFamily: "var(--font-outfit-var, sans-serif)", fontSize: "12.5px", color: "#9B9188" }}>
                        {formatFecha(c.created_at)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </main>
  );
}
