import { createClient } from "@/lib/supabase/server";
import ModalCrearAsistenta from "@/components/admin/ModalCrearAsistenta";
import AsistentaRow from "@/components/admin/AsistentaRow";

export default async function AdminAsistentasPage() {
  const supabase = await createClient();

  const { data: asistentas } = await supabase
    .from("usuarios")
    .select("id, nombre, email")
    .eq("rol", "asistenta")
    .order("nombre");

  const { data: todosLosMedicos } = await supabase
    .from("profesionales")
    .select("id, nombre")
    .order("nombre");

  const { data: asignaciones } = await supabase
    .from("asistenta_medico")
    .select("asistenta_id, medico_id");

  const lista = asistentas ?? [];
  const medicos = todosLosMedicos ?? [];

  const asignacionesPorAsistenta: Record<string, string[]> = {};
  for (const a of asignaciones ?? []) {
    if (!asignacionesPorAsistenta[a.asistenta_id]) {
      asignacionesPorAsistenta[a.asistenta_id] = [];
    }
    asignacionesPorAsistenta[a.asistenta_id].push(a.medico_id);
  }

  return (
    <main style={{ maxWidth: "1000px", margin: "0 auto", padding: "2rem 1.5rem" }}>
      <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: "1.5rem" }}>
        <div>
          <h2 style={{ fontFamily: "var(--font-lora-var, serif)", fontSize: "1.75rem", fontWeight: 700, color: "#1C1917", letterSpacing: "-0.02em", lineHeight: 1.1 }}>
            Asistentas
          </h2>
          <p style={{ fontFamily: "var(--font-outfit-var, sans-serif)", fontSize: "13px", color: "#9B9188", marginTop: "4px" }}>
            {lista.length} asistenta{lista.length !== 1 ? "s" : ""} registrada{lista.length !== 1 ? "s" : ""}
          </p>
        </div>
        <ModalCrearAsistenta />
      </div>

      {lista.length === 0 ? (
        <div className="om-empty" style={{ background: "#FFFFFF", borderRadius: "14px", border: "1px solid rgba(0,0,0,0.06)" }}>
          <p style={{ fontWeight: 600, color: "#78716C" }}>Sin asistentas</p>
          <p style={{ marginTop: "4px", fontSize: "13px" }}>No hay asistentas registradas aún.</p>
        </div>
      ) : (
        <div className="om-table-wrap">
          <table className="om-table">
            <thead>
              <tr>
                <th>Asistenta</th>
                <th>Médicos asignados</th>
                <th style={{ width: "44px" }} />
              </tr>
            </thead>
            <tbody>
              {lista.map((a) => (
                <AsistentaRow
                  key={a.id}
                  asistenta={a}
                  medicos={medicos}
                  medicosAsignados={asignacionesPorAsistenta[a.id] ?? []}
                />
              ))}
            </tbody>
          </table>
        </div>
      )}
    </main>
  );
}
