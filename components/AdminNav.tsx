"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { logout } from "@/app/actions/auth";
import { useState, useRef, useEffect, useTransition } from "react";

const TABS = [
  { href: "/admin/medicos",    label: "Médicos" },
  { href: "/admin/asistentas", label: "Asistentas" },
  { href: "/admin/reportes",   label: "Reportes globales" },
  { href: "/admin/contenido",  label: "Sitio público" },
  { href: "/admin/contactos",  label: "Contactos" },
];

export default function AdminNav({ nombre, email }: { nombre: string; email: string }) {
  const pathname = usePathname();
  const [menuAbierto, setMenuAbierto] = useState(false);
  const [isPending, startTransition] = useTransition();
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setMenuAbierto(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const initials = nombre.split(" ").slice(0, 2).map((w) => w[0]).join("").toUpperCase();

  return (
    <header className="om-header">
      <div style={{ maxWidth: "1040px", margin: "0 auto", padding: "0 24px" }}>
        {/* Top row */}
        <div style={{ height: "56px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div style={{ width: "32px", height: "32px", borderRadius: "8px", background: "rgba(255,255,255,0.18)", border: "1px solid rgba(255,255,255,0.25)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.9)" strokeWidth="2" strokeLinecap="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>
            </div>
            <div>
              <p style={{ fontFamily: "var(--font-lora-var, serif)", fontSize: "15px", fontWeight: 700, color: "#FFFFFF", lineHeight: 1.1 }}>Óptima Assist</p>
              <p style={{ fontFamily: "var(--font-outfit-var, sans-serif)", fontSize: "10.5px", color: "rgba(255,255,255,0.55)", lineHeight: 1, marginTop: "2px", letterSpacing: "0.06em", textTransform: "uppercase" }}>Admin</p>
            </div>
          </div>

          <div style={{ position: "relative" }} ref={menuRef}>
            <button onClick={() => setMenuAbierto((v) => !v)}
              style={{ display: "flex", alignItems: "center", gap: "8px", padding: "5px 8px 5px 5px", borderRadius: "10px", background: menuAbierto ? "rgba(255,255,255,0.18)" : "transparent", border: `1px solid ${menuAbierto ? "rgba(255,255,255,0.3)" : "transparent"}`, cursor: "pointer", transition: "all 0.15s ease" }}
              onMouseEnter={e => { if (!menuAbierto) (e.currentTarget as HTMLButtonElement).style.background = "rgba(255,255,255,0.12)"; }}
              onMouseLeave={e => { if (!menuAbierto) (e.currentTarget as HTMLButtonElement).style.background = "transparent"; }}
            >
              <div className="om-avatar">{initials}</div>
              <span style={{ fontFamily: "var(--font-outfit-var, sans-serif)", fontSize: "13.5px", fontWeight: 500, color: "#FFFFFF" }} className="hidden sm:block">{nombre}</span>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.7)" strokeWidth="2.5" strokeLinecap="round" className="hidden sm:block"
                style={{ transition: "transform 0.15s ease", transform: menuAbierto ? "rotate(180deg)" : "rotate(0deg)" }}>
                <polyline points="6 9 12 15 18 9"/>
              </svg>
            </button>

            {menuAbierto && (
              <div className="om-dropdown" style={{ position: "absolute", right: 0, marginTop: "6px", zIndex: 50 }}>
                <div className="om-dropdown-header">
                  <p style={{ fontFamily: "var(--font-outfit-var, sans-serif)", fontSize: "13px", fontWeight: 600, color: "#1C1917" }}>{nombre}</p>
                  <p style={{ fontFamily: "var(--font-outfit-var, sans-serif)", fontSize: "12px", color: "#9B9188", marginTop: "2px" }}>{email}</p>
                </div>
                <button className="om-dropdown-item om-dropdown-item-danger" onClick={() => startTransition(() => logout())} disabled={isPending}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                    <polyline points="16 17 21 12 16 7"/>
                    <line x1="21" y1="12" x2="9" y2="12"/>
                  </svg>
                  {isPending ? "Cerrando..." : "Cerrar sesión"}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Tabs */}
        <nav style={{ display: "flex", gap: "4px", marginBottom: "-1px" }}>
          {TABS.map((tab) => {
            const active = pathname.startsWith(tab.href);
            return (
              <Link key={tab.href} href={tab.href} className={`om-tab${active ? " om-tab-active" : ""}`}>
                {tab.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
