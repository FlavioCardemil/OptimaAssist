"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import type { EstadoPaciente } from "@/lib/types";
import { validarRut } from "@/lib/rut";

// Gets the profesional_id for a given patient.
// Works for both médicos (patient belongs to them) and asistentas
// (patient belongs to one of their assigned médicos).
// RLS already guarantees the caller has access to this patient.
async function getProfesionalIdDePaciente(
  supabase: Awaited<ReturnType<typeof createClient>>,
  pacienteId: string
): Promise<string | null> {
  const { data } = await supabase
    .from("pacientes")
    .select("profesional_id")
    .eq("id", pacienteId)
    .single();
  return data?.profesional_id ?? null;
}

export async function actualizarEstadoPaciente(
  sesionId: string | null,
  pacienteId: string,
  nuevoEstado: EstadoPaciente
) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "No autorizado" };

  if (sesionId) {
    // UPDATE: RLS handles access control
    const { error } = await supabase
      .from("sesiones")
      .update({ estado: nuevoEstado })
      .eq("id", sesionId);
    if (error) return { error: error.message };
  } else {
    const profesionalId = await getProfesionalIdDePaciente(supabase, pacienteId);
    if (!profesionalId) return { error: "Paciente no encontrado" };

    const { error } = await supabase.from("sesiones").insert({
      paciente_id: pacienteId,
      profesional_id: profesionalId,
      estado: nuevoEstado,
      fecha: new Date().toISOString(),
    });
    if (error) return { error: error.message };
  }

  revalidatePath("/");
  revalidatePath("/pacientes", "layout");
  return { success: true };
}

interface DatosPaciente {
  nombre: string;
  apellido: string;
  rut: string;
  telefono: string;
  email: string;
  estado: EstadoPaciente;
  profesionalId?: string; // required when called from asistenta view
}

export async function crearPaciente(datos: DatosPaciente) {
  if (!validarRut(datos.rut)) return { error: "RUT inválido" };

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "No autorizado" };

  let profesionalId = datos.profesionalId ?? null;

  if (!profesionalId) {
    // Médico flow: look up by email
    const { data: prof } = await supabase
      .from("profesionales")
      .select("id")
      .eq("email", user.email!)
      .single();
    if (!prof) return { error: "Profesional no encontrado" };
    profesionalId = prof.id;
  }

  const { data: paciente, error: errPaciente } = await supabase
    .from("pacientes")
    .insert({
      nombre: datos.nombre.trim(),
      apellido: datos.apellido.trim(),
      rut: datos.rut.trim(),
      telefono: datos.telefono.trim() || null,
      email: datos.email.trim() || null,
      profesional_id: profesionalId,
    })
    .select("id")
    .single();

  if (errPaciente) {
    if (errPaciente.code === "23505") return { error: "Ya existe un paciente con ese RUT" };
    return { error: errPaciente.message };
  }

  const { error: errSesion } = await supabase.from("sesiones").insert({
    paciente_id: paciente.id,
    profesional_id: profesionalId,
    estado: datos.estado,
    fecha: new Date().toISOString(),
  });

  if (errSesion) return { error: errSesion.message };

  revalidatePath("/");
  revalidatePath("/asistenta");
  return { success: true };
}

export async function editarPaciente(
  pacienteId: string,
  estadoAnterior: EstadoPaciente,
  datos: DatosPaciente
) {
  if (!validarRut(datos.rut)) return { error: "RUT inválido" };

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "No autorizado" };

  const { error: errPaciente } = await supabase
    .from("pacientes")
    .update({
      nombre: datos.nombre.trim(),
      apellido: datos.apellido.trim(),
      rut: datos.rut.trim(),
      telefono: datos.telefono.trim() || null,
      email: datos.email.trim() || null,
    })
    .eq("id", pacienteId);

  if (errPaciente) {
    if (errPaciente.code === "23505") return { error: "Ya existe un paciente con ese RUT" };
    return { error: errPaciente.message };
  }

  if (datos.estado !== estadoAnterior) {
    const profesionalId = await getProfesionalIdDePaciente(supabase, pacienteId);
    if (!profesionalId) return { error: "Paciente no encontrado" };

    const { error: errSesion } = await supabase.from("sesiones").insert({
      paciente_id: pacienteId,
      profesional_id: profesionalId,
      estado: datos.estado,
      fecha: new Date().toISOString(),
    });
    if (errSesion) return { error: errSesion.message };
  }

  revalidatePath("/");
  revalidatePath("/asistenta");
  revalidatePath("/pacientes", "layout");
  return { success: true };
}
