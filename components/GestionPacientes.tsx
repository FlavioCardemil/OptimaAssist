"use client";

import { useRef, useState } from "react";
import type { PacienteConEstado } from "@/lib/types";
import PacientesAgrupados from "./PacientesAgrupados";
import ResultadosBusqueda from "./ResultadosBusqueda";
import ModalPaciente from "./ModalPaciente";

function normalizar(s: string) {
  return s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[\.\-\s]/g, "");
}

function filtrarPacientes(pacientes: PacienteConEstado[], query: string) {
  const q = normalizar(query);
  return pacientes.filter((p) =>
    normalizar(p.nombre).includes(q) || normalizar(p.apellido).includes(q) ||
    normalizar(`${p.nombre} ${p.apellido}`).includes(q) || normalizar(p.rut).includes(q) ||
    (p.telefono && normalizar(p.telefono).includes(q)) ||
    (p.email && normalizar(p.email).includes(q))
  );
}

export default function GestionPacientes({ pacientes }: { pacientes: PacienteConEstado[] }) {
  const [modalAbierto, setModalAbierto] = useState(false);
  const [pacienteEditando, setPacienteEditando] = useState<PacienteConEstado | null>(null);
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const hayBusqueda = query.trim().length > 0;
  const resultados = hayBusqueda ? filtrarPacientes(pacientes, query.trim()) : [];

  return (
    <>
      {/* Header row */}
      <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: "12px" }}>
        <div>
          <h2 style={{ fontFamily: "var(--font-lora-var, 'Lora', serif)", fontSize: "1.75rem", fontWeight: 700, color: "#1C1917", letterSpacing: "-0.02em", lineHeight: 1.1 }}>
            Mis pacientes
          </h2>
          <p style={{ fontFamily: "var(--font-outfit-var, sans-serif)", fontSize: "13px", color: "#9B9188", marginTop: "4px" }}>
            {pacientes.length} {pacientes.length === 1 ? "paciente" : "pacientes"} en total
          </p>
        </div>
        <button className="om-btn om-btn-primary" onClick={() => { setPacienteEditando(null); setModalAbierto(true); }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          Nuevo paciente
        </button>
      </div>

      {/* Search */}
      <div style={{ position: "relative" }}>
        <div style={{ position: "absolute", left: "13px", top: "50%", transform: "translateY(-50%)", pointerEvents: "none", color: "#B0A89F" }}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
        </div>
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Buscar por nombre, RUT, teléfono o email…"
          className="om-input"
          style={{ paddingLeft: "40px", paddingRight: hayBusqueda ? "40px" : "13px" }}
        />
        {hayBusqueda && (
          <button
            onClick={() => { setQuery(""); inputRef.current?.focus(); }}
            style={{ position: "absolute", right: "10px", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "#B0A89F", padding: "2px", display: "flex", alignItems: "center", borderRadius: "4px", transition: "color 0.1s ease" }}
            onMouseEnter={e => (e.currentTarget.style.color = "#78716C")}
            onMouseLeave={e => (e.currentTarget.style.color = "#B0A89F")}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        )}
      </div>

      {hayBusqueda ? (
        <ResultadosBusqueda pacientes={resultados} query={query.trim()} onEditar={(p) => { setPacienteEditando(p); setModalAbierto(true); }} />
      ) : (
        <PacientesAgrupados pacientes={pacientes} onEditar={(p) => { setPacienteEditando(p); setModalAbierto(true); }} />
      )}

      <ModalPaciente abierto={modalAbierto} onCerrar={() => setModalAbierto(false)} paciente={pacienteEditando} />
    </>
  );
}
