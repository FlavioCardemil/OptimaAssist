"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function guardarAsistente(datos: {
  nombre: string;
  frase_presentacion: string;
  avatar_url: string | null;
}) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { error: "No autorizado" };

  const { data: profesional } = await supabase
    .from("profesionales")
    .select("id")
    .eq("email", user.email!)
    .single();

  if (!profesional) return { error: "Profesional no encontrado" };

  const { error } = await supabase.from("asistente").upsert(
    {
      profesional_id: profesional.id,
      nombre: datos.nombre.trim(),
      frase_presentacion: datos.frase_presentacion.trim(),
      avatar_url: datos.avatar_url,
    },
    { onConflict: "profesional_id" }
  );

  if (error) return { error: error.message };

  revalidatePath("/asistente");
  return { success: true };
}
