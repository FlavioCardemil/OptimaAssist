"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { editarPerfil } from "@/app/actions/profesional";

interface Props {
  abierto: boolean;
  onCerrar: () => void;
  nombre: string;
  especialidad: string;
  email: string;
  onGuardado: (nombre: string, especialidad: string) => void;
}

export default function ModalPerfil({ abierto, onCerrar, nombre, especialidad, email, onGuardado }: Props) {
  const [campos, setCampos] = useState({ nombre, especialidad });
  const [errores, setErrores] = useState<{ nombre?: string; especialidad?: string }>({});
  const [errorServidor, setErrorServidor] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const primerCampoRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (abierto) {
      setCampos({ nombre, especialidad });
      setErrores({});
      setErrorServidor(null);
      setTimeout(() => primerCampoRef.current?.focus(), 50);
    }
  }, [abierto, nombre, especialidad]);

  useEffect(() => {
    function handleEsc(e: KeyboardEvent) { if (e.key === "Escape") onCerrar(); }
    if (abierto) document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, [abierto, onCerrar]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const nuevosErrores: typeof errores = {};
    if (!campos.nombre.trim()) nuevosErrores.nombre = "Requerido";
    if (!campos.especialidad.trim()) nuevosErrores.especialidad = "Requerido";
    setErrores(nuevosErrores);
    if (Object.keys(nuevosErrores).length > 0) return;
    setErrorServidor(null);
    startTransition(async () => {
      const resultado = await editarPerfil(campos);
      if (resultado.error) { setErrorServidor(resultado.error); }
      else { onGuardado(campos.nombre.trim(), campos.especialidad.trim()); onCerrar(); }
    });
  }

  if (!abierto) return null;

  return (
    <div className="om-modal-overlay" onClick={onCerrar}>
      <div className="om-modal" onClick={(e) => e.stopPropagation()}>
        <div className="om-modal-header">
          <div>
            <h2 style={{ fontFamily: "var(--font-lora-var, serif)", fontSize: "1.2rem", fontWeight: 700, color: "#1C1917", letterSpacing: "-0.01em" }}>
              Editar perfil
            </h2>
            <p style={{ fontFamily: "var(--font-outfit-var, sans-serif)", fontSize: "13px", color: "#9B9188", marginTop: "3px" }}>
              Actualiza tu nombre y especialidad
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
              <div>
                <label className="om-label">Nombre completo <span style={{ color: "#DC2626", marginLeft: "2px" }}>*</span></label>
                <input
                  ref={primerCampoRef}
                  value={campos.nombre}
                  onChange={(e) => { setCampos((p) => ({ ...p, nombre: e.target.value })); if (errores.nombre) setErrores((p) => ({ ...p, nombre: undefined })); }}
                  className={`om-input${errores.nombre ? " om-input-error" : ""}`}
                  placeholder="Dr. Felipe Cardemil"
                />
                {errores.nombre && <p style={{ fontFamily: "var(--font-outfit-var, sans-serif)", fontSize: "12px", color: "#DC2626", marginTop: "4px", fontWeight: 500 }}>{errores.nombre}</p>}
              </div>

              <div>
                <label className="om-label">Especialidad <span style={{ color: "#DC2626", marginLeft: "2px" }}>*</span></label>
                <input
                  value={campos.especialidad}
                  onChange={(e) => { setCampos((p) => ({ ...p, especialidad: e.target.value })); if (errores.especialidad) setErrores((p) => ({ ...p, especialidad: undefined })); }}
                  className={`om-input${errores.especialidad ? " om-input-error" : ""}`}
                  placeholder="Medicina General"
                />
                {errores.especialidad && <p style={{ fontFamily: "var(--font-outfit-var, sans-serif)", fontSize: "12px", color: "#DC2626", marginTop: "4px", fontWeight: 500 }}>{errores.especialidad}</p>}
              </div>

              <div>
                <label className="om-label">Email</label>
                <input
                  value={email}
                  readOnly
                  className="om-input"
                  style={{ background: "#F5F4F1", color: "#B0A89F", cursor: "not-allowed" }}
                />
                <p style={{ fontFamily: "var(--font-outfit-var, sans-serif)", fontSize: "12px", color: "#B0A89F", marginTop: "4px" }}>
                  El email está vinculado al login y no se puede modificar.
                </p>
              </div>

              {errorServidor && <div className="om-error-msg">{errorServidor}</div>}
            </div>
          </div>

          <div className="om-modal-footer">
            <button type="button" onClick={onCerrar} disabled={isPending} className="om-btn om-btn-ghost">Cancelar</button>
            <button type="submit" disabled={isPending} className="om-btn om-btn-primary">
              {isPending ? "Guardando…" : "Guardar cambios"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
