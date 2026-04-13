"use server";

import { createClient } from "@/lib/supabase/server";

export async function editarPerfil(datos: { nombre: string; especialidad: string }) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { error: "No autorizado" };

  const { error } = await supabase
    .from("profesionales")
    .update({
      nombre: datos.nombre.trim(),
      especialidad: datos.especialidad.trim(),
    })
    .eq("email", user.email!);

  if (error) return { error: error.message };

  return { success: true };
}
