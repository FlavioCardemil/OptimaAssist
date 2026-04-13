import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import NavHeader from "@/components/NavHeader";
import FunnelConversion from "@/components/FunnelConversion";
import MetricasCards from "@/components/MetricasCards";
import type { PacienteConEstado } from "@/lib/types";

export default async function ReportesPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: profesional } = await supabase
    .from("profesionales")
    .select("id, nombre, especialidad, email")
    .eq("email", user.email!)
    .single();

  if (!profesional) redirect("/");

  const ahora = new Date();
  const inicioEsteMes = new Date(ahora.getFullYear(), ahora.getMonth(), 1).toISOString();
  const inicioMesAnterior = new Date(ahora.getFullYear(), ahora.getMonth() - 1, 1).toISOString();

  const [{ data: pacientesRaw }, { count: nuevosEsteMes }, { count: nuevosMesAnterior }] =
    await Promise.all([
      supabase.rpc("pacientes_con_estado", { prof_id: profesional.id }),
      supabase
        .from("pacientes")
        .select("id", { count: "exact", head: true })
        .eq("profesional_id", profesional.id)
        .gte("created_at", inicioEsteMes),
      supabase
        .from("pacientes")
        .select("id", { count: "exact", head: true })
        .eq("profesional_id", profesional.id)
        .gte("created_at", inicioMesAnterior)
        .lt("created_at", inicioEsteMes),
    ]);

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
  const nuevosEste = nuevosEsteMes ?? 0;
  const nuevosAnterior = nuevosMesAnterior ?? 0;
  const variacion = nuevosEste - nuevosAnterior;

  return (
    <div style={{ minHeight: "100vh" }}>
      <NavHeader
        nombre={profesional.nombre}
        especialidad={profesional.especialidad}
        email={profesional.email}
      />

      <main
        className="om-stagger"
        style={{
          maxWidth: "1000px",
          margin: "0 auto",
          padding: "2rem 1.5rem",
          display: "flex",
          flexDirection: "column",
          gap: "2.5rem",
        }}
      >
        {/* Métricas */}
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
            Resumen
          </h2>
          <MetricasCards
            totalActivos={totalActivos}
            perdidos={perdidos}
            recuperados={recuperados}
            tasaConversion={tasaConversion}
            nuevosEsteMes={nuevosEste}
            variacionMes={variacion}
          />
        </section>

        {/* Funnel */}
        <section>
          <div style={{ marginBottom: "1.25rem" }}>
            <h2 style={{
              fontFamily: "var(--font-lora-var, serif)",
              fontSize: "1.75rem",
              fontWeight: 700,
              color: "#1C1917",
              letterSpacing: "-0.02em",
              lineHeight: 1.1,
            }}>
              Funnel de conversión
            </h2>
            <p style={{
              fontFamily: "var(--font-outfit-var, sans-serif)",
              fontSize: "13px",
              color: "#9B9188",
              marginTop: "6px",
            }}>
              Caída de pacientes entre cada etapa del flujo principal
            </p>
          </div>

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
      </main>
    </div>
  );
}
