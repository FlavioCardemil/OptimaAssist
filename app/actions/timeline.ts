"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function crearNota(pacienteId: string, texto: string) {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "No autorizado" };

  // Get profesional_id from patient — works for both médico and asistenta
  const { data: paciente } = await supabase
    .from("pacientes")
    .select("profesional_id")
    .eq("id", pacienteId)
    .single();
  if (!paciente) return { error: "Paciente no encontrado" };

  const { error } = await supabase.from("sesiones").insert({
    paciente_id: pacienteId,
    profesional_id: paciente.profesional_id,
    estado: "nota",
    nota: texto.trim(),
    fecha: new Date().toISOString(),
  });

  if (error) return { error: error.message };

  revalidatePath("/pacientes", "layout");
  return { success: true };
}
