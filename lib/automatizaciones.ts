import type { TipoAutomatizacion, UnidadTiempo } from "./types";

export const ESPECIALIDADES = [
  "Nutricionista",
  "Psiquiatra",
  "Oncólogo",
  "Cardiólogo",
  "Kinesiólogo",
  "Neurólogo",
  "Endocrinólogo",
  "Otro",
];

export function calcularFecha(cantidad: number, unidad: UnidadTiempo): Date {
  const d = new Date();
  if (unidad === "dias") d.setDate(d.getDate() + cantidad);
  if (unidad === "semanas") d.setDate(d.getDate() + cantidad * 7);
  if (unidad === "meses") d.setMonth(d.getMonth() + cantidad);
  return d;
}

export function toISODate(d: Date): string {
  return d.toISOString().slice(0, 10);
}

export function formatFechaES(iso: string): string {
  // Parse as local date to avoid UTC offset shifting the day
  const [y, m, day] = iso.slice(0, 10).split("-");
  return `${day}/${m}/${y}`;
}

const UNIDAD_LABEL: Record<UnidadTiempo, [string, string]> = {
  dias: ["día", "días"],
  semanas: ["semana", "semanas"],
  meses: ["mes", "meses"],
};

export function describir(
  tipo: TipoAutomatizacion,
  config: Record<string, unknown>
): string {
  switch (tipo) {
    case "volver_en": {
      const cant = config.cantidad as number;
      const unidad = config.unidad as UnidadTiempo;
      const [sing, plur] = UNIDAD_LABEL[unidad] ?? [unidad, unidad];
      const label = cant === 1 ? sing : plur;
      const fecha = config.fecha_calculada
        ? ` — ${formatFechaES(config.fecha_calculada as string)}`
        : "";
      return `Volver en ${cant} ${label}${fecha}`;
    }
    case "volver_fecha": {
      const fecha = config.fecha
        ? formatFechaES(config.fecha as string)
        : "—";
      return `Volver el ${fecha}`;
    }
    case "tomar_examen": {
      const lista = (config.examenes as string[]).filter(Boolean).join(", ");
      return `Tomar examen: ${lista || "—"}`;
    }
    case "visitar_especialista": {
      if (config.modo === "tipo") {
        return `Visitar ${config.especialidad ?? "—"}`;
      }
      const nombre = [config.nombre, config.apellido].filter(Boolean).join(" ");
      const contacto = [config.telefono, config.email].filter(Boolean).join(" · ");
      const base = `Visitar Dr. ${nombre || "—"}`;
      return contacto ? `${base} · ${contacto}` : base;
    }
  }
}

export function emojiTipo(tipo: TipoAutomatizacion): string {
  if (tipo === "tomar_examen") return "🔬";
  if (tipo === "visitar_especialista") return "👨‍⚕️";
  return "📅";
}

export const ESTADO_AUTO_CONFIG: Record<
  string,
  { label: string; bg: string; text: string; bgHex: string; colorHex: string }
> = {
  pendiente:         { label: "Pendiente",             bg: "bg-amber-100",  text: "text-amber-700",  bgHex: "#FFFBEB", colorHex: "#B45309" },
  mensaje1_enviado:  { label: "Contactado",             bg: "bg-blue-100",   text: "text-blue-700",   bgHex: "#EFF6FF", colorHex: "#1D4ED8" },
  mensaje2_enviado:  { label: "Recordatorio enviado",   bg: "bg-violet-100", text: "text-violet-700", bgHex: "#F5F3FF", colorHex: "#6D28D9" },
  completado:        { label: "Completado",             bg: "bg-green-100",  text: "text-green-700",  bgHex: "#ECFDF5", colorHex: "#047857" },
  sin_recordatorio:  { label: "Sin recordatorio",       bg: "bg-stone-100",  text: "text-stone-500",  bgHex: "#F5F5F4", colorHex: "#78716C" },
};
