import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import NavHeaderAsistenta from "@/components/NavHeaderAsistenta";
import GestionAsistenta from "@/components/GestionAsistenta";
import type { PacienteConEstado } from "@/lib/types";

interface Props {
  searchParams: Promise<{ medico?: string }>;
}

export default async function AsistentaPage({ searchParams }: Props) {
  const { medico: medicoFiltro } = await searchParams;
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: usuario } = await supabase
    .from("usuarios")
    .select("rol, nombre, email")
    .eq("id", user.id)
    .single();

  if (usuario?.rol !== "asistenta") redirect("/");

  const { data: asignacionesRaw } = await supabase
    .from("asistenta_medico")
    .select("medico_id, profesionales(nombre)")
    .eq("asistenta_id", user.id);

  const medicos = (asignacionesRaw ?? []).map((a) => ({
    medico_id: a.medico_id as string,
    nombre: (a.profesionales as unknown as { nombre: string } | null)?.nombre ?? "Médico",
  }));

  if (medicos.length === 0) {
    return (
      <div style={{ minHeight: "100vh" }}>
        <NavHeaderAsistenta nombre={usuario.nombre} email={usuario.email} />
        <main style={{ maxWidth: "1000px", margin: "0 auto", padding: "4rem 1.5rem", textAlign: "center" }}>
          <p style={{ fontFamily: "var(--font-outfit-var, sans-serif)", color: "#9B9188", fontSize: "15px" }}>No tienes médicos asignados aún.</p>
          <p style={{ fontFamily: "var(--font-outfit-var, sans-serif)", color: "#B0A89F", fontSize: "13px", marginTop: "4px" }}>Contacta al administrador para que te asigne médicos.</p>
        </main>
      </div>
    );
  }

  const profIds = medicoFiltro ? [medicoFiltro] : medicos.map((m) => m.medico_id);

  const { data: pacientesRaw } = await supabase.rpc("pacientes_con_estado_multi", {
    prof_ids: profIds,
  });

  const pacientes = (pacientesRaw ?? []) as PacienteConEstado[];

  return (
    <div style={{ minHeight: "100vh" }}>
      <NavHeaderAsistenta nombre={usuario.nombre} email={usuario.email} />
      <main
        className="om-stagger"
        style={{ maxWidth: "1000px", margin: "0 auto", padding: "2rem 1.5rem", display: "flex", flexDirection: "column", gap: "1.5rem" }}
      >
        <GestionAsistenta
          pacientes={pacientes}
          medicos={medicos}
          medicoFiltro={medicoFiltro ?? null}
        />
      </main>
    </div>
  );
}
