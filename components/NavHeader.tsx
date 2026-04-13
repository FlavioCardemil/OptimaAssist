"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useRef, useEffect, useTransition } from "react";
import { logout } from "@/app/actions/auth";
import ModalPerfil from "./ModalPerfil";

interface Props {
  nombre: string;
  especialidad: string;
  email: string;
}

export default function NavHeader({ nombre: nombreInicial, especialidad: especialidadInicial, email }: Props) {
  const pathname = usePathname();
  const [nombre, setNombre] = useState(nombreInicial);
  const [especialidad, setEspecialidad] = useState(especialidadInicial);
  const [modalAbierto, setModalAbierto] = useState(false);
  const [menuAbierto, setMenuAbierto] = useState(false);
  const [mobileMenuAbierto, setMobileMenuAbierto] = useState(false);
  const [isPending, startTransition] = useTransition();
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuAbierto(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const initials = nombre.split(" ").slice(0, 2).map((w) => w[0]).join("").toUpperCase();

  const NAV = [
    { href: "/", label: "Pacientes" },
    { href: "/reportes", label: "Reportes" },
    { href: "/asistente", label: "Asistente IA" },
  ];

  return (
    <>
      <header className="om-header">
        <div style={{ maxWidth: "1040px", margin: "0 auto", padding: "0 24px" }}>
          <div style={{ height: "56px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "12px" }}>

            {/* Logo */}
            <div style={{ display: "flex", alignItems: "center", gap: "12px", flexShrink: 0 }}>
              <div style={{
                width: "32px", height: "32px", borderRadius: "8px",
                background: "rgba(255,255,255,0.18)", border: "1px solid rgba(255,255,255,0.25)",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.9)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 12h-4l-3 9L9 3l-3 9H2"/>
                </svg>
              </div>
              <div>
                <p style={{
                  fontFamily: "var(--font-lora-var, 'Lora', serif)",
                  fontSize: "15px", fontWeight: 700, color: "#FFFFFF",
                  lineHeight: 1.1, letterSpacing: "-0.01em",
                }}>
                  Óptima Assist
                </p>
                <p style={{
                  fontFamily: "var(--font-outfit-var, sans-serif)",
                  fontSize: "11px", color: "rgba(255,255,255,0.6)", lineHeight: 1,
                  marginTop: "2px", letterSpacing: "0.01em", maxWidth: "160px",
                  overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                }}>
                  {especialidad}
                </p>
              </div>
            </div>

            {/* Nav — solo desktop */}
            <nav className="hidden sm:flex" style={{ alignItems: "center", gap: "2px" }}>
              {NAV.map(({ href, label }) => {
                const active = pathname === href;
                return (
                  <Link key={href} href={href} className={`om-nav-link${active ? " om-nav-link-active" : ""}`}>
                    {label}
                  </Link>
                );
              })}
            </nav>

            {/* Derecha: user (desktop) + hamburguesa (móvil) */}
            <div style={{ display: "flex", alignItems: "center", gap: "8px", flexShrink: 0 }}>

              {/* User — desktop */}
              <div className="hidden sm:block" style={{ position: "relative" }} ref={menuRef}>
                <button
                  onClick={() => setMenuAbierto((v) => !v)}
                  style={{
                    display: "flex", alignItems: "center", gap: "8px",
                    padding: "5px 8px 5px 5px", borderRadius: "10px",
                    background: menuAbierto ? "rgba(255,255,255,0.18)" : "transparent",
                    border: "1px solid",
                    borderColor: menuAbierto ? "rgba(255,255,255,0.3)" : "transparent",
                    cursor: "pointer", transition: "all 0.15s ease",
                  }}
                  onMouseEnter={e => {
                    if (!menuAbierto) {
                      (e.currentTarget as HTMLButtonElement).style.background = "rgba(255,255,255,0.12)";
                      (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(255,255,255,0.2)";
                    }
                  }}
                  onMouseLeave={e => {
                    if (!menuAbierto) {
                      (e.currentTarget as HTMLButtonElement).style.background = "transparent";
                      (e.currentTarget as HTMLButtonElement).style.borderColor = "transparent";
                    }
                  }}
                >
                  <div className="om-avatar">{initials}</div>
                  <span style={{ fontFamily: "var(--font-outfit-var, sans-serif)", fontSize: "13.5px", fontWeight: 500, color: "#FFFFFF" }}>
                    {nombre}
                  </span>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.7)" strokeWidth="2.5" strokeLinecap="round"
                    style={{ transition: "transform 0.15s ease", transform: menuAbierto ? "rotate(180deg)" : "rotate(0deg)" }}>
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                </button>

                {menuAbierto && (
                  <div className="om-dropdown" style={{ position: "absolute", right: 0, marginTop: "6px", zIndex: 50 }}>
                    <div className="om-dropdown-header">
                      <p style={{ fontFamily: "var(--font-outfit-var, sans-serif)", fontSize: "13px", fontWeight: 600, color: "#1C1917" }}>{nombre}</p>
                      <p style={{ fontFamily: "var(--font-outfit-var, sans-serif)", fontSize: "12px", color: "#9B9188", marginTop: "2px" }}>{email}</p>
                    </div>
                    <button className="om-dropdown-item" onClick={() => { setMenuAbierto(false); setModalAbierto(true); }}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" color="#78716C">
                        <circle cx="12" cy="12" r="3"/>
                        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>
                      </svg>
                      Configuración
                    </button>
                    <div style={{ height: "1px", background: "#F0EFEB" }} />
                    <button className="om-dropdown-item om-dropdown-item-danger" onClick={() => startTransition(() => logout())} disabled={isPending}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                        <polyline points="16 17 21 12 16 7"/>
                        <line x1="21" y1="12" x2="9" y2="12"/>
                      </svg>
                      {isPending ? "Cerrando sesión..." : "Cerrar sesión"}
                    </button>
                  </div>
                )}
              </div>

              {/* Avatar solo (móvil) */}
              <div className="om-avatar sm:hidden">{initials}</div>

              {/* Hamburguesa (móvil) */}
              <button
                className="sm:hidden"
                onClick={() => setMobileMenuAbierto((v) => !v)}
                style={{
                  width: "36px", height: "36px", borderRadius: "8px",
                  background: mobileMenuAbierto ? "rgba(255,255,255,0.18)" : "transparent",
                  border: "1px solid rgba(255,255,255,0.2)",
                  display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer",
                }}
              >
                {mobileMenuAbierto ? (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.9)" strokeWidth="2.5" strokeLinecap="round">
                    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                  </svg>
                ) : (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.9)" strokeWidth="2.5" strokeLinecap="round">
                    <line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/>
                  </svg>
                )}
              </button>
            </div>
          </div>

          {/* Menú móvil desplegable */}
          {mobileMenuAbierto && (
            <div className="sm:hidden" style={{ borderTop: "1px solid rgba(255,255,255,0.12)", paddingBottom: "12px" }}>
              <div style={{ display: "flex", flexDirection: "column", gap: "2px", paddingTop: "8px" }}>
                {NAV.map(({ href, label }) => {
                  const active = pathname === href;
                  return (
                    <Link
                      key={href} href={href}
                      onClick={() => setMobileMenuAbierto(false)}
                      style={{
                        fontFamily: "var(--font-outfit-var, sans-serif)",
                        fontSize: "14px", fontWeight: active ? 600 : 400,
                        color: active ? "#FFFFFF" : "rgba(255,255,255,0.7)",
                        padding: "10px 12px", borderRadius: "8px",
                        background: active ? "rgba(255,255,255,0.15)" : "transparent",
                        textDecoration: "none", transition: "all 0.1s ease",
                      }}
                    >
                      {label}
                    </Link>
                  );
                })}
                <div style={{ height: "1px", background: "rgba(255,255,255,0.12)", margin: "6px 0" }} />
                <button
                  onClick={() => { setMobileMenuAbierto(false); setModalAbierto(true); }}
                  style={{
                    fontFamily: "var(--font-outfit-var, sans-serif)",
                    fontSize: "14px", color: "rgba(255,255,255,0.7)",
                    padding: "10px 12px", borderRadius: "8px", background: "transparent",
                    border: "none", cursor: "pointer", textAlign: "left",
                  }}
                >
                  Configuración
                </button>
                <button
                  onClick={() => startTransition(() => logout())}
                  disabled={isPending}
                  style={{
                    fontFamily: "var(--font-outfit-var, sans-serif)",
                    fontSize: "14px", color: "rgba(255,100,100,0.9)",
                    padding: "10px 12px", borderRadius: "8px", background: "transparent",
                    border: "none", cursor: "pointer", textAlign: "left",
                  }}
                >
                  {isPending ? "Cerrando sesión..." : "Cerrar sesión"}
                </button>
              </div>
            </div>
          )}
        </div>
      </header>

      <ModalPerfil
        abierto={modalAbierto}
        onCerrar={() => setModalAbierto(false)}
        nombre={nombre}
        especialidad={especialidad}
        email={email}
        onGuardado={(n, e) => { setNombre(n); setEspecialidad(e); }}
      />
    </>
  );
}
