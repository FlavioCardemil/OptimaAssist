import { ESTADO_CONFIG, type EstadoPaciente } from "@/lib/types";

const ESTADO_STYLE: Record<EstadoPaciente, { bg: string; color: string }> = {
  contactando: { bg: "#EFF6FF", color: "#1D4ED8" },
  agendado:    { bg: "#F5F3FF", color: "#6D28D9" },
  atendido:    { bg: "#ECFDF5", color: "#047857" },
  esperando:   { bg: "#FFFBEB", color: "#B45309" },
  completo:    { bg: "#F0FDFA", color: "#0F766E" },
  abandono:    { bg: "#FFF1F2", color: "#BE123C" },
  recuperado:  { bg: "#FFF7ED", color: "#C2410C" },
};

export default function EstadoBadge({ estado }: { estado: EstadoPaciente }) {
  const config = ESTADO_CONFIG[estado];
  const style = ESTADO_STYLE[estado] ?? { bg: "#F7F6F3", color: "#78716C" };
  return (
    <span className="om-badge" style={{ background: style.bg, color: style.color }}>
      {config.label}
    </span>
  );
}
