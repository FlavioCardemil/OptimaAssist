"use server";

import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

async function verificarAdmin() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  const { data } = await supabase
    .from("usuarios")
    .select("rol")
    .eq("id", user.id)
    .single();
  return data?.rol === "super_admin" ? user : null;
}

export async function crearMedico(datos: {
  nombre: string;
  especialidad: string;
  email: string;
  password: string;
}) {
  const admin = await verificarAdmin();
  if (!admin) return { error: "No autorizado" };

  const adminClient = createAdminClient();

  const { data: authData, error: authError } = await adminClient.auth.admin.createUser({
    email: datos.email,
    password: datos.password,
    email_confirm: true,
  });

  if (authError || !authData.user) {
    return { error: authError?.message ?? "Error al crear usuario en Auth" };
  }

  const userId = authData.user.id;

  const { error: usuarioError } = await adminClient.from("usuarios").insert({
    id: userId,
    rol: "medico",
    nombre: datos.nombre,
    email: datos.email,
  });

  if (usuarioError) {
    await adminClient.auth.admin.deleteUser(userId);
    return { error: usuarioError.message };
  }

  const { error: profError } = await adminClient.from("profesionales").insert({
    nombre: datos.nombre,
    especialidad: datos.especialidad,
    email: datos.email,
  });

  if (profError) {
    await adminClient.auth.admin.deleteUser(userId);
    return { error: profError.message };
  }

  revalidatePath("/admin");
  return { success: true };
}

export async function crearAsistenta(datos: {
  nombre: string;
  email: string;
  password: string;
}) {
  const admin = await verificarAdmin();
  if (!admin) return { error: "No autorizado" };

  const adminClient = createAdminClient();

  const { data: authData, error: authError } = await adminClient.auth.admin.createUser({
    email: datos.email,
    password: datos.password,
    email_confirm: true,
  });

  if (authError || !authData.user) {
    return { error: authError?.message ?? "Error al crear usuario en Auth" };
  }

  const userId = authData.user.id;

  const { error: usuarioError } = await adminClient.from("usuarios").insert({
    id: userId,
    rol: "asistenta",
    nombre: datos.nombre,
    email: datos.email,
  });

  if (usuarioError) {
    await adminClient.auth.admin.deleteUser(userId);
    return { error: usuarioError.message };
  }

  revalidatePath("/admin");
  return { success: true };
}

export async function actualizarCredencialesMedico(datos: {
  usuarioId: string;
  profesionalId: string;
  email?: string;
  password?: string;
}) {
  const admin = await verificarAdmin();
  if (!admin) return { error: "No autorizado" };

  const adminClient = createAdminClient();

  const authUpdate: { email?: string; password?: string } = {};
  if (datos.email) authUpdate.email = datos.email;
  if (datos.password) authUpdate.password = datos.password;

  // Verificar que el usuario a editar sea médico (nunca super_admin)
  const { data: usuarioTarget } = await adminClient
    .from("usuarios")
    .select("rol")
    .eq("id", datos.usuarioId)
    .single();
  if (!usuarioTarget || usuarioTarget.rol !== "medico") {
    return { error: "Solo se pueden editar credenciales de médicos" };
  }

  if (Object.keys(authUpdate).length > 0) {
    const { error: authError } = await adminClient.auth.admin.updateUserById(
      datos.usuarioId,
      authUpdate
    );
    if (authError) return { error: authError.message };
  }

  if (datos.email) {
    const { error: usuarioError } = await adminClient
      .from("usuarios")
      .update({ email: datos.email })
      .eq("id", datos.usuarioId);
    if (usuarioError) return { error: usuarioError.message };

    const { error: profError } = await adminClient
      .from("profesionales")
      .update({ email: datos.email })
      .eq("id", datos.profesionalId);
    if (profError) return { error: profError.message };
  }

  revalidatePath("/admin/medicos");
  return { success: true };
}

export async function asignarMedico(asistenteId: string, medicoId: string) {
  const admin = await verificarAdmin();
  if (!admin) return { error: "No autorizado" };

  const adminClient = createAdminClient();
  const { error } = await adminClient.from("asistenta_medico").insert({
    asistenta_id: asistenteId,
    medico_id: medicoId,
  });

  if (error) return { error: error.message };
  revalidatePath("/admin");
  return { success: true };
}

export async function desasignarMedico(asistenteId: string, medicoId: string) {
  const admin = await verificarAdmin();
  if (!admin) return { error: "No autorizado" };

  const adminClient = createAdminClient();
  const { error } = await adminClient
    .from("asistenta_medico")
    .delete()
    .eq("asistenta_id", asistenteId)
    .eq("medico_id", medicoId);

  if (error) return { error: error.message };
  revalidatePath("/admin");
  return { success: true };
}
