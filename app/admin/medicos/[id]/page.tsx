import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { notFound } from "next/navigation";
import Link from "next/link";
import type { PacienteConEstado } from "@/lib/types";
import TablaPacientesAdmin from "./TablaPacientesAdmin";
import ModalEditarCredenciales from "@/components/admin/ModalEditarCredenciales";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function AdminMedicoDetallePage({ params }: Props) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: profesional } = await supabase
    .from("profesionales")
    .select("id, nombre, especialidad, email")
    .eq("id", id)
    .single();

  if (!profesional) notFound();

  const adminClient = createAdminClient();
  const { data: usuarioData } = await adminClient
    .from("usuarios")
    .select("id")
    .eq("email", profesional.email)
    .eq("rol", "medico")
    .single();

  const { data: pacientesRaw } = await supabase.rpc("pacientes_con_estado", {
    prof_id: profesional.id,
  });

  const pacientes = (pacientesRaw ?? []) as PacienteConEstado[];

  return (
    <main style={{ maxWidth: "1000px", margin: "0 auto", padding: "2rem 1.5rem" }}>
      <div style={{ marginBottom: "1.5rem" }}>
        <Link href="/admin/medicos" style={{ display: "inline-flex", alignItems: "center", gap: "5px", fontSize: "12px", color: "#9B9188", textDecoration: "none", marginBottom: "12px", transition: "color 0.1s" }}
          onMouseEnter={undefined}
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <polyline points="15 18 9 12 15 6"/>
          </svg>
          Volver a médicos
        </Link>
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "1rem" }}>
          <div>
            <h2 style={{ fontFamily: "var(--font-lora-var, serif)", fontSize: "1.75rem", fontWeight: 700, color: "#1C1917", letterSpacing: "-0.02em", lineHeight: 1.1 }}>
              {profesional.nombre}
            </h2>
            <p style={{ fontFamily: "var(--font-outfit-var, sans-serif)", fontSize: "13px", color: "#9B9188", marginTop: "4px" }}>
              {profesional.especialidad} · {profesional.email}
            </p>
          </div>
          {usuarioData && (
            <ModalEditarCredenciales
              usuarioId={usuarioData.id}
              profesionalId={profesional.id}
              emailActual={profesional.email}
            />
          )}
        </div>
      </div>

      <p style={{ fontFamily: "var(--font-outfit-var, sans-serif)", fontSize: "13px", color: "#9B9188", marginBottom: "16px" }}>
        {pacientes.length} {pacientes.length === 1 ? "paciente" : "pacientes"} · solo lectura
      </p>

      <TablaPacientesAdmin pacientes={pacientes} backUrl={`/admin/medicos/${profesional.id}`} />
    </main>
  );
}
