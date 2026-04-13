export type EstadoPaciente =
  | "contactando"
  | "agendado"
  | "atendido"
  | "esperando"
  | "completo"
  | "abandono"
  | "recuperado";

export const ESTADOS: EstadoPaciente[] = [
  "contactando",
  "agendado",
  "atendido",
  "esperando",
  "completo",
  "abandono",
  "recuperado",
];

export const ESTADO_CONFIG: Record<
  EstadoPaciente,
  { label: string; color: string; bg: string; text: string }
> = {
  contactando: {
    label: "Contactando",
    color: "blue",
    bg: "bg-blue-100",
    text: "text-blue-800",
  },
  agendado: {
    label: "Agendado",
    color: "violet",
    bg: "bg-violet-100",
    text: "text-violet-800",
  },
  atendido: {
    label: "Atendido",
    color: "green",
    bg: "bg-green-100",
    text: "text-green-800",
  },
  esperando: {
    label: "Esperando",
    color: "yellow",
    bg: "bg-yellow-100",
    text: "text-yellow-800",
  },
  completo: {
    label: "Completo",
    color: "teal",
    bg: "bg-teal-100",
    text: "text-teal-800",
  },
  abandono: {
    label: "Abandono",
    color: "red",
    bg: "bg-red-100",
    text: "text-red-800",
  },
  recuperado: {
    label: "Recuperado",
    color: "orange",
    bg: "bg-orange-100",
    text: "text-orange-800",
  },
};

// ── Roles ────────────────────────────────────────────────────────────────────

export type Rol = "medico" | "asistenta" | "super_admin";

export interface Usuario {
  id: string;
  rol: Rol;
  nombre: string;
  email: string;
  created_at: string;
}

export interface Profesional {
  id: string;
  nombre: string;
  especialidad: string;
  email: string;
}

export interface Paciente {
  id: string;
  rut: string;
  nombre: string;
  apellido: string;
  telefono: string | null;
  email: string | null;
  profesional_id: string;
}

export interface Sesion {
  id: string;
  paciente_id: string;
  profesional_id: string;
  fecha: string;
  estado: EstadoPaciente;
}

export interface PacienteConEstado extends Paciente {
  estado_actual: EstadoPaciente;
  fecha_ultima_sesion: string | null;
  sesion_id: string | null;
}

// ── Automatizaciones ────────────────────────────────────────────────────────

export type TipoAutomatizacion =
  | "volver_en"
  | "volver_fecha"
  | "tomar_examen"
  | "visitar_especialista";

export type EstadoAutomatizacion = "pendiente" | "enviado" | "completado";
export type UnidadTiempo = "dias" | "semanas" | "meses";
export type ModoEspecialista = "tipo" | "nombre";

export interface Automatizacion {
  id: string;
  paciente_id: string;
  profesional_id: string;
  tipo: TipoAutomatizacion;
  configuracion: Record<string, unknown>;
  estado: EstadoAutomatizacion;
  created_at: string;
}
