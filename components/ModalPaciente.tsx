"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { ESTADOS, ESTADO_CONFIG, type EstadoPaciente, type PacienteConEstado } from "@/lib/types";
import { formatearRut, validarRut } from "@/lib/rut";
import { crearPaciente, editarPaciente } from "@/app/actions/pacientes";

interface MedicoOpcion { id: string; nombre: string; }
interface Campos { nombre: string; apellido: string; rut: string; telefono: string; email: string; estado: EstadoPaciente; profesionalId: string; }
const VACIO: Campos = { nombre: "", apellido: "", rut: "", telefono: "", email: "", estado: "contactando", profesionalId: "" };

export default function ModalPaciente({ abierto, onCerrar, onGuardado, paciente, medicos }: {
  abierto: boolean; onCerrar: () => void; onGuardado?: () => void;
  paciente: PacienteConEstado | null; medicos?: MedicoOpcion[];
}) {
  const [campos, setCampos] = useState<Campos>(VACIO);
  const [errores, setErrores] = useState<Partial<Campos>>({});
  const [errorServidor, setErrorServidor] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const primerCampoRef = useRef<HTMLInputElement>(null);
  const esEdicion = paciente !== null;

  useEffect(() => {
    if (abierto) {
      setCampos(paciente ? { nombre: paciente.nombre, apellido: paciente.apellido, rut: paciente.rut, telefono: paciente.telefono ?? "", email: paciente.email ?? "", estado: paciente.estado_actual, profesionalId: paciente.profesional_id ?? "" } : { ...VACIO, profesionalId: medicos?.[0]?.id ?? "" });
      setErrores({}); setErrorServidor(null);
      setTimeout(() => primerCampoRef.current?.focus(), 50);
    }
  }, [abierto, paciente]);

  useEffect(() => {
    function handleEsc(e: KeyboardEvent) { if (e.key === "Escape") onCerrar(); }
    if (abierto) document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, [abierto, onCerrar]);

  function set(campo: keyof Campos, valor: string) {
    setCampos((p) => ({ ...p, [campo]: valor }));
    if (errores[campo]) setErrores((p) => ({ ...p, [campo]: undefined }));
  }

  function validar() {
    const e: Partial<Campos> = {};
    if (!campos.nombre.trim()) e.nombre = "Requerido";
    if (!campos.apellido.trim()) e.apellido = "Requerido";
    if (!campos.rut.trim()) { e.rut = "Requerido"; }
    else if (!validarRut(campos.rut)) { e.rut = "RUT inválido"; }
    setErrores(e);
    return Object.keys(e).length === 0;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validar()) return;
    setErrorServidor(null);
    startTransition(async () => {
      const r = esEdicion
        ? await editarPaciente(paciente.id, paciente.estado_actual, campos)
        : await crearPaciente({ ...campos, profesionalId: medicos ? campos.profesionalId : undefined });
      if (r.error) { setErrorServidor(r.error); }
      else { onGuardado?.(); onCerrar(); }
    });
  }

  if (!abierto) return null;

  return (
    <div className="om-modal-overlay" onClick={onCerrar}>
      <div className="om-modal" onClick={(e) => e.stopPropagation()}>
        <div className="om-modal-header">
          <div>
            <h2 style={{ fontFamily: "var(--font-lora-var, serif)", fontSize: "1.2rem", fontWeight: 700, color: "#1C1917", letterSpacing: "-0.01em" }}>
              {esEdicion ? "Editar paciente" : "Nuevo paciente"}
            </h2>
            <p style={{ fontFamily: "var(--font-outfit-var, sans-serif)", fontSize: "13px", color: "#9B9188", marginTop: "3px" }}>
              {esEdicion ? `${paciente.nombre} ${paciente.apellido}` : "Completa los datos del nuevo paciente"}
            </p>
          </div>
          <button onClick={onCerrar} style={{ width: "28px", height: "28px", borderRadius: "6px", background: "transparent", border: "1px solid #E7E5E0", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "#9B9188", transition: "all 0.1s ease", flexShrink: 0 }}
            onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = "#F0EFEB"; (e.currentTarget as HTMLButtonElement).style.color = "#1C1917"; }}
            onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = "transparent"; (e.currentTarget as HTMLButtonElement).style.color = "#9B9188"; }}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="om-modal-body">
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                <Campo label="Nombre" requerido error={errores.nombre}>
                  <input ref={primerCampoRef} value={campos.nombre} onChange={(e) => set("nombre", e.target.value)} className={`om-input${errores.nombre ? " om-input-error" : ""}`} placeholder="María" />
                </Campo>
                <Campo label="Apellido" requerido error={errores.apellido}>
                  <input value={campos.apellido} onChange={(e) => set("apellido", e.target.value)} className={`om-input${errores.apellido ? " om-input-error" : ""}`} placeholder="González" />
                </Campo>
              </div>
              <Campo label="RUT" requerido error={errores.rut}>
                <input value={campos.rut} onChange={(e) => set("rut", formatearRut(e.target.value))} className={`om-input${errores.rut ? " om-input-error" : ""}`} placeholder="12.345.678-9" maxLength={12} />
              </Campo>
              <Campo label="Teléfono">
                <input value={campos.telefono} onChange={(e) => set("telefono", e.target.value)} className="om-input" placeholder="+56912345678" type="tel" />
              </Campo>
              <Campo label="Email">
                <input value={campos.email} onChange={(e) => set("email", e.target.value)} className="om-input" placeholder="paciente@email.com" type="email" />
              </Campo>
              <Campo label="Estado" requerido>
                <select value={campos.estado} onChange={(e) => set("estado", e.target.value as EstadoPaciente)} className="om-input" style={{ cursor: "pointer" }}>
                  {ESTADOS.map((e) => <option key={e} value={e}>{ESTADO_CONFIG[e].label}</option>)}
                </select>
              </Campo>
              {medicos && !esEdicion && (
                <Campo label="Médico responsable" requerido>
                  <select value={campos.profesionalId} onChange={(e) => set("profesionalId", e.target.value)} className="om-input" style={{ cursor: "pointer" }}>
                    {medicos.map((m) => <option key={m.id} value={m.id}>{m.nombre}</option>)}
                  </select>
                </Campo>
              )}
              {errorServidor && <div className="om-error-msg">{errorServidor}</div>}
            </div>
          </div>
          <div className="om-modal-footer">
            <button type="button" onClick={onCerrar} disabled={isPending} className="om-btn om-btn-ghost">Cancelar</button>
            <button type="submit" disabled={isPending} className="om-btn om-btn-primary">
              {isPending ? "Guardando…" : esEdicion ? "Guardar cambios" : "Crear paciente"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function Campo({ label, requerido, error, children }: { label: string; requerido?: boolean; error?: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="om-label">
        {label}{requerido && <span style={{ color: "#DC2626", marginLeft: "2px" }}>*</span>}
      </label>
      {children}
      {error && <p style={{ fontFamily: "var(--font-outfit-var, sans-serif)", fontSize: "12px", color: "#DC2626", marginTop: "4px", fontWeight: 500 }}>{error}</p>}
    </div>
  );
}
