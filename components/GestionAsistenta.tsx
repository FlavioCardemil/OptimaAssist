"use client";

import { useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import type { PacienteConEstado } from "@/lib/types";
import PacientesAgrupados from "./PacientesAgrupados";
import ResultadosBusqueda from "./ResultadosBusqueda";
import ModalPaciente from "./ModalPaciente";

interface MedicoAsignado {
  medico_id: string;
  nombre: string;
}

interface Props {
  pacientes: PacienteConEstado[];
  medicos: MedicoAsignado[];
  medicoFiltro: string | null;
}

function normalizar(s: string): string {
  return s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[\.\-\s]/g, "");
}

function filtrarPacientes(pacientes: PacienteConEstado[], query: string): PacienteConEstado[] {
  const q = normalizar(query);
  return pacientes.filter(
    (p) =>
      normalizar(p.nombre).includes(q) ||
      normalizar(p.apellido).includes(q) ||
      normalizar(`${p.nombre} ${p.apellido}`).includes(q) ||
      normalizar(p.rut).includes(q) ||
      (p.telefono && normalizar(p.telefono).includes(q)) ||
      (p.email && normalizar(p.email).includes(q))
  );
}

export default function GestionAsistenta({ pacientes, medicos, medicoFiltro }: Props) {
  const router = useRouter();
  const [, startTransition] = useTransition();
  const [modalAbierto, setModalAbierto] = useState(false);
  const [pacienteEditando, setPacienteEditando] = useState<PacienteConEstado | null>(null);
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const medicosPorId: Record<string, string> = Object.fromEntries(
    medicos.map((m) => [m.medico_id, m.nombre])
  );

  const medicosOpcion = medicos.map((m) => ({ id: m.medico_id, nombre: m.nombre }));

  function handleMedicoChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const val = e.target.value;
    startTransition(() => {
      if (val) router.push(`/asistenta?medico=${val}`);
      else router.push("/asistenta");
    });
  }

  const hayBusqueda = query.trim().length > 0;
  const resultados = hayBusqueda ? filtrarPacientes(pacientes, query.trim()) : [];

  return (
    <>
      {/* Header row */}
      <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: "12px", flexWrap: "wrap" }}>
        <div>
          <h2 style={{ fontFamily: "var(--font-lora-var, 'Lora', serif)", fontSize: "1.75rem", fontWeight: 700, color: "#1C1917", letterSpacing: "-0.02em", lineHeight: 1.1 }}>
            Pacientes
          </h2>
          <p style={{ fontFamily: "var(--font-outfit-var, sans-serif)", fontSize: "13px", color: "#9B9188", marginTop: "4px" }}>
            {pacientes.length} {pacientes.length === 1 ? "paciente" : "pacientes"} en total
          </p>
        </div>
        {/* Controles: stack en móvil, fila en desktop */}
        <div style={{ display: "flex", flexDirection: "column", gap: "8px", width: "100%" }} className="sm:!flex-row sm:!items-center sm:!w-auto">
          {medicos.length > 1 && (
            <select
              value={medicoFiltro ?? ""}
              onChange={handleMedicoChange}
              className="om-input"
              style={{ cursor: "pointer", width: "100%" }}
            >
              <option value="">Todos los médicos</option>
              {medicos.map((m) => (
                <option key={m.medico_id} value={m.medico_id}>{m.nombre}</option>
              ))}
            </select>
          )}
          <button
            className="om-btn om-btn-primary"
            style={{ justifyContent: "center", width: "100%" }}
            onClick={() => { setPacienteEditando(null); setModalAbierto(true); }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            Nuevo paciente
          </button>
        </div>
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
        <PacientesAgrupados pacientes={pacientes} onEditar={(p) => { setPacienteEditando(p); setModalAbierto(true); }} medicosPorId={medicosPorId} />
      )}

      <ModalPaciente
        abierto={modalAbierto}
        onCerrar={() => setModalAbierto(false)}
        paciente={pacienteEditando}
        medicos={medicosOpcion}
      />
    </>
  );
}
