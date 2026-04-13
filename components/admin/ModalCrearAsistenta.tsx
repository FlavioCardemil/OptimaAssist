"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { crearAsistenta } from "@/app/actions/admin";

export default function ModalCrearAsistenta() {
  const router = useRouter();
  const [abierto, setAbierto] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [campos, setCampos] = useState({ nombre: "", email: "", password: "" });

  function set(k: keyof typeof campos, v: string) { setCampos((p) => ({ ...p, [k]: v })); }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    startTransition(async () => {
      const result = await crearAsistenta(campos);
      if (result.error) { setError(result.error); }
      else { setAbierto(false); setCampos({ nombre: "", email: "", password: "" }); router.refresh(); }
    });
  }

  return (
    <>
      <button onClick={() => { setAbierto(true); setError(null); }} className="om-btn om-btn-primary">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
        Nueva asistenta
      </button>

      {abierto && (
        <div className="om-modal-overlay" onClick={() => setAbierto(false)}>
          <div className="om-modal" onClick={(e) => e.stopPropagation()}>
            <div className="om-modal-header">
              <div>
                <h2 style={{ fontFamily: "var(--font-lora-var, serif)", fontSize: "1.2rem", fontWeight: 700, color: "#1C1917", letterSpacing: "-0.01em" }}>
                  Nueva asistenta
                </h2>
                <p style={{ fontFamily: "var(--font-outfit-var, sans-serif)", fontSize: "13px", color: "#9B9188", marginTop: "3px" }}>
                  Se creará la cuenta de acceso
                </p>
              </div>
              <button onClick={() => setAbierto(false)} style={{ width: "28px", height: "28px", borderRadius: "6px", background: "transparent", border: "1px solid #E7E5E0", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "#9B9188", transition: "all 0.1s ease", flexShrink: 0 }}
                onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = "#F0EFEB"; (e.currentTarget as HTMLButtonElement).style.color = "#1C1917"; }}
                onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = "transparent"; (e.currentTarget as HTMLButtonElement).style.color = "#9B9188"; }}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                  <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="om-modal-body">
                <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                  <div>
                    <label className="om-label">Nombre completo <span style={{ color: "#DC2626", marginLeft: "2px" }}>*</span></label>
                    <input value={campos.nombre} onChange={(e) => set("nombre", e.target.value)} required className="om-input" placeholder="María González" />
                  </div>
                  <div>
                    <label className="om-label">Email <span style={{ color: "#DC2626", marginLeft: "2px" }}>*</span></label>
                    <input value={campos.email} onChange={(e) => set("email", e.target.value)} required type="email" className="om-input" placeholder="asistenta@clinica.cl" />
                  </div>
                  <div>
                    <label className="om-label">Contraseña inicial <span style={{ color: "#DC2626", marginLeft: "2px" }}>*</span></label>
                    <input value={campos.password} onChange={(e) => set("password", e.target.value)} required type="password" minLength={6} className="om-input" placeholder="Mínimo 6 caracteres" />
                  </div>
                  {error && <div className="om-error-msg">{error}</div>}
                </div>
              </div>
              <div className="om-modal-footer">
                <button type="button" onClick={() => setAbierto(false)} disabled={isPending} className="om-btn om-btn-ghost">Cancelar</button>
                <button type="submit" disabled={isPending} className="om-btn om-btn-primary">
                  {isPending ? "Creando…" : "Crear asistenta"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
