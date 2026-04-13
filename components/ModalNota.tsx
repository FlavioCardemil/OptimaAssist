"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { crearNota } from "@/app/actions/timeline";

interface Props {
  abierto: boolean;
  onCerrar: () => void;
  onGuardado: () => void;
  pacienteId: string;
}

export default function ModalNota({ abierto, onCerrar, onGuardado, pacienteId }: Props) {
  const [texto, setTexto] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (abierto) {
      setTexto("");
      setError(null);
      setTimeout(() => textareaRef.current?.focus(), 50);
    }
  }, [abierto]);

  useEffect(() => {
    function handleEsc(e: KeyboardEvent) { if (e.key === "Escape") onCerrar(); }
    if (abierto) document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, [abierto, onCerrar]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!texto.trim()) { setError("La nota no puede estar vacía"); return; }
    setError(null);
    startTransition(async () => {
      const result = await crearNota(pacienteId, texto);
      if (result.error) { setError(result.error); }
      else { onGuardado(); onCerrar(); }
    });
  }

  if (!abierto) return null;

  return (
    <div className="om-modal-overlay" onClick={onCerrar}>
      <div className="om-modal" onClick={(e) => e.stopPropagation()}>
        <div className="om-modal-header">
          <div>
            <h2 style={{ fontFamily: "var(--font-lora-var, serif)", fontSize: "1.2rem", fontWeight: 700, color: "#1C1917", letterSpacing: "-0.01em" }}>
              Nota clínica
            </h2>
            <p style={{ fontFamily: "var(--font-outfit-var, sans-serif)", fontSize: "13px", color: "#9B9188", marginTop: "3px" }}>
              Se registrará en la línea de tiempo del paciente
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
            <textarea
              ref={textareaRef}
              value={texto}
              onChange={(e) => { setTexto(e.target.value); if (error) setError(null); }}
              placeholder="Escribe la nota clínica aquí..."
              rows={6}
              className="om-input"
              style={{ resize: "none", fontFamily: "var(--font-outfit-var, sans-serif)", lineHeight: 1.6 }}
            />
            {error && <div className="om-error-msg" style={{ marginTop: "8px" }}>{error}</div>}
          </div>
          <div className="om-modal-footer">
            <button type="button" onClick={onCerrar} disabled={isPending} className="om-btn om-btn-ghost">Cancelar</button>
            <button type="submit" disabled={isPending} className="om-btn om-btn-primary">
              {isPending ? "Guardando…" : "Guardar nota"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
