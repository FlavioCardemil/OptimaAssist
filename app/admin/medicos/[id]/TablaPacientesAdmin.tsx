"use client";

import { useRouter } from "next/navigation";
import type { EstadoPaciente, PacienteConEstado } from "@/lib/types";

const ESTADO_STYLE: Record<EstadoPaciente, { bg: string; color: string; label: string }> = {
  contactando: { bg: "#EFF6FF", color: "#1D4ED8", label: "Contactando" },
  agendado:    { bg: "#F5F3FF", color: "#6D28D9", label: "Agendado" },
  atendido:    { bg: "#ECFDF5", color: "#047857", label: "Atendido" },
  esperando:   { bg: "#FFFBEB", color: "#B45309", label: "Esperando" },
  completo:    { bg: "#F0FDFA", color: "#0F766E", label: "Completo" },
  abandono:    { bg: "#FFF1F2", color: "#BE123C", label: "Abandono" },
  recuperado:  { bg: "#FFF7ED", color: "#C2410C", label: "Recuperado" },
};

function formatFecha(fechaISO: string | null) {
  if (!fechaISO) return "—";
  return new Date(fechaISO).toLocaleDateString("es-CL", { day: "2-digit", month: "2-digit", year: "numeric" });
}

interface Props {
  pacientes: PacienteConEstado[];
  backUrl: string;
}

export default function TablaPacientesAdmin({ pacientes, backUrl }: Props) {
  const router = useRouter();

  if (pacientes.length === 0) {
    return (
      <div className="om-empty" style={{ background: "#FFFFFF", borderRadius: "14px", border: "1px solid rgba(0,0,0,0.06)" }}>
        <p style={{ fontWeight: 600, color: "#78716C" }}>Sin pacientes</p>
        <p style={{ marginTop: "4px", fontSize: "13px" }}>Este médico no tiene pacientes aún.</p>
      </div>
    );
  }

  return (
    <div className="om-table-wrap">
      <table className="om-table">
        <thead>
          <tr>
            <th>Paciente</th>
            <th>RUT</th>
            <th>Estado</th>
            <th>Última sesión</th>
            <th style={{ width: "32px" }} />
          </tr>
        </thead>
        <tbody>
          {pacientes.map((p) => {
            const st = ESTADO_STYLE[p.estado_actual] ?? { bg: "#F5F4F1", color: "#78716C", label: p.estado_actual };
            return (
              <tr
                key={p.id}
                onClick={() => router.push(`/pacientes/${p.id}?back=${encodeURIComponent(backUrl)}`)}
                style={{ cursor: "pointer" }}
                className="group"
              >
                <td>
                  <p style={{ fontWeight: 600, color: "#1C1917", fontSize: "14px", transition: "color 0.1s" }}
                    onMouseEnter={e => (e.currentTarget.style.color = "#0B6E72")}
                    onMouseLeave={e => (e.currentTarget.style.color = "#1C1917")}
                  >
                    {p.nombre} {p.apellido}
                  </p>
                  {p.email && <p style={{ fontSize: "12px", color: "#9B9188", marginTop: "1px" }}>{p.email}</p>}
                </td>
                <td><span style={{ fontSize: "13px", color: "#78716C" }}>{p.rut}</span></td>
                <td>
                  <span style={{ display: "inline-flex", alignItems: "center", padding: "3px 10px", borderRadius: "999px", background: st.bg, color: st.color, fontSize: "11.5px", fontWeight: 600, fontFamily: "var(--font-outfit-var, sans-serif)" }}>
                    {st.label}
                  </span>
                </td>
                <td><span style={{ fontSize: "13px", color: "#9B9188" }}>{formatFecha(p.fecha_ultima_sesion)}</span></td>
                <td>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#D6D3D1" strokeWidth="2.5" strokeLinecap="round" className="group-hover:!stroke-[#0B6E72]" style={{ transition: "stroke 0.1s" }}>
                    <polyline points="9 18 15 12 9 6" />
                  </svg>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
