import Link from "next/link";
import ContactForm from "./ContactForm";
import { obtenerContenidoLanding } from "@/app/actions/landing";

export const metadata = {
  title: "Óptima Assist — Gestión clínica para especialistas",
  description: "La plataforma que ordenó más de 500 pacientes activos con 3 clicks. Recupera el control de tu consulta y aumenta tu facturación.",
};

const PLANES = [
  {
    nombre: "Starter",
    precio: "$59.900",
    periodo: "+ IVA / mes",
    descripcion: "Para médicos que buscan orden y automatización inmediata.",
    features: [
      "Dashboard de gestión médica.",
      "Timeline visual de pacientes.",
      "Recordatorios automáticos (2 meses a 4 años).",
      "Ficha clínica básica.",
      "Operado por el médico o su propia secretaria.",
    ],
    accent: "#4B5563",
    destacado: false,
  },
  {
    nombre: "Básico",
    precio: "$120.000",
    periodo: "+ IVA / mes",
    descripcion: "Delegue la primera línea de atención en manos profesionales.",
    features: [
      "Asistente humana dedicada (Paula).",
      "Gestión de agenda y confirmación de citas.",
      "Respuestas rápidas y derivación.",
      "Filtro de consultas por WhatsApp.",
      "Incluye todas las funciones del Plan Starter.",
    ],
    accent: "#0B6E72",
    destacado: false,
  },
  {
    nombre: "Intermedio",
    precio: "$450.000",
    periodo: "+ IVA / mes",
    descripcion: "El estándar de oro para especialistas con alto volumen de cirugía.",
    features: [
      "Gestión de archivos clínicos (Firebase Storage).",
      "Timeline avanzado con previsualización de exámenes.",
      "Asistente con entrenamiento en su especialidad.",
      "Reportería mensual de conversión y rescate.",
      "Seguimiento proactivo de post-operatorios.",
    ],
    accent: "#0B6E72",
    destacado: true,
  },
  {
    nombre: "Personalizado",
    precio: "Consultar",
    periodo: "",
    descripcion: "Gestión clínica de elite para casos complejos y alta gama.",
    features: [
      "Atención dedicada y personalizada.",
      "Seguimiento de pacientes con atención exclusiva.",
      "Alertas de prioridad.",
      "Reportería del servicio.",
      "Integraciones con otros servicios (de ser necesarias).",
    ],
    accent: "#1C1917",
    destacado: false,
  },
];

const PROBLEMAS = [
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13.6a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 2.93h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 10.5a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
      </svg>
    ),
    titulo: "Pacientes que se pierden",
    texto: "Listas de WhatsApp, planillas Excel, post-its. Nadie sabe quién está esperando hora y quién ya no vuelve.",
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
      </svg>
    ),
    titulo: "Asistentas sin contexto",
    texto: "Tu asistenta no sabe el estado real de cada paciente. Cada semana repiten las mismas preguntas.",
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
        <line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
      </svg>
    ),
    titulo: "Facturación que se escapa",
    texto: "Pacientes que quedan en estado 'esperando' nunca son recontactados. Eso es dinero que se va.",
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
        <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
      </svg>
    ),
    titulo: "Horas perdidas en admin",
    texto: "Tiempo que podrías dedicar a ver más pacientes lo gastas coordinando, buscando y recordando.",
  },
];

const BENEFICIOS = [
  { num: "3×", label: "más rápido el seguimiento vs planilla Excel" },
  { num: "+40%", label: "recuperación de pacientes en abandono" },
  { num: "0", label: "pacientes perdidos con el sistema de estados" },
  { num: "1 día", label: "para que tu equipo esté operativo" },
];

