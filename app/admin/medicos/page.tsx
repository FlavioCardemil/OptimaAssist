import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import ModalCrearMedico from "@/components/admin/ModalCrearMedico";

export default async function AdminMedicosPage() {
  const supabase = await createClient();

  const { data: profesionales } = await supabase
    .from("profesionales")
    .select("id, nombre, especialidad, email")
    .order("nombre", { ascending: true });

  const profs = profesionales ?? [];

  const { data: pacientesCount } = await supabase
    .from("pacientes")
    .select("profesional_id");

  const countPacientes: Record<string, number> = {};
  for (const p of pacientesCount ?? []) {
    countPacientes[p.profesional_id] = (countPacientes[p.profesional_id] ?? 0) + 1;
  }

  const { data: asignaciones } = await supabase
    .from("asistenta_medico")
    .select("medico_id");

  const countAsistentes: Record<string, number> = {};
  for (const a of asignaciones ?? []) {
    countAsistentes[a.medico_id] = (countAsistentes[a.medico_id] ?? 0) + 1;
  }

  return (
    <main style={{ maxWidth: "1000px", margin: "0 auto", padding: "2rem 1.5rem" }}>
      <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: "1.5rem" }}>
        <div>
          <h2 style={{ fontFamily: "var(--font-lora-var, serif)", fontSize: "1.75rem", fontWeight: 700, color: "#1C1917", letterSpacing: "-0.02em", lineHeight: 1.1 }}>
            Médicos
          </h2>
          <p style={{ fontFamily: "var(--font-outfit-var, sans-serif)", fontSize: "13px", color: "#9B9188", marginTop: "4px" }}>
            {profs.length} médico{profs.length !== 1 ? "s" : ""} registrado{profs.length !== 1 ? "s" : ""}
          </p>
        </div>
        <ModalCrearMedico />
      </div>

      {profs.length === 0 ? (
        <div className="om-empty" style={{ background: "#FFFFFF", borderRadius: "14px", border: "1px solid rgba(0,0,0,0.06)" }}>
          <p style={{ fontWeight: 600, color: "#78716C" }}>Sin médicos</p>
          <p style={{ marginTop: "4px", fontSize: "13px" }}>No hay médicos registrados aún.</p>
        </div>
      ) : (
        <div className="om-table-wrap">
          <table className="om-table">
            <thead>
              <tr>
                <th>Médico</th>
                <th>Especialidad</th>
                <th style={{ textAlign: "right" }}>Pacientes</th>
                <th style={{ textAlign: "right" }}>Asistentas</th>
                <th style={{ width: "44px" }} />
              </tr>
            </thead>
            <tbody>
              {profs.map((p) => (
                <tr key={p.id} className="group">
                  <td>
                    <Link href={`/admin/medicos/${p.id}`} style={{ textDecoration: "none", display: "block" }}>
                      <p style={{ fontWeight: 600, color: "#1C1917", fontSize: "14px" }}>{p.nombre}</p>
                      <p style={{ fontSize: "12px", color: "#9B9188", marginTop: "1px" }}>{p.email}</p>
                    </Link>
                  </td>
                  <td style={{ fontSize: "13px", color: "#78716C" }}>{p.especialidad}</td>
                  <td style={{ textAlign: "right", fontWeight: 600, color: "#1C1917" }}>{countPacientes[p.id] ?? 0}</td>
                  <td style={{ textAlign: "right", fontWeight: 600, color: "#1C1917" }}>{countAsistentes[p.id] ?? 0}</td>
                  <td>
                    <div style={{ display: "flex", justifyContent: "center" }}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#D6D3D1" strokeWidth="2.5" strokeLinecap="round"
                        className="group-hover:!stroke-[#0B6E72]" style={{ transition: "stroke 0.12s ease" }}>
                        <polyline points="9 18 15 12 9 6" />
                      </svg>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </main>
  );
}
