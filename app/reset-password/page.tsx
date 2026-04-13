"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function ResetPasswordPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirmar, setConfirmar] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmar, setShowConfirmar] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres.");
      return;
    }
    if (password !== confirmar) {
      setError("Las contraseñas no coinciden.");
      return;
    }

    setLoading(true);
    const supabase = createClient();
    const { error: updateError } = await supabase.auth.updateUser({ password });

    if (updateError) {
      setError("No se pudo actualizar la contraseña. El enlace puede haber expirado.");
      setLoading(false);
      return;
    }

    router.push("/");
  }

  return (
    <div className="om-login-wrap">
      <div className="om-login-card">
        {/* Brand */}
        <div className="om-login-brand">
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "10px", marginBottom: "14px" }}>
            <div style={{ width: "40px", height: "40px", borderRadius: "10px", background: "rgba(255,255,255,0.2)", border: "1.5px solid rgba(255,255,255,0.3)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.95)" strokeWidth="2" strokeLinecap="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>
            </div>
          </div>
          <h1 style={{ fontFamily: "var(--font-lora-var, 'Lora', serif)", fontSize: "1.65rem", fontWeight: 700, color: "#FFFFFF", letterSpacing: "-0.02em", textAlign: "center", lineHeight: 1.15 }}>
            Nueva contraseña
          </h1>
          <p style={{ fontFamily: "var(--font-outfit-var, sans-serif)", fontSize: "13px", color: "rgba(255,255,255,0.65)", textAlign: "center", marginTop: "6px" }}>
            Elige una contraseña segura para tu cuenta
          </p>
        </div>

        {/* Form */}
        <div className="om-login-form">
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
            <div>
              <label htmlFor="password" className="om-label">Nueva contraseña</label>
              <div style={{ position: "relative" }}>
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoFocus
                  className="om-input"
                  placeholder="Mínimo 6 caracteres"
                  style={{ paddingRight: "42px" }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  tabIndex={-1}
                  style={{ position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "#B0A89F", padding: "2px", display: "flex", alignItems: "center", transition: "color 0.1s" }}
                  onMouseEnter={e => (e.currentTarget.style.color = "#78716C")}
                  onMouseLeave={e => (e.currentTarget.style.color = "#B0A89F")}
                >
                  {showPassword ? <EyeOff /> : <Eye />}
                </button>
              </div>
            </div>

            <div>
              <label htmlFor="confirmar" className="om-label">Confirmar contraseña</label>
              <div style={{ position: "relative" }}>
                <input
                  id="confirmar"
                  type={showConfirmar ? "text" : "password"}
                  value={confirmar}
                  onChange={(e) => setConfirmar(e.target.value)}
                  required
                  className="om-input"
                  placeholder="Repite la contraseña"
                  style={{ paddingRight: "42px" }}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmar((v) => !v)}
                  tabIndex={-1}
                  style={{ position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "#B0A89F", padding: "2px", display: "flex", alignItems: "center", transition: "color 0.1s" }}
                  onMouseEnter={e => (e.currentTarget.style.color = "#78716C")}
                  onMouseLeave={e => (e.currentTarget.style.color = "#B0A89F")}
                >
                  {showConfirmar ? <EyeOff /> : <Eye />}
                </button>
              </div>
            </div>

            {error && <div className="om-error-msg">{error}</div>}

            <button type="submit" disabled={loading} className="om-btn om-btn-primary" style={{ width: "100%", justifyContent: "center", padding: "11px 16px", fontSize: "15px" }}>
              {loading ? (
                <span style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <span style={{ width: "14px", height: "14px", border: "2px solid rgba(255,255,255,0.3)", borderTopColor: "#fff", borderRadius: "50%", animation: "spin 0.7s linear infinite", display: "inline-block" }} />
                  Actualizando…
                </span>
              ) : "Actualizar contraseña"}
            </button>
          </form>
        </div>
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

function Eye() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
      <circle cx="12" cy="12" r="3"/>
    </svg>
  );
}

function EyeOff() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
      <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
      <line x1="1" y1="1" x2="23" y2="23"/>
    </svg>
  );
}
