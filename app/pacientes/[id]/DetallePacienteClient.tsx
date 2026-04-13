"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import type { EstadoPaciente, PacienteConEstado, Automatizacion } from "@/lib/types";
import ModalPaciente from "@/components/ModalPaciente";
import TimelineUnificado from "@/components/TimelineUnificado";

const ESTADO_STYLE: Record<EstadoPaciente, { bg: string; color: string }> = {
  contactando: { bg: "#EFF6FF", color: "#1D4ED8" },
  agendado:    { bg: "#F5F3FF", color: "#6D28D9" },
  atendido:    { bg: "#ECFDF5", color: "#047857" },
  esperando:   { bg: "#FFFBEB", color: "#B45309" },
  completo:    { bg: "#F0FDFA", color: "#0F766E" },
  abandono:    { bg: "#FFF1F2", color: "#BE123C" },
  recuperado:  { bg: "#FFF7ED", color: "#C2410C" },
};

const ESTADO_LABEL: Record<EstadoPaciente, string> = {
  contactando: "Contactando",
  agendado:    "Agendado",
  atendido:    "Atendido",
  esperando:   "Esperando",
  completo:    "Completo",
  abandono:    "Abandono",
  recuperado:  "Recuperado",
};

interface Sesion {
  id: string;
  estado: string;
  fecha: string;
  nota: string | null;
}

interface Props {
  paciente: PacienteConEstado;
  sesiones: Sesion[];
  automatizaciones: Automatizacion[];
  backUrl?: string;
}

export default function DetallePacienteClient({ paciente, sesiones, automatizaciones, backUrl = "/" }: Props) {
  const router = useRouter();
  const [modalAbierto, setModalAbierto] = useState(false);

  const st = ESTADO_STYLE[paciente.estado_actual];
  const label = ESTADO_LABEL[paciente.estado_actual];

  return (
    <>
      <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "20px" }} className="om-detalle-grid">
        <style>{`@media (min-width: 900px) { .om-detalle-grid { grid-template-columns: 320px 1fr; align-items: start; } .om-detalle-sidebar { position: sticky; top: 32px; } }`}</style>

        {/* Panel izquierdo */}
        <div className="om-detalle-sidebar" style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          <div style={{ background: "#FFFFFF", borderRadius: "14px", border: "1px solid rgba(0,0,0,0.07)", padding: "24px", boxShadow: "0 1px 2px rgba(0,0,0,0.04)", display: "flex", flexDirection: "column", gap: "16px" }}>
            {/* Volver */}
            <Link href={backUrl} style={{ display: "inline-flex", alignItems: "center", gap: "5px", fontSize: "12px", color: "#9B9188", textDecoration: "none", transition: "color 0.1s ease" }}
              onMouseEnter={e => (e.currentTarget.style.color = "#1C1917")}
              onMouseLeave={e => (e.currentTarget.style.color = "#9B9188")}
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <polyline points="15 18 9 12 15 6"/>
              </svg>
              Volver a pacientes
            </Link>

            {/* Nombre y RUT */}
            <div>
              <h2 style={{ fontFamily: "var(--font-lora-var, serif)", fontSize: "1.35rem", fontWeight: 700, color: "#1C1917", lineHeight: 1.2, letterSpacing: "-0.01em" }}>
                {paciente.nombre} {paciente.apellido}
              </h2>
              <p style={{ fontFamily: "var(--font-outfit-var, sans-serif)", fontSize: "13px", color: "#9B9188", marginTop: "3px" }}>{paciente.rut}</p>
            </div>

            {/* Estado badge */}
            <span style={{ display: "inline-flex", alignItems: "center", padding: "4px 12px", borderRadius: "999px", background: st.bg, color: st.color, fontSize: "12.5px", fontWeight: 600, fontFamily: "var(--font-outfit-var, sans-serif)", width: "fit-content" }}>
              {label}
            </span>

            {/* Datos contacto */}
            <div style={{ display: "flex", flexDirection: "column", gap: "8px", paddingTop: "2px" }}>
              <ContactoItem
                icono={<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13.1a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 2.37h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 9.91a16 16 0 0 0 6.29 6.29l.91-.91a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>}
                valor={paciente.telefono ?? "—"}
              />
              <ContactoItem
                icono={<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>}
                valor={paciente.email ?? "—"}
              />
            </div>

            {/* Botón editar */}
            <button
              onClick={() => setModalAbierto(true)}
              className="om-btn om-btn-ghost"
              style={{ width: "100%", justifyContent: "center", marginTop: "4px" }}
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
              </svg>
              Editar paciente
            </button>
          </div>
        </div>

        {/* Panel derecho: timeline */}
        <div style={{ background: "#FFFFFF", borderRadius: "14px", border: "1px solid rgba(0,0,0,0.07)", padding: "24px", boxShadow: "0 1px 2px rgba(0,0,0,0.04)" }}>
          <TimelineUnificado
            key={sesiones.length + automatizaciones.length}
            pacienteId={paciente.id}
            sesiones={sesiones}
            automatizaciones={automatizaciones}
          />
        </div>
      </div>

      <ModalPaciente
        abierto={modalAbierto}
        onCerrar={() => setModalAbierto(false)}
        onGuardado={() => router.refresh()}
        paciente={paciente}
      />
    </>
  );
}

function ContactoItem({ icono, valor }: { icono: React.ReactNode; valor: string }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "8px", fontFamily: "var(--font-outfit-var, sans-serif)", fontSize: "13.5px" }}>
      <span style={{ color: "#B0A89F", flexShrink: 0 }}>{icono}</span>
      <span style={{ color: valor === "—" ? "#D6D3D1" : "#44403C" }}>{valor}</span>
    </div>
  );
}
