"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { login, resetPassword } from "@/app/actions/auth";

export default function LoginPage() {
  const router = useRouter();
  const [vista, setVista] = useState<"login" | "recuperar">("login");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [emailEnviado, setEmailEnviado] = useState(false);

  async function handleLogin(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    const result = await login(formData);
    if (result?.error) { setError(result.error); setLoading(false); }
    else if (result?.redirect) { router.push(result.redirect); }
    else { setLoading(false); }
  }

  async function handleRecuperar(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const result = await resetPassword(email);
    setLoading(false);
    if (result?.error) { setError(result.error); }
    else { setEmailEnviado(true); }
  }

  function volverAlLogin() {
    setVista("login");
    setError(null);
    setEmailEnviado(false);
  }

  return (
    <div className="om-login-wrap">
      <div className="om-login-card">
        {/* Brand header */}
        <div className="om-login-brand">
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "10px", marginBottom: "14px" }}>
            <div style={{ width: "40px", height: "40px", borderRadius: "10px", background: "rgba(255,255,255,0.2)", border: "1.5px solid rgba(255,255,255,0.3)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.95)" strokeWidth="2" strokeLinecap="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>
            </div>
          </div>
          <h1 style={{ fontFamily: "var(--font-lora-var, 'Lora', serif)", fontSize: "1.65rem", fontWeight: 700, color: "#FFFFFF", letterSpacing: "-0.02em", textAlign: "center", lineHeight: 1.15 }}>
            Óptima Assist
          </h1>
          <p style={{ fontFamily: "var(--font-outfit-var, sans-serif)", fontSize: "13px", color: "rgba(255,255,255,0.65)", textAlign: "center", marginTop: "6px" }}>
            {vista === "login" ? "Gestión clínica de pacientes" : "Recuperar contraseña"}
          </p>
        </div>

        {/* Form area */}
        <div className="om-login-form">
          {vista === "login" ? (
            <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
              <div>
                <label htmlFor="email" className="om-label">Email</label>
                <input id="email" name="email" type="email" required autoComplete="email" className="om-input" placeholder="tu@clinica.cl" />
              </div>

              <div>
                <label htmlFor="password" className="om-label">Contraseña</label>
                <div style={{ position: "relative" }}>
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    required
                    autoComplete="current-password"
                    className="om-input"
                    placeholder="••••••••"
                    style={{ paddingRight: "42px" }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    tabIndex={-1}
                    title={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                    style={{ position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "#B0A89F", padding: "2px", display: "flex", alignItems: "center", transition: "color 0.1s" }}
                    onMouseEnter={e => (e.currentTarget.style.color = "#78716C")}
                    onMouseLeave={e => (e.currentTarget.style.color = "#B0A89F")}
                  >
                    {showPassword ? <EyeOff /> : <Eye />}
                  </button>
                </div>
                <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "6px" }}>
                  <button
                    type="button"
                    onClick={() => { setVista("recuperar"); setError(null); }}
                    style={{ fontFamily: "var(--font-outfit-var, sans-serif)", fontSize: "12.5px", color: "#9B9188", background: "none", border: "none", cursor: "pointer", padding: 0, transition: "color 0.1s" }}
                    onMouseEnter={e => (e.currentTarget.style.color = "#1C1917")}
                    onMouseLeave={e => (e.currentTarget.style.color = "#9B9188")}
                  >
                    ¿Olvidaste tu contraseña?
                  </button>
                </div>
              </div>

              {error && <div className="om-error-msg">{error}</div>}

              <button type="submit" disabled={loading} className="om-btn om-btn-primary" style={{ width: "100%", justifyContent: "center", padding: "11px 16px", fontSize: "15px" }}>
                {loading ? (
                  <span style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <span style={{ width: "14px", height: "14px", border: "2px solid rgba(255,255,255,0.3)", borderTopColor: "#fff", borderRadius: "50%", animation: "spin 0.7s linear infinite", display: "inline-block" }} />
                    Ingresando…
                  </span>
                ) : "Ingresar"}
              </button>
            </form>
          ) : emailEnviado ? (
            <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
              <div style={{ textAlign: "center", padding: "8px 0" }}>
                <div style={{ width: "48px", height: "48px", borderRadius: "12px", background: "#ECFDF5", border: "1px solid #A7F3D0", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 14px" }}>
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#047857" strokeWidth="2" strokeLinecap="round">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                    <polyline points="22,6 12,13 2,6"/>
                  </svg>
                </div>
                <p style={{ fontFamily: "var(--font-lora-var, serif)", fontSize: "1rem", fontWeight: 700, color: "#1C1917" }}>Revisa tu email</p>
                <p style={{ fontFamily: "var(--font-outfit-var, sans-serif)", fontSize: "13px", color: "#9B9188", marginTop: "6px", lineHeight: 1.5 }}>
                  Te enviamos un enlace para restablecer tu contraseña. Puede tardar unos minutos.
                </p>
              </div>
              <button type="button" onClick={volverAlLogin} className="om-btn om-btn-ghost" style={{ width: "100%", justifyContent: "center" }}>
                Volver al inicio de sesión
              </button>
            </div>
          ) : (
            <form onSubmit={handleRecuperar} style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
              <p style={{ fontFamily: "var(--font-outfit-var, sans-serif)", fontSize: "13px", color: "#78716C", lineHeight: 1.5 }}>
                Ingresa tu email y te enviaremos un enlace para restablecer tu contraseña.
              </p>

              <div>
                <label htmlFor="email-recuperar" className="om-label">Email</label>
                <input id="email-recuperar" name="email" type="email" required autoComplete="email" className="om-input" placeholder="tu@clinica.cl" autoFocus />
              </div>

              {error && <div className="om-error-msg">{error}</div>}

              <button type="submit" disabled={loading} className="om-btn om-btn-primary" style={{ width: "100%", justifyContent: "center", padding: "11px 16px", fontSize: "15px" }}>
                {loading ? (
                  <span style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <span style={{ width: "14px", height: "14px", border: "2px solid rgba(255,255,255,0.3)", borderTopColor: "#fff", borderRadius: "50%", animation: "spin 0.7s linear infinite", display: "inline-block" }} />
                    Enviando…
                  </span>
                ) : "Enviar enlace"}
              </button>

              <button type="button" onClick={volverAlLogin} style={{ fontFamily: "var(--font-outfit-var, sans-serif)", fontSize: "13px", color: "#9B9188", background: "none", border: "none", cursor: "pointer", padding: 0, textAlign: "center", transition: "color 0.1s" }}
                onMouseEnter={e => (e.currentTarget.style.color = "#1C1917")}
                onMouseLeave={e => (e.currentTarget.style.color = "#9B9188")}
              >
                ← Volver al inicio de sesión
              </button>
            </form>
          )}
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