export default async function LandingPage() {
  const c = await obtenerContenidoLanding();
  return (
    <>
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes ld-fade-up {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes ld-pulse {
          0%, 100% { opacity: 0.6; }
          50% { opacity: 1; }
        }
        .ld-nav-link {
          font-family: var(--font-outfit-var, sans-serif);
          font-size: 14px;
          font-weight: 500;
          color: rgba(255,255,255,0.65);
          text-decoration: none;
          transition: color 0.15s ease;
          letter-spacing: 0.01em;
        }
        .ld-nav-link:hover { color: #FFFFFF; }
        .ld-plan-card {
          background: #FFFFFF;
          border-radius: 18px;
          border: 1.5px solid rgba(0,0,0,0.07);
          padding: 32px;
          display: flex;
          flex-direction: column;
          gap: 24px;
          height: 100%;
          box-sizing: border-box;
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }
        .ld-plan-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 20px 50px rgba(0,0,0,0.1);
        }
        .ld-plan-card.destacado {
          background: #0B6E72;
          border-color: #074F52;
          color: #FFFFFF;
        }
        .ld-feature-check {
          width: 18px; height: 18px;
          border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0;
        }
        .ld-problema-card {
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 16px;
          padding: 28px;
          transition: background 0.2s ease;
        }
        .ld-problema-card:hover {
          background: rgba(255,255,255,0.07);
        }
        @media (max-width: 768px) {
          .ld-hero-grid { flex-direction: column !important; }
          .ld-plans-grid { grid-template-columns: 1fr !important; }
          .ld-beneficios-grid { grid-template-columns: 1fr 1fr !important; }
          .ld-problemas-grid { grid-template-columns: 1fr !important; }
          .ld-features-grid { grid-template-columns: 1fr !important; }
          .ld-elizabeth-grid { flex-direction: column-reverse !important; }
          .ld-nav-links { display: none !important; }
          .ld-hero-heading { font-size: clamp(2.2rem, 8vw, 4.5rem) !important; }
        }
      `}</style>

      {/* ── NAV ──────────────────────────────────────────────── */}
      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
        background: "rgba(15,25,28,0.88)", backdropFilter: "blur(16px)",
        borderBottom: "1px solid rgba(255,255,255,0.06)",
        padding: "0 40px", height: "64px",
        display: "flex", alignItems: "center", justifyContent: "space-between",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div style={{
            width: "32px", height: "32px", borderRadius: "8px",
            background: "#0B6E72", display: "flex", alignItems: "center", justifyContent: "center"
          }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.9)" strokeWidth="2.5" strokeLinecap="round">
              <path d="M22 12h-4l-3 9L9 3l-3 9H2"/>
            </svg>
          </div>
          <span style={{ fontFamily: "var(--font-lora-var, serif)", fontSize: "1.05rem", fontWeight: 700, color: "#FFFFFF", letterSpacing: "-0.01em" }}>
            Óptima Assist
          </span>
        </div>
        <div className="ld-nav-links" style={{ display: "flex", alignItems: "center", gap: "32px" }}>
          <a href="#problema" className="ld-nav-link">El problema</a>
          <a href="#solucion" className="ld-nav-link">Solución</a>
          <a href="#planes" className="ld-nav-link">Planes</a>
          <a href="#equipo" className="ld-nav-link">Equipo</a>
          <a href="#contacto" className="ld-nav-link">Contacto</a>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <Link href="/login" style={{
            fontFamily: "var(--font-outfit-var, sans-serif)", fontSize: "13.5px", fontWeight: 500,
            color: "rgba(255,255,255,0.6)", textDecoration: "none", padding: "7px 14px",
            borderRadius: "8px", transition: "all 0.15s ease",
          }}
          onMouseEnter={undefined}
          >
            Iniciar sesión
          </Link>
          <a href="#contacto" style={{
            fontFamily: "var(--font-outfit-var, sans-serif)", fontSize: "13.5px", fontWeight: 600,
            color: "#FFFFFF", textDecoration: "none", padding: "8px 18px",
            background: "#0B6E72", borderRadius: "8px", transition: "background 0.15s ease",
          }}>
            Demo gratuita
          </a>
        </div>
      </nav>

      {/* ── HERO ─────────────────────────────────────────────── */}
      <section style={{
        background: "linear-gradient(160deg, #0F191C 0%, #0B6E72 60%, #074F52 100%)",
        minHeight: "100vh", paddingTop: "64px",
        display: "flex", flexDirection: "column", justifyContent: "center",
        position: "relative", overflow: "hidden",
      }}>
        {/* Grid overlay */}
        <div style={{
          position: "absolute", inset: 0, pointerEvents: "none",
          backgroundImage: "linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }} />
        {/* Radial glow */}
        <div style={{
          position: "absolute", top: "20%", right: "-10%", width: "600px", height: "600px",
          background: "radial-gradient(circle, rgba(15,145,153,0.2) 0%, transparent 70%)",
          pointerEvents: "none",
        }} />

        <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "80px 40px 100px", position: "relative" }}>
          {/* Eyebrow */}
          <div style={{
            display: "inline-flex", alignItems: "center", gap: "8px",
            background: "rgba(11,110,114,0.25)", border: "1px solid rgba(11,110,114,0.5)",
            borderRadius: "99px", padding: "6px 16px", marginBottom: "32px",
          }}>
            <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#4AE8A0", animation: "ld-pulse 2s infinite" }} />
            <span style={{ fontFamily: "var(--font-outfit-var, sans-serif)", fontSize: "12.5px", fontWeight: 600, color: "#4AE8A0", letterSpacing: "0.06em", textTransform: "uppercase" }}>
              {c.hero_eyebrow}
            </span>
          </div>

          <h1 className="ld-hero-heading" style={{
            fontFamily: "var(--font-lora-var, serif)",
            fontSize: "clamp(2.8rem, 5vw, 4.8rem)",
            fontWeight: 700, color: "#FFFFFF",
            lineHeight: 1.08, letterSpacing: "-0.03em",
            maxWidth: "820px", marginBottom: "28px",
          }}>
            {c.hero_heading.split("\n")[0]}<br />
            <span style={{ color: "#4AE8A0" }}>{c.hero_heading.split("\n")[1] ?? ""}</span>
          </h1>

          <p style={{
            fontFamily: "var(--font-outfit-var, sans-serif)",
            fontSize: "1.15rem", color: "rgba(255,255,255,0.65)",
            lineHeight: 1.7, maxWidth: "560px", marginBottom: "48px",
          }}>
            {c.hero_subheading}
          </p>

          <div style={{ display: "flex", gap: "14px", flexWrap: "wrap" }}>
            <a href="#contacto" style={{
              display: "inline-flex", alignItems: "center", gap: "8px",
              padding: "14px 28px", background: "#FFFFFF", borderRadius: "10px",
              fontFamily: "var(--font-outfit-var, sans-serif)", fontSize: "15px", fontWeight: 700,
              color: "#0B6E72", textDecoration: "none",
              boxShadow: "0 4px 20px rgba(0,0,0,0.2)", transition: "transform 0.15s ease",
            }}>
              {c.hero_cta_principal}
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </a>
            <a href="#solucion" style={{
              display: "inline-flex", alignItems: "center", gap: "8px",
              padding: "14px 28px", background: "rgba(255,255,255,0.08)",
              border: "1px solid rgba(255,255,255,0.18)", borderRadius: "10px",
              fontFamily: "var(--font-outfit-var, sans-serif)", fontSize: "15px", fontWeight: 500,
              color: "rgba(255,255,255,0.85)", textDecoration: "none", transition: "background 0.15s ease",
            }}>
              {c.hero_cta_secundario}
            </a>
          </div>

          {/* Stats strip */}
          <div style={{
            display: "flex", gap: "48px", flexWrap: "wrap",
            marginTop: "72px", paddingTop: "40px",
            borderTop: "1px solid rgba(255,255,255,0.1)",
          }}>
            {[
              { num: "500+", label: "pacientes gestionados" },
              { num: "< 1 día", label: "tiempo de onboarding" },
              { num: "100%", label: "web — sin instalación" },
            ].map(stat => (
              <div key={stat.label}>
                <div style={{ fontFamily: "var(--font-lora-var, serif)", fontSize: "2rem", fontWeight: 700, color: "#FFFFFF", lineHeight: 1 }}>
                  {stat.num}
                </div>
                <div style={{ fontFamily: "var(--font-outfit-var, sans-serif)", fontSize: "13px", color: "rgba(255,255,255,0.45)", marginTop: "6px" }}>
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── EL PROBLEMA ──────────────────────────────────────── */}
      <section id="problema" style={{ background: "#111820", padding: "100px 40px" }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
          <div style={{ marginBottom: "64px" }}>
            <span style={{
              fontFamily: "var(--font-outfit-var, sans-serif)", fontSize: "11px", fontWeight: 700,
              letterSpacing: "0.12em", textTransform: "uppercase", color: "#0F9199",
            }}>
              El problema
            </span>
            <h2 style={{
              fontFamily: "var(--font-lora-var, serif)", fontSize: "clamp(1.8rem, 3vw, 2.8rem)",
              fontWeight: 700, color: "#FFFFFF", marginTop: "12px", lineHeight: 1.15,
              maxWidth: "600px",
            }}>
              {c.problema_heading}
            </h2>
            <p style={{
              fontFamily: "var(--font-outfit-var, sans-serif)", fontSize: "16px",
              color: "rgba(255,255,255,0.5)", marginTop: "16px", maxWidth: "520px", lineHeight: 1.7,
            }}>
              {c.problema_subheading}
            </p>
          </div>

          <div className="ld-problemas-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
            {PROBLEMAS.map(p => (
              <div key={p.titulo} className="ld-problema-card">
                <div style={{
                  width: "44px", height: "44px", borderRadius: "12px",
                  background: "rgba(11,110,114,0.15)", border: "1px solid rgba(11,110,114,0.3)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  color: "#0F9199", marginBottom: "16px",
                }}>
                  {p.icon}
                </div>
                <h3 style={{
                  fontFamily: "var(--font-lora-var, serif)", fontSize: "1.1rem",
                  fontWeight: 700, color: "#FFFFFF", marginBottom: "10px",
                }}>
                  {p.titulo}
                </h3>
                <p style={{
                  fontFamily: "var(--font-outfit-var, sans-serif)", fontSize: "14px",
                  color: "rgba(255,255,255,0.5)", lineHeight: 1.7,
                }}>
                  {p.texto}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── NUESTRA SOLUCIÓN ─────────────────────────────────── */}
      <section id="solucion" style={{ background: "#F5F4F1", padding: "100px 40px" }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "70px" }}>
            <span style={{
              fontFamily: "var(--font-outfit-var, sans-serif)", fontSize: "11px", fontWeight: 700,
              letterSpacing: "0.12em", textTransform: "uppercase", color: "#0B6E72",
            }}>
              Nuestra solución
            </span>
            <h2 style={{
              fontFamily: "var(--font-lora-var, serif)", fontSize: "clamp(1.8rem, 3vw, 2.8rem)",
              fontWeight: 700, color: "#1C1917", marginTop: "12px", lineHeight: 1.15,
            }}>
              {c.solucion_heading}
            </h2>
            <p style={{
              fontFamily: "var(--font-outfit-var, sans-serif)", fontSize: "16px",
              color: "#78716C", marginTop: "16px", maxWidth: "540px", margin: "16px auto 0", lineHeight: 1.7,
            }}>
              {c.solucion_subheading}
            </p>
          </div>

          <div className="ld-features-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "24px" }}>
            {[
              {
                icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 21V9"/></svg>,
                titulo: "Panel unificado",
                texto: "Todos tus pacientes en un solo lugar, ordenados por estado. Sabe quién está esperando, quién fue atendido y quién necesita seguimiento.",
              },
              {
                icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
                titulo: "Roles diferenciados",
                texto: "El médico ve su cuadro clínico completo. La asistenta gestiona la agenda y el seguimiento. Cada uno con lo que necesita, nada de más.",
              },
              {
                icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>,
                titulo: "Automatizaciones",
                texto: "Envío de mensajes automáticos a pacientes según su estado. Nunca más se pierda un paciente por falta de seguimiento.",
              },
              {
                icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>,
                titulo: "Reportes y embudos",
                texto: "Visualiza cómo fluyen tus pacientes por el proceso. Identifica cuellos de botella y optimiza tu conversión.",
              },
              {
                icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>,
                titulo: "Notas clínicas",
                texto: "Historial completo de cada paciente con timeline de sesiones, notas y cambios de estado. Todo en contexto.",
              },
              {
                icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><rect x="5" y="2" width="14" height="20" rx="2" ry="2"/><line x1="12" y1="18" x2="12.01" y2="18"/></svg>,
                titulo: "100% web, en cualquier dispositivo",
                texto: "Sin instalaciones. Sin actualizaciones manuales. Funciona desde el computador de la clínica o desde tu celular.",
              },
            ].map(feat => (
              <div key={feat.titulo} style={{
                background: "#FFFFFF", borderRadius: "16px",
                border: "1px solid rgba(0,0,0,0.07)", padding: "28px",
                boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
                display: "flex", flexDirection: "column", height: "260px",
              }}>
                <div style={{
                  width: "42px", height: "42px", borderRadius: "10px",
                  background: "#E2F4F5", display: "flex", alignItems: "center", justifyContent: "center",
                  color: "#0B6E72", marginBottom: "18px",
                }}>
                  {feat.icon}
                </div>
                <h3 style={{
                  fontFamily: "var(--font-lora-var, serif)", fontSize: "1rem",
                  fontWeight: 700, color: "#1C1917", marginBottom: "10px",
                }}>
                  {feat.titulo}
                </h3>
                <p style={{
                  fontFamily: "var(--font-outfit-var, sans-serif)", fontSize: "14px",
                  color: "#78716C", lineHeight: 1.7,
                }}>
                  {feat.texto}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PLANES ───────────────────────────────────────────── */}
      <section id="planes" style={{ background: "#111820", padding: "100px 40px" }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "64px" }}>
            <span style={{
              fontFamily: "var(--font-outfit-var, sans-serif)", fontSize: "11px", fontWeight: 700,
              letterSpacing: "0.12em", textTransform: "uppercase", color: "#0F9199",
            }}>
              Planes
            </span>
            <h2 style={{
              fontFamily: "var(--font-lora-var, serif)", fontSize: "clamp(1.8rem, 3vw, 2.8rem)",
              fontWeight: 700, color: "#FFFFFF", marginTop: "12px", lineHeight: 1.15,
            }}>
              {c.planes_heading}
            </h2>
            <p style={{
              fontFamily: "var(--font-outfit-var, sans-serif)", fontSize: "16px",
              color: "rgba(255,255,255,0.45)", marginTop: "14px",
            }}>
              {c.planes_subheading}
            </p>
          </div>

          <div className="ld-plans-grid" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "20px", alignItems: "stretch", paddingTop: "16px" }}>
            {PLANES.map(plan => (
              <div key={plan.nombre} style={{ position: "relative", height: "100%" }}>
                {plan.destacado && (
                  <div style={{
                    position: "absolute", top: "-14px", left: "50%", transform: "translateX(-50%)",
                    display: "inline-flex", alignItems: "center", gap: "6px",
                    background: "#4AE8A0", borderRadius: "99px",
                    padding: "4px 14px", whiteSpace: "nowrap", zIndex: 1,
                  }}>
                    <span style={{ fontFamily: "var(--font-outfit-var, sans-serif)", fontSize: "11px", fontWeight: 700, color: "#074F52", letterSpacing: "0.06em", textTransform: "uppercase" }}>
                      Más popular
                    </span>
                  </div>
                )}
                <div className={`ld-plan-card${plan.destacado ? " destacado" : ""}`}
                  style={plan.destacado ? {
                    background: "#0B6E72", borderColor: "#074F52", borderRadius: "18px",
                    padding: "32px", display: "flex", flexDirection: "column", gap: "24px",
                    height: "100%", boxSizing: "border-box",
                    boxShadow: "0 20px 60px rgba(11,110,114,0.4)",
                    transform: "scale(1.03)",
                  } : undefined}
                >
                <div>
                  <div style={{
                    fontFamily: "var(--font-outfit-var, sans-serif)", fontSize: "12px", fontWeight: 700,
                    letterSpacing: "0.08em", textTransform: "uppercase",
                    color: plan.destacado ? "rgba(255,255,255,0.6)" : "#9B9188",
                    marginBottom: "8px",
                  }}>
                    {plan.nombre}
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                    <span style={{
                      fontFamily: "var(--font-lora-var, serif)", fontSize: "2rem", fontWeight: 700,
                      color: plan.destacado ? "#FFFFFF" : "#1C1917", lineHeight: 1,
                    }}>
                      {plan.precio}
                    </span>
                    {plan.periodo && (
                      <span style={{
                        fontFamily: "var(--font-outfit-var, sans-serif)", fontSize: "12px",
                        color: plan.destacado ? "rgba(255,255,255,0.55)" : "#9B9188",
                        letterSpacing: "0.02em",
                      }}>
                        {plan.periodo.trim()}
                      </span>
                    )}
                  </div>
                  <p style={{
                    fontFamily: "var(--font-outfit-var, sans-serif)", fontSize: "13px",
                    color: plan.destacado ? "rgba(255,255,255,0.6)" : "#78716C",
                    marginTop: "8px",
                  }}>
                    {plan.descripcion}
                  </p>
                </div>

                <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "10px", flex: "1 1 auto" }}>
                  {plan.features.map(f => (
                    <li key={f} style={{ display: "flex", alignItems: "flex-start", gap: "10px" }}>
                      <div className="ld-feature-check" style={{
                        background: plan.destacado ? "rgba(255,255,255,0.2)" : "#E2F4F5",
                        marginTop: "1px",
                      }}>
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke={plan.destacado ? "#FFFFFF" : "#0B6E72"} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="20 6 9 17 4 12"/>
                        </svg>
                      </div>
                      <span style={{
                        fontFamily: "var(--font-outfit-var, sans-serif)", fontSize: "13.5px",
                        color: plan.destacado ? "rgba(255,255,255,0.85)" : "#44403C",
                        lineHeight: 1.5,
                      }}>
                        {f}
                      </span>
                    </li>
                  ))}
                </ul>

                <a href="#contacto" style={{
                  display: "block", textAlign: "center",
                  padding: "11px 20px", borderRadius: "10px",
                  fontFamily: "var(--font-outfit-var, sans-serif)", fontSize: "14px", fontWeight: 600,
                  textDecoration: "none", transition: "all 0.15s ease",
                  background: plan.destacado ? "#FFFFFF" : "transparent",
                  color: plan.destacado ? "#0B6E72" : "#0B6E72",
                  border: plan.destacado ? "none" : "1.5px solid #0B6E72",
                }}>
                  {plan.nombre === "Personalizado" ? "Conversemos" : "Comenzar"}
                </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── ELIZABETH MILLA ──────────────────────────────────── */}
      <section id="equipo" style={{ background: "#F5F4F1", padding: "100px 40px" }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
          <div className="ld-elizabeth-grid" style={{ display: "flex", gap: "80px", alignItems: "center" }}>
            {/* Text */}
            <div style={{ flex: 1 }}>
              <span style={{
                fontFamily: "var(--font-outfit-var, sans-serif)", fontSize: "11px", fontWeight: 700,
                letterSpacing: "0.12em", textTransform: "uppercase", color: "#0B6E72",
              }}>
                Quién está detrás
              </span>
              <h2 style={{
                fontFamily: "var(--font-lora-var, serif)", fontSize: "clamp(1.7rem, 2.5vw, 2.4rem)",
                fontWeight: 700, color: "#1C1917", marginTop: "14px", lineHeight: 1.15, marginBottom: "24px",
              }}>
                {c.elizabeth_heading}
              </h2>
              <p style={{
                fontFamily: "var(--font-outfit-var, sans-serif)", fontSize: "15.5px",
                color: "#44403C", lineHeight: 1.8, marginBottom: "20px",
              }}>
                {c.elizabeth_parrafo1}
              </p>
              <p style={{
                fontFamily: "var(--font-outfit-var, sans-serif)", fontSize: "15.5px",
                color: "#44403C", lineHeight: 1.8, marginBottom: "20px",
              }}>
                {c.elizabeth_parrafo2}
              </p>
              <p style={{
                fontFamily: "var(--font-outfit-var, sans-serif)", fontSize: "15.5px",
                color: "#44403C", lineHeight: 1.8,
              }}>
                {c.elizabeth_parrafo3}
              </p>
              <div style={{
                marginTop: "32px", display: "flex", alignItems: "center", gap: "14px",
                padding: "20px 24px", background: "#FFFFFF", borderRadius: "14px",
                border: "1px solid rgba(0,0,0,0.07)",
              }}>
                <div style={{
                  width: "48px", height: "48px", borderRadius: "50%",
                  background: "linear-gradient(135deg, #0B6E72, #0F9199)",
                  display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                }}>
                  <span style={{ fontFamily: "var(--font-lora-var, serif)", fontSize: "1.2rem", fontWeight: 700, color: "#FFFFFF" }}>E</span>
                </div>
                <div>
                  <div style={{ fontFamily: "var(--font-lora-var, serif)", fontSize: "15px", fontWeight: 700, color: "#1C1917" }}>
                    Elizabeth Milla
                  </div>
                  <div style={{ fontFamily: "var(--font-outfit-var, sans-serif)", fontSize: "13px", color: "#78716C", marginTop: "2px" }}>
                    COO · Enfermera · Fundadora
                  </div>
                </div>
              </div>
            </div>

            {/* Visual card */}
            <div style={{ flexShrink: 0, width: "380px" }}>
              <div style={{
                background: "linear-gradient(160deg, #0B6E72 0%, #074F52 100%)",
                borderRadius: "20px", padding: "40px",
                boxShadow: "0 24px 64px rgba(11,110,114,0.25)",
              }}>
                <div style={{
                  fontFamily: "var(--font-lora-var, serif)", fontSize: "3.5rem",
                  fontWeight: 700, color: "rgba(255,255,255,0.15)", lineHeight: 1,
                  marginBottom: "16px",
                }}>
                  "
                </div>
                <p style={{
                  fontFamily: "var(--font-lora-var, serif)", fontSize: "1.1rem",
                  color: "rgba(255,255,255,0.9)", lineHeight: 1.65, marginBottom: "28px",
                }}>
                  {c.elizabeth_cita}
                </p>
                <div style={{ borderTop: "1px solid rgba(255,255,255,0.15)", paddingTop: "20px" }}>
                  <div style={{ fontFamily: "var(--font-outfit-var, sans-serif)", fontSize: "13px", color: "rgba(255,255,255,0.6)" }}>
                    Experiencia real detrás de cada decisión de diseño
                  </div>
                  <div style={{ display: "flex", gap: "8px", marginTop: "16px", flexWrap: "wrap" }}>
                    {["10+ años en consultas", "500+ pacientes gestionados", "Múltiples especialidades"].map(tag => (
                      <span key={tag} style={{
                        fontFamily: "var(--font-outfit-var, sans-serif)", fontSize: "11.5px", fontWeight: 600,
                        background: "rgba(255,255,255,0.12)", border: "1px solid rgba(255,255,255,0.2)",
                        borderRadius: "99px", padding: "4px 12px", color: "rgba(255,255,255,0.8)",
                      }}>
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── BENEFICIOS TANGIBLES ─────────────────────────────── */}
      <section style={{ background: "#111820", padding: "100px 40px" }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "64px" }}>
            <span style={{
              fontFamily: "var(--font-outfit-var, sans-serif)", fontSize: "11px", fontWeight: 700,
              letterSpacing: "0.12em", textTransform: "uppercase", color: "#0F9199",
            }}>
              Resultados reales
            </span>
            <h2 style={{
              fontFamily: "var(--font-lora-var, serif)", fontSize: "clamp(1.8rem, 3vw, 2.8rem)",
              fontWeight: 700, color: "#FFFFFF", marginTop: "12px", lineHeight: 1.15,
            }}>
              {c.beneficios_heading}
            </h2>
          </div>

          <div className="ld-beneficios-grid" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "24px" }}>
            {BENEFICIOS.map(b => (
              <div key={b.label} style={{
                background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: "16px", padding: "32px 24px", textAlign: "center",
              }}>
                <div style={{
                  fontFamily: "var(--font-lora-var, serif)", fontSize: "clamp(2rem, 3vw, 3rem)",
                  fontWeight: 700, color: "#4AE8A0", lineHeight: 1, marginBottom: "12px",
                }}>
                  {b.num}
                </div>
                <div style={{
                  fontFamily: "var(--font-outfit-var, sans-serif)", fontSize: "14px",
                  color: "rgba(255,255,255,0.5)", lineHeight: 1.5,
                }}>
                  {b.label}
                </div>
              </div>
            ))}
          </div>

          {/* Feature list */}
          <div style={{
            marginTop: "60px", background: "rgba(11,110,114,0.08)", border: "1px solid rgba(11,110,114,0.2)",
            borderRadius: "18px", padding: "40px",
            display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "24px",
          }}>
            {[
              "Seguimiento por estados",
              "Roles para médico y asistenta",
              "Timeline de paciente",
              "Notas clínicas",
              "Automatizaciones",
              "Reportes y embudos",
              "Multiusuario",
              "Soporte humano",
            ].map(f => (
              <div key={f} style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#0F9199" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
                <span style={{ fontFamily: "var(--font-outfit-var, sans-serif)", fontSize: "14px", color: "rgba(255,255,255,0.7)" }}>
                  {f}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA FINAL / CONTACTO ─────────────────────────────── */}
      <section id="contacto" style={{
        background: "linear-gradient(160deg, #074F52 0%, #0B6E72 50%, #0F191C 100%)",
        padding: "100px 40px", position: "relative", overflow: "hidden",
      }}>
        <div style={{
          position: "absolute", inset: 0, pointerEvents: "none",
          backgroundImage: "linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }} />

        <div style={{ maxWidth: "900px", margin: "0 auto", position: "relative" }}>
          <div style={{ textAlign: "center", marginBottom: "60px" }}>
            <span style={{
              fontFamily: "var(--font-outfit-var, sans-serif)", fontSize: "11px", fontWeight: 700,
              letterSpacing: "0.12em", textTransform: "uppercase", color: "rgba(255,255,255,0.5)",
            }}>
              Empieza hoy
            </span>
            <h2 style={{
              fontFamily: "var(--font-lora-var, serif)", fontSize: "clamp(2rem, 4vw, 3.2rem)",
              fontWeight: 700, color: "#FFFFFF", marginTop: "14px", lineHeight: 1.1,
            }}>
              {c.cta_heading}
            </h2>
            <p style={{
              fontFamily: "var(--font-outfit-var, sans-serif)", fontSize: "16px",
              color: "rgba(255,255,255,0.55)", marginTop: "18px", maxWidth: "500px", margin: "18px auto 0", lineHeight: 1.7,
            }}>
              {c.cta_subheading}
            </p>
          </div>

          <div style={{
            background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: "20px", padding: "48px",
            backdropFilter: "blur(10px)",
          }}>
            <ContactForm />
          </div>
        </div>
      </section>

      {/* ── FOOTER ───────────────────────────────────────────── */}
      <footer style={{
        background: "#0F191C", borderTop: "1px solid rgba(255,255,255,0.06)",
        padding: "32px 40px",
        display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "16px",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div style={{
            width: "28px", height: "28px", borderRadius: "7px",
            background: "#0B6E72", display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.9)" strokeWidth="2.5" strokeLinecap="round">
              <path d="M22 12h-4l-3 9L9 3l-3 9H2"/>
            </svg>
          </div>
          <span style={{ fontFamily: "var(--font-lora-var, serif)", fontSize: "14px", fontWeight: 700, color: "rgba(255,255,255,0.7)" }}>
            Óptima Assist
          </span>
        </div>
        <div style={{ fontFamily: "var(--font-outfit-var, sans-serif)", fontSize: "13px", color: "rgba(255,255,255,0.3)" }}>
          © 2026 Óptima Assist. Todos los derechos reservados.
        </div>
        <Link href="/login" style={{
          fontFamily: "var(--font-outfit-var, sans-serif)", fontSize: "13px",
          color: "rgba(255,255,255,0.4)", textDecoration: "none", transition: "color 0.15s",
        }}>
          Acceso clientes →
        </Link>
      </footer>
    </>
  );
}
