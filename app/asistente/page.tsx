import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import NavHeader from "@/components/NavHeader";
import AsistenteClient from "./AsistenteClient";

export default async function AsistentePage() {
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

  const { data: asistente } = await supabase
    .from("asistente")
    .select("nombre, frase_presentacion, avatar_url")
    .eq("profesional_id", profesional.id)
    .single();

  return (
    <div style={{ minHeight: "100vh" }}>
      <NavHeader
        nombre={profesional.nombre}
        especialidad={profesional.especialidad}
        email={profesional.email}
      />

      <main style={{ maxWidth: "1000px", margin: "0 auto", padding: "2rem 1.5rem" }}>
        <div style={{ marginBottom: "1.5rem" }}>
          <h2 style={{ fontFamily: "var(--font-lora-var, serif)", fontSize: "1.75rem", fontWeight: 700, color: "#1C1917", letterSpacing: "-0.02em", lineHeight: 1.1 }}>
            Asistente
          </h2>
          <p style={{ fontFamily: "var(--font-outfit-var, sans-serif)", fontSize: "13px", color: "#9B9188", marginTop: "4px" }}>
            Configura la identidad de tu asistente virtual para WhatsApp
          </p>
        </div>

        <div style={{ background: "#FFFFFF", borderRadius: "14px", border: "1px solid rgba(0,0,0,0.07)", padding: "2rem", boxShadow: "0 1px 2px rgba(0,0,0,0.04), 0 4px 12px rgba(0,0,0,0.04)" }}>
          <AsistenteClient
            profesionalId={profesional.id}
            asistente={asistente ?? null}
          />
        </div>
      </main>
    </div>
  );
}
