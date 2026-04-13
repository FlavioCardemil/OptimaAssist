"use client";

import { useState } from "react";
import { ESTADOS, ESTADO_CONFIG, type EstadoPaciente } from "@/lib/types";
import { actualizarEstadoPaciente } from "@/app/actions/pacientes";

const ESTADO_STYLE: Record<EstadoPaciente, { bg: string; color: string }> = {
  contactando: { bg: "#EFF6FF", color: "#1D4ED8" },
  agendado:    { bg: "#F5F3FF", color: "#6D28D9" },
  atendido:    { bg: "#ECFDF5", color: "#047857" },
  esperando:   { bg: "#FFFBEB", color: "#B45309" },
  completo:    { bg: "#F0FDFA", color: "#0F766E" },
  abandono:    { bg: "#FFF1F2", color: "#BE123C" },
  recuperado:  { bg: "#FFF7ED", color: "#C2410C" },
};

export default function SelectorEstado({ pacienteId, sesionId, estadoActual }: {
  pacienteId: string;
  sesionId: string | null;
  estadoActual: EstadoPaciente;
}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const st = ESTADO_STYLE[estadoActual] ?? { bg: "#F7F6F3", color: "#78716C" };

  async function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const nuevoEstado = e.target.value as EstadoPaciente;
    if (nuevoEstado === estadoActual) return;
    setLoading(true);
    setError(null);
    const result = await actualizarEstadoPaciente(sesionId, pacienteId, nuevoEstado);
    if (result?.error) setError(result.error);
    setLoading(false);
  }

  return (
    <div style={{ position: "relative", display: "inline-block" }}>
      <select
        defaultValue={estadoActual}
        onChange={handleChange}
        disabled={loading}
        className="om-select"
        style={{ background: st.bg, color: st.color, borderColor: st.bg, fontWeight: 600 }}
      >
        {ESTADOS.map((e) => (
          <option key={e} value={e}>{ESTADO_CONFIG[e].label}</option>
        ))}
      </select>
      <span style={{ pointerEvents: "none", position: "absolute", right: "6px", top: "50%", transform: "translateY(-50%)", fontSize: "10px", color: st.color, opacity: 0.7 }}>▾</span>
      {error && (
        <p style={{ position: "absolute", top: "calc(100% + 4px)", left: 0, zIndex: 10, whiteSpace: "nowrap", fontFamily: "var(--font-outfit-var, sans-serif)", fontSize: "12px", color: "#DC2626", background: "#FEF2F2", border: "1px solid #FECACA", borderRadius: "6px", padding: "4px 8px" }}>
          {error}
        </p>
      )}
    </div>
  );
}
