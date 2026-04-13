import { ESTADO_CONFIG, type EstadoPaciente } from "@/lib/types";

interface Sesion {
  id: string;
  estado: EstadoPaciente;
  fecha: string;
}

interface Props {
  sesiones: Sesion[];
}

function formatFechaHora(iso: string): { fecha: string; hora: string } {
  const d = new Date(iso);
  return {
    fecha: d.toLocaleDateString("es-CL", { day: "2-digit", month: "2-digit", year: "numeric" }),
    hora: d.toLocaleTimeString("es-CL", { hour: "2-digit", minute: "2-digit" }),
  };
}

export default function TimelineHistorial({ sesiones }: Props) {
  if (sesiones.length === 0) {
    return (
      <p className="text-sm text-slate-400 py-4">Sin historial registrado.</p>
    );
  }

  return (
    <ol className="relative">
      {sesiones.map((s, i) => {
        const config = ESTADO_CONFIG[s.estado];
        const { fecha, hora } = formatFechaHora(s.fecha);
        const esUltimo = i === sesiones.length - 1;

        return (
          <li key={s.id} className="relative flex gap-4 pb-6 last:pb-0">
            {/* Línea vertical */}
            {!esUltimo && (
              <div className="absolute left-3 top-6 bottom-0 w-px bg-slate-200" />
            )}

            {/* Dot */}
            <div className={`relative flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center mt-0.5 ${config.bg}`}>
              <div className={`w-2 h-2 rounded-full ${config.text.replace("text-", "bg-")}`} />
            </div>

            {/* Contenido */}
            <div className="flex-1 min-w-0 pt-0.5">
              <div className="flex items-center gap-2 flex-wrap">
                <span className={`text-xs font-semibold ${config.text}`}>
                  {config.label}
                </span>
                {i === 0 && (
                  <span className="text-xs bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded font-medium">
                    actual
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                {fecha} · {hora}
              </p>
            </div>
          </li>
        );
      })}
    </ol>
  );
}
