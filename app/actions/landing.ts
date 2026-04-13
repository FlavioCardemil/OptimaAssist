"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { CONTENIDO_DEFAULTS } from "@/lib/landing-defaults";

// ── Leer contenido ───────────────────────────────────────────────────────────

export async function obtenerContenidoLanding(): Promise<Record<string, string>> {
  try {
    const supabase = await createClient();
    const { data } = await supabase.from("contenido_landing").select("clave, valor");
    const overrides: Record<string, string> = {};
    if (data) data.forEach(row => { overrides[row.clave] = row.valor; });
    return { ...CONTENIDO_DEFAULTS, ...overrides };
  } catch {
    return { ...CONTENIDO_DEFAULTS };
  }
}

// ── Guardar campo individual ─────────────────────────────────────────────────

export async function guardarCampoLanding(clave: string, valor: string) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("contenido_landing")
    .upsert({ clave, valor, updated_at: new Date().toISOString() }, { onConflict: "clave" });
  if (error) return { error: error.message };
  revalidatePath("/landing");
  return { ok: true };
}

// ── Guardar contacto ─────────────────────────────────────────────────────────

export async function guardarContacto(form: {
  nombre: string;
  email: string;
  especialidad: string;
  mensaje: string;
}) {
  const supabase = await createClient();
  const { error } = await supabase.from("contactos").insert(form);
  if (error) return { error: error.message };
  return { ok: true };
}
