import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import GestionPacientes from "@/components/GestionPacientes";
import NavHeader from "@/components/NavHeader";
import type { PacienteConEstado } from "@/lib/types";

export default async function DashboardPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: usuario } = await supabase
    .from("usuarios")
    .select("rol")
    .eq("id", user.id)
    .single();

  if (usuario?.rol === "asistenta") redirect("/asistenta");
  if (usuario?.rol === "super_admin") redirect("/admin");

  const { data: profesional } = await supabase
    .from("profesionales")
    .select("id, nombre, especialidad, email")
    .eq("email", user.email!)
    .single();

  if (!profesional) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ background: "#FFFFFF", borderRadius: "14px", border: "1px solid rgba(0,0,0,0.07)", padding: "2rem 3rem", maxWidth: "400px", textAlign: "center" }}>
          <p style={{ fontFamily: "var(--font-lora-var, serif)", fontWeight: 700, color: "#1C1917", marginBottom: "8px", fontSize: "1.1rem" }}>Cuenta no vinculada</p>
          <p style={{ fontFamily: "var(--font-outfit-var, sans-serif)", fontSize: "13px", color: "#9B9188" }}>Tu cuenta no está vinculada a un profesional. Contacta al administrador.</p>
        </div>
      </div>
    );
  }

  const { data: pacientesRaw } = await supabase.rpc("pacientes_con_estado", {
    prof_id: profesional.id,
  });

  const pacientes = (pacientesRaw ?? []) as PacienteConEstado[];

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
          gap: "1.5rem",
        }}
      >
        <GestionPacientes pacientes={pacientes} />
      </main>
    </div>
  );
}
