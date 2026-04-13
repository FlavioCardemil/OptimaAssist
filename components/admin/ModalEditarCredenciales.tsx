"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { actualizarCredencialesMedico } from "@/app/actions/admin";

interface Props {
  usuarioId: string;
  profesionalId: string;
  emailActual: string;
}

export default function ModalEditarCredenciales({ usuarioId, profesionalId, emailActual }: Props) {
  const router = useRouter();
  const [abierto, setAbierto] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [ok, setOk] = useState(false);
  const [campos, setCampos] = useState({ email: emailActual, password: "" });

  function set(k: keyof typeof campos, v: string) { setCampos((p) => ({ ...p, [k]: v })); }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setOk(false);
    startTransition(async () => {
      const result = await actualizarCredencialesMedico({
        usuarioId,
        profesionalId,
        email: campos.email !== emailActual ? campos.email : undefined,
        password: campos.password || undefined,
      });
      if (result.error) {
        setError(result.error);
      } else {
        setOk(true);
        router.refresh();
        setTimeout(() => { setAbierto(false); setOk(false); }, 1200);
      }
    });
  }

  return (
    <>
      <button onClick={() => { setAbierto(true); setError(null); setOk(false); setCampos({ email: emailActual, password: "" }); }} className="om-btn om-btn-ghost" style={{ fontSize: "13px" }}>
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
        </svg>
        Editar credenciales
      </button>

      {abierto && (
        <div className="om-modal-overlay" onClick={() => setAbierto(false)}>
          <div className="om-modal" onClick={(e) => e.stopPropagation()}>
            <div className="om-modal-header">
              <div>
                <h2 style={{ fontFamily: "var(--font-lora-var, serif)", fontSize: "1.2rem", fontWeight: 700, color: "#1C1917", letterSpacing: "-0.01em" }}>
                  Editar credenciales
                </h2>
                <p style={{ fontFamily: "var(--font-outfit-var, sans-serif)", fontSize: "13px", color: "#9B9188", marginTop: "3px" }}>
                  Deja vacío lo que no quieras cambiar
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
                    <label className="om-label">Nuevo email</label>
                    <input value={campos.email} onChange={(e) => set("email", e.target.value)} type="email" className="om-input" placeholder="medico@clinica.cl" />
                  </div>
                  <div>
                    <label className="om-label">Nueva contraseña</label>
                    <input value={campos.password} onChange={(e) => set("password", e.target.value)} type="password" minLength={6} className="om-input" placeholder="Mínimo 6 caracteres" />
                  </div>
                  {error && <div className="om-error-msg">{error}</div>}
                  {ok && <div style={{ fontSize: "13px", color: "#16A34A", fontWeight: 600 }}>Credenciales actualizadas</div>}
                </div>
              </div>
              <div className="om-modal-footer">
                <button type="button" onClick={() => setAbierto(false)} disabled={isPending} className="om-btn om-btn-ghost">Cancelar</button>
                <button type="submit" disabled={isPending} className="om-btn om-btn-primary">
                  {isPending ? "Guardando…" : "Guardar cambios"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
