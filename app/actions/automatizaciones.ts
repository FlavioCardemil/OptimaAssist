"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import type { TipoAutomatizacion, EstadoAutomatizacion } from "@/lib/types";

export async function crearAutomatizacion(
  pacienteId: string,
  tipo: TipoAutomatizacion,
  configuracion: Record<string, unknown>
) {
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

  const { error } = await supabase.from("automatizaciones").insert({
    paciente_id: pacienteId,
    profesional_id: paciente.profesional_id,
    tipo,
    configuracion,
    estado: "pendiente",
  });

  if (error) return { error: error.message };

  revalidatePath("/pacientes", "layout");
  return { success: true };
}

export async function eliminarAutomatizacion(id: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "No autorizado" };

  // RLS handles access control; no need for extra profesional_id filter
  const { error } = await supabase
    .from("automatizaciones")
    .delete()
    .eq("id", id);

  if (error) return { error: error.message };

  revalidatePath("/pacientes", "layout");
  return { success: true };
}

export async function actualizarEstadoAutomatizacion(
  id: string,
  estado: EstadoAutomatizacion
) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "No autorizado" };

  const { error } = await supabase
    .from("automatizaciones")
    .update({ estado })
    .eq("id", id);

  if (error) return { error: error.message };

  revalidatePath("/pacientes", "layout");
  return { success: true };
}
