import type { EstadoPaciente } from "@/lib/types";

interface Automatizacion {
  titulo: string;
  descripcion: string;
  icono: React.ReactNode;
}

const ICONO_WA = (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
  </svg>
);

const ICONO_CALENDAR = (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
    <line x1="16" y1="2" x2="16" y2="6"/>
    <line x1="8" y1="2" x2="8" y2="6"/>
    <line x1="3" y1="10" x2="21" y2="10"/>
  </svg>
);

const ICONO_REFRESH = (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="23 4 23 10 17 10"/>
    <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/>
  </svg>
);

const ICONO_EDIT = (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 20h9"/>
    <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/>
  </svg>
);

const POR_ESTADO: Partial<Record<EstadoPaciente, Automatizacion>> = {
  contactando: {
    titulo: "Enviar mensaje de bienvenida por WhatsApp",
    descripcion: "Envía un mensaje automático de bienvenida al número registrado del paciente.",
    icono: ICONO_WA,
  },
  agendado: {
    titulo: "Enviar recordatorio de cita",
    descripcion: "Recuerda al paciente su próxima cita con fecha, hora y datos del profesional.",
    icono: ICONO_CALENDAR,
  },
  abandono: {
    titulo: "Enviar mensaje de reactivación",
    descripcion: "Envía un mensaje personalizado para retomar el contacto con el paciente.",
    icono: ICONO_REFRESH,
  },
};

const UNIVERSAL: Automatizacion = {
  titulo: "Enviar mensaje personalizado",
  descripcion: "Redacta y envía un mensaje a medida para este paciente.",
  icono: ICONO_EDIT,
};

interface Props {
  estado: EstadoPaciente;
}

export default function AutomatizacionesPanel({ estado }: Props) {
  const especifica = POR_ESTADO[estado];
  const automatizaciones = especifica ? [especifica, UNIVERSAL] : [UNIVERSAL];

  return (
    <div className="space-y-3">
      {automatizaciones.map((a, i) => (
        <div
          key={i}
          className="bg-white border border-slate-200 rounded-xl p-4 flex items-start gap-3 opacity-80"
        >
          <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500 mt-0.5">
            {a.icono}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <p className="text-sm font-medium text-slate-800 leading-snug">
                {a.titulo}
              </p>
              <span className="flex-shrink-0 text-xs font-medium bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full">
                Próximamente
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1 leading-relaxed">
              {a.descripcion}
            </p>
            <button
              disabled
              className="mt-3 text-xs font-medium px-3 py-1.5 rounded-lg bg-slate-100 text-slate-400 cursor-not-allowed"
            >
              Ejecutar
            </button>
          </div>
        </div>
      ))}
      <p className="text-xs text-slate-400 text-center pt-1">
        Las automatizaciones se ejecutarán vía Make.com
      </p>
    </div>
  );
}
