"use client";

import Link from "next/link";
import { ESTADOS, ESTADO_CONFIG, type EstadoPaciente, type PacienteConEstado } from "@/lib/types";
import SelectorEstado from "./SelectorEstado";

const ESTADO_STYLE: Record<EstadoPaciente, { bg: string; color: string }> = {
  contactando: { bg: "#EFF6FF", color: "#1D4ED8" },
  agendado:    { bg: "#F5F3FF", color: "#6D28D9" },
  atendido:    { bg: "#ECFDF5", color: "#047857" },
  esperando:   { bg: "#FFFBEB", color: "#B45309" },
  completo:    { bg: "#F0FDFA", color: "#0F766E" },
  abandono:    { bg: "#FFF1F2", color: "#BE123C" },
  recuperado:  { bg: "#FFF7ED", color: "#C2410C" },
};

function formatFecha(fechaISO: string | null): string {
  if (!fechaISO) return "—";
  return new Date(fechaISO).toLocaleDateString("es-CL", { day: "2-digit", month: "2-digit", year: "numeric" });
}

export default function PacientesAgrupados({ pacientes, onEditar, medicosPorId }: {
  pacientes: PacienteConEstado[];
  onEditar: (p: PacienteConEstado) => void;
  medicosPorId?: Record<string, string>;
}) {
  const grupos = ESTADOS
    .map((estado) => ({ estado, pacientes: pacientes.filter((p) => p.estado_actual === estado) }))
    .filter((g) => g.pacientes.length > 0);

  if (grupos.length === 0) {
    return (
      <div className="om-empty" style={{ background: "#FFFFFF", borderRadius: "14px", border: "1px solid rgba(0,0,0,0.06)" }}>
        <p style={{ fontWeight: 600, color: "#78716C" }}>Sin pacientes</p>
        <p style={{ marginTop: "4px", fontSize: "13px" }}>Aún no hay pacientes registrados.</p>
      </div>
    );
  }

  const colSpan = medicosPorId ? 6 : 5;

  return (
    <div className="om-table-wrap">
      <table className="om-table">
        <thead>
          <tr>
            <th>Paciente</th>
            <th>RUT</th>
            <th>Estado</th>
            {medicosPorId && <th>Médico</th>}
            <th>Última sesión</th>
            <th style={{ width: "44px" }} />
          </tr>
        </thead>
        <tbody>
          {grupos.map(({ estado, pacientes: grupo }) => {
            const config = ESTADO_CONFIG[estado as EstadoPaciente];
            const st = ESTADO_STYLE[estado as EstadoPaciente];
            return (
              <>
                {/* Group header row */}
                <tr key={`header-${estado}`}>
                  <td colSpan={colSpan} style={{ padding: "8px 16px", background: st.bg, borderBottom: `1px solid ${st.color}22` }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      <span style={{ fontFamily: "var(--font-outfit-var, sans-serif)", fontSize: "12.5px", fontWeight: 700, color: st.color }}>
                        {config.label}
                      </span>
                      <span style={{ fontFamily: "var(--font-outfit-var, sans-serif)", fontSize: "12px", color: st.color, opacity: 0.6, fontWeight: 500 }}>
                        · {grupo.length} {grupo.length === 1 ? "paciente" : "pacientes"}
                      </span>
                    </div>
                  </td>
                </tr>

                {/* Patient rows */}
                {grupo.map((p) => (
                  <tr key={p.id} className="group">
                    <td>
                      <Link href={`/pacientes/${p.id}`} style={{ textDecoration: "none", display: "block" }}>
                        <p style={{ fontWeight: 600, color: "#1C1917", fontSize: "14px", transition: "color 0.12s ease" }}
                          onMouseEnter={e => (e.currentTarget.style.color = "#0B6E72")}
                          onMouseLeave={e => (e.currentTarget.style.color = "#1C1917")}
                        >
                          {p.nombre} {p.apellido}
                        </p>
                        {p.email && <p style={{ fontSize: "12px", color: "#9B9188", marginTop: "1px" }}>{p.email}</p>}
                      </Link>
                    </td>
                    <td>
                      <span style={{ fontFamily: "var(--font-outfit-var, sans-serif)", fontSize: "13px", color: "#78716C", letterSpacing: "0.02em" }}>
                        {p.rut}
                      </span>
                    </td>
                    <td>
                      <SelectorEstado pacienteId={p.id} sesionId={p.sesion_id} estadoActual={p.estado_actual} />
                    </td>
                    {medicosPorId && (
                      <td style={{ fontSize: "13px", color: "#78716C" }}>{medicosPorId[p.profesional_id] ?? "—"}</td>
                    )}
                    <td style={{ fontSize: "13px", color: "#9B9188" }}>{formatFecha(p.fecha_ultima_sesion)}</td>
                    <td>
                      <button
                        onClick={() => onEditar(p)}
                        title="Editar"
                        style={{ opacity: 0, padding: "6px", borderRadius: "6px", background: "transparent", border: "none", cursor: "pointer", color: "#78716C", transition: "all 0.12s ease", display: "flex" }}
                        className="group-hover:!opacity-100"
                        onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = "#F0EFEB"; (e.currentTarget as HTMLButtonElement).style.color = "#0B6E72"; }}
                        onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = "transparent"; (e.currentTarget as HTMLButtonElement).style.color = "#78716C"; }}
                      >
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                        </svg>
                      </button>
                    </td>
                  </tr>
                ))}
              </>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
