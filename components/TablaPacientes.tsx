"use client";

import Link from "next/link";
import type { PacienteConEstado } from "@/lib/types";
import SelectorEstado from "./SelectorEstado";

function formatFecha(fechaISO: string | null): string {
  if (!fechaISO) return "—";
  return new Date(fechaISO).toLocaleDateString("es-CL", { day: "2-digit", month: "2-digit", year: "numeric" });
}

export default function TablaPacientes({ pacientes, onEditar, medicosPorId }: {
  pacientes: PacienteConEstado[];
  onEditar: (p: PacienteConEstado) => void;
  medicosPorId?: Record<string, string>;
}) {
  if (pacientes.length === 0) {
    return (
      <div className="om-empty om-table-wrap">
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#D4D0CA" strokeWidth="1.5" strokeLinecap="round" style={{ margin: "0 auto 10px" }}>
          <circle cx="12" cy="12" r="10"/><path d="M8 12h8M12 8v8"/>
        </svg>
        <p style={{ fontWeight: 600, color: "#78716C" }}>Sin pacientes</p>
        <p style={{ marginTop: "4px", fontSize: "13px" }}>No hay pacientes en este estado.</p>
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
            {medicosPorId && <th>Médico</th>}
            <th>Última sesión</th>
            <th style={{ width: "44px" }} />
          </tr>
        </thead>
        <tbody>
          {pacientes.map((p) => (
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
                  style={{
                    opacity: 0, padding: "6px", borderRadius: "6px",
                    background: "transparent", border: "none", cursor: "pointer",
                    color: "#78716C", transition: "all 0.12s ease", display: "flex",
                  }}
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
        </tbody>
      </table>
    </div>
  );
}
