import { createClient } from "@/lib/supabase/server";
import { redirect, notFound } from "next/navigation";
import NavHeader from "@/components/NavHeader";
import NavHeaderAsistenta from "@/components/NavHeaderAsistenta";
import DetallePacienteClient from "./DetallePacienteClient";
import type { EstadoPaciente, PacienteConEstado, Automatizacion } from "@/lib/types";

interface Props {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ back?: string }>;
}

export default async function DetallePacientePage({ params, searchParams }: Props) {
  const { id } = await params;
  const { back } = await searchParams;
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: usuario } = await supabase
    .from("usuarios")
    .select("rol, nombre, email")
    .eq("id", user.id)
    .single();

  const rol = usuario?.rol ?? "medico";

  // ── Fetch patient + profesional based on role ─────────────────────────────

  let pacienteRaw: {
    id: string; rut: string; nombre: string; apellido: string;
    telefono: string | null; email: string | null; profesional_id: string;
  } | null = null;

  let profesional: {
    id: string; nombre: string; especialidad: string; email: string;
  } | null = null;

  if (rol === "medico") {
    const { data: prof } = await supabase
      .from("profesionales")
      .select("id, nombre, especialidad, email")
      .eq("email", user.email!)
      .single();

    if (!prof) redirect("/");
    profesional = prof;

    const { data: p } = await supabase
      .from("pacientes")
      .select("id, rut, nombre, apellido, telefono, email, profesional_id")
      .eq("id", id)
      .eq("profesional_id", prof.id)
      .single();

    if (!p) notFound();
    pacienteRaw = p;
  } else {
    // asistenta y super_admin: fetch without ownership check
    const { data: p } = await supabase
      .from("pacientes")
      .select("id, rut, nombre, apellido, telefono, email, profesional_id")
      .eq("id", id)
      .single();

    if (!p) notFound();
    pacienteRaw = p;

    // Get the patient's médico for display in the left panel
    const { data: prof } = await supabase
      .from("profesionales")
      .select("id, nombre, especialidad, email")
      .eq("id", p.profesional_id)
      .single();
    profesional = prof;
  }

  // ── Sesiones ──────────────────────────────────────────────────────────────

  const { data: sesionesRaw } = await supabase
    .from("sesiones")
    .select("id, estado, fecha, nota")
    .eq("paciente_id", id)
    .order("fecha", { ascending: false });

  const sesiones = (sesionesRaw ?? []) as {
    id: string; estado: string; fecha: string; nota: string | null;
  }[];

  const ultimaSesionEstado = sesiones.find((s) => s.estado !== "nota") ?? null;

  const paciente: PacienteConEstado = {
    ...pacienteRaw!,
    estado_actual: (ultimaSesionEstado?.estado ?? "contactando") as EstadoPaciente,
    fecha_ultima_sesion: ultimaSesionEstado?.fecha ?? null,
    sesion_id: ultimaSesionEstado?.id ?? null,
  };

  // ── Automatizaciones ──────────────────────────────────────────────────────

  const { data: automatizacionesRaw } = await supabase
    .from("automatizaciones")
    .select("*")
    .eq("paciente_id", id)
    .order("created_at", { ascending: false });

  const automatizaciones = (automatizacionesRaw ?? []) as Automatizacion[];

  return (
    <div style={{ minHeight: "100vh" }}>
      {rol === "medico" ? (
        <NavHeader
          nombre={profesional!.nombre}
          especialidad={profesional!.especialidad}
          email={profesional!.email}
        />
      ) : (
        <NavHeaderAsistenta
          nombre={usuario!.nombre}
          email={usuario!.email}
          label={rol === "super_admin" ? "Admin" : "Asistenta"}
        />
      )}
      <main style={{ maxWidth: "1000px", margin: "0 auto", padding: "2rem 1.5rem" }}>
        <DetallePacienteClient
          paciente={paciente}
          sesiones={sesiones}
          automatizaciones={automatizaciones}
          backUrl={back ?? (rol === "asistenta" ? "/asistenta" : "/")}
        />
      </main>
    </div>
  );
}
