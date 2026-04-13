import { createClient } from "@/lib/supabase/server";
import MetricasCards from "@/components/MetricasCards";
import FunnelConversion from "@/components/FunnelConversion";
import type { PacienteConEstado } from "@/lib/types";

export default async function AdminReportesPage() {
  const supabase = await createClient();

  const ahora = new Date();
  const inicioEsteMes = new Date(ahora.getFullYear(), ahora.getMonth(), 1).toISOString();
  const inicioMesAnterior = new Date(ahora.getFullYear(), ahora.getMonth() - 1, 1).toISOString();

  const { data: profesionales } = await supabase
    .from("profesionales")
    .select("id, nombre")
    .order("nombre");

  const profs = profesionales ?? [];

  const profIds = profs.map((p) => p.id);
  const { data: pacientesRaw } = profIds.length
    ? await supabase.rpc("pacientes_con_estado_multi", { prof_ids: profIds })
    : { data: [] };

  const pacientes = (pacientesRaw ?? []) as PacienteConEstado[];

  const conteos: Record<string, number> = {};
  for (const p of pacientes) {
    conteos[p.estado_actual] = (conteos[p.estado_actual] ?? 0) + 1;
  }

  const total = pacientes.length;
  const perdidos = conteos["abandono"] ?? 0;
  const recuperados = conteos["recuperado"] ?? 0;
  const totalActivos = total - perdidos;
  const completos = conteos["completo"] ?? 0;
  const tasaConversion = total === 0 ? 0 : Math.round((completos / total) * 100);

  const [{ count: nuevosEste }, { count: nuevosAnterior }] = await Promise.all([
    supabase.from("pacientes").select("id", { count: "exact", head: true }).gte("created_at", inicioEsteMes),
    supabase.from("pacientes").select("id", { count: "exact", head: true }).gte("created_at", inicioMesAnterior).lt("created_at", inicioEsteMes),
  ]);

  const variacion = (nuevosEste ?? 0) - (nuevosAnterior ?? 0);

  const statsPorMedico = profs.map((prof) => {
    const pacs = pacientes.filter((p) => p.profesional_id === prof.id);
    const conteosMedico: Record<string, number> = {};
    for (const p of pacs) {
      conteosMedico[p.estado_actual] = (conteosMedico[p.estado_actual] ?? 0) + 1;
    }
    const comp = conteosMedico["completo"] ?? 0;
    return {
      id: prof.id,
      nombre: prof.nombre,
      total: pacs.length,
      completos: comp,
      tasaConversion: pacs.length === 0 ? 0 : Math.round((comp / pacs.length) * 100),
    };
  });

  const { data: nuevosRaw } = await supabase
    .from("pacientes")
    .select("profesional_id")
    .gte("created_at", inicioEsteMes);

  const nuevosPorMedico: Record<string, number> = {};
  for (const p of nuevosRaw ?? []) {
    nuevosPorMedico[p.profesional_id] = (nuevosPorMedico[p.profesional_id] ?? 0) + 1;
  }

  return (
    <main
      className="om-stagger"
      style={{ maxWidth: "1000px", margin: "0 auto", padding: "2rem 1.5rem", display: "flex", flexDirection: "column", gap: "2.5rem" }}
    >
      <section>
        <h2 style={{
          fontFamily: "var(--font-lora-var, serif)",
          fontSize: "1.75rem",
          fontWeight: 700,
          color: "#1C1917",
          letterSpacing: "-0.02em",
          lineHeight: 1.1,
          marginBottom: "1rem",
        }}>
          Resumen global
        </h2>
        <MetricasCards
          totalActivos={totalActivos}
          perdidos={perdidos}
          recuperados={recuperados}
          tasaConversion={tasaConversion}
          nuevosEsteMes={nuevosEste ?? 0}
          variacionMes={variacion}
        />
      </section>

      <section>
        <h2 style={{
          fontFamily: "var(--font-lora-var, serif)",
          fontSize: "1.75rem",
          fontWeight: 700,
          color: "#1C1917",
          letterSpacing: "-0.02em",
          lineHeight: 1.1,
        }}>
          Funnel global
        </h2>
        <p style={{ fontFamily: "var(--font-outfit-var, sans-serif)", fontSize: "13px", color: "#9B9188", marginTop: "6px", marginBottom: "1.25rem" }}>
          Todos los pacientes de todos los médicos
        </p>
        <div style={{
          background: "#FFFFFF",
          borderRadius: "14px",
          border: "1px solid rgba(0,0,0,0.07)",
          padding: "1.5rem 2rem",
          boxShadow: "0 1px 2px rgba(0,0,0,0.04), 0 4px 12px rgba(0,0,0,0.04)",
        }}>
          <FunnelConversion conteos={conteos} />
        </div>
      </section>

      <section>
        <h2 style={{
          fontFamily: "var(--font-lora-var, serif)",
          fontSize: "1.75rem",
          fontWeight: 700,
          color: "#1C1917",
          letterSpacing: "-0.02em",
          lineHeight: 1.1,
          marginBottom: "1rem",
        }}>
          Resumen por médico
        </h2>
        {statsPorMedico.length === 0 ? (
          <div className="om-empty" style={{ background: "#FFFFFF", borderRadius: "14px", border: "1px solid rgba(0,0,0,0.06)" }}>
            <p style={{ fontWeight: 600, color: "#78716C" }}>Sin médicos</p>
            <p style={{ marginTop: "4px", fontSize: "13px" }}>No hay médicos registrados.</p>
          </div>
        ) : (
          <div className="om-table-wrap">
            <table className="om-table">
              <thead>
                <tr>
                  <th>Médico</th>
                  <th style={{ textAlign: "right" }}>Total pacientes</th>
                  <th style={{ textAlign: "right" }}>Nuevos este mes</th>
                  <th style={{ textAlign: "right" }}>Tasa conv.</th>
                </tr>
              </thead>
              <tbody>
                {statsPorMedico.map((s) => (
                  <tr key={s.id}>
                    <td style={{ fontWeight: 600, color: "#1C1917" }}>{s.nombre}</td>
                    <td style={{ textAlign: "right" }}>{s.total}</td>
                    <td style={{ textAlign: "right" }}>{nuevosPorMedico[s.id] ?? 0}</td>
                    <td style={{ textAlign: "right", fontWeight: 700, color: s.tasaConversion >= 50 ? "#047857" : "#44403C" }}>
                      {s.tasaConversion}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </main>
  );
}
