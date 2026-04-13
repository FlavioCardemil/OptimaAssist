"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { ESTADOS, ESTADO_CONFIG, type EstadoPaciente } from "@/lib/types";

const ESTADO_STYLE: Record<EstadoPaciente, { bg: string; color: string }> = {
  contactando: { bg: "#EFF6FF", color: "#1D4ED8" },
  agendado:    { bg: "#F5F3FF", color: "#6D28D9" },
  atendido:    { bg: "#ECFDF5", color: "#047857" },
  esperando:   { bg: "#FFFBEB", color: "#B45309" },
  completo:    { bg: "#F0FDFA", color: "#0F766E" },
  abandono:    { bg: "#FFF1F2", color: "#BE123C" },
  recuperado:  { bg: "#FFF7ED", color: "#C2410C" },
};

export default function FiltroPorEstado() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const estadoActivo = searchParams.get("estado") as EstadoPaciente | null;

  function setFiltro(estado: EstadoPaciente | null) {
    const params = new URLSearchParams(searchParams.toString());
    if (estado) { params.set("estado", estado); }
    else { params.delete("estado"); }
    router.push(`${pathname}?${params.toString()}`);
  }

  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
      <button
        onClick={() => setFiltro(null)}
        className={`om-filter${!estadoActivo ? " om-filter-active" : ""}`}
      >
        Todos
      </button>
      {ESTADOS.map((estado) => {
        const config = ESTADO_CONFIG[estado];
        const activo = estadoActivo === estado;
        const st = ESTADO_STYLE[estado];
        return (
          <button
            key={estado}
            onClick={() => setFiltro(estado)}
            className="om-filter"
            style={activo
              ? { background: st.color, color: "#fff", borderColor: st.color }
              : { background: st.bg, color: st.color, borderColor: st.bg }
            }
            onMouseEnter={e => { if (!activo) (e.currentTarget as HTMLButtonElement).style.opacity = "0.85"; }}
            onMouseLeave={e => { if (!activo) (e.currentTarget as HTMLButtonElement).style.opacity = "1"; }}
          >
            {config.label}
          </button>
        );
      })}
    </div>
  );
}
