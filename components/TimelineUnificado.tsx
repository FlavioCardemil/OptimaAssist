"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import type { Automatizacion, EstadoPaciente, EstadoAutomatizacion } from "@/lib/types";
import { describir, emojiTipo, ESTADO_AUTO_CONFIG } from "@/lib/automatizaciones";
import { eliminarAutomatizacion, actualizarEstadoAutomatizacion } from "@/app/actions/automatizaciones";
import ModalAutomatizacion from "./ModalAutomatizacion";
import ModalNota from "./ModalNota";

const ESTADO_STYLE: Record<EstadoPaciente, { bg: string; color: string }> = {
  contactando: { bg: "#EFF6FF", color: "#1D4ED8" },
  agendado:    { bg: "#F5F3FF", color: "#6D28D9" },
  atendido:    { bg: "#ECFDF5", color: "#047857" },
  esperando:   { bg: "#FFFBEB", color: "#B45309" },
  completo:    { bg: "#F0FDFA", color: "#0F766E" },
  abandono:    { bg: "#FFF1F2", color: "#BE123C" },
  recuperado:  { bg: "#FFF7ED", color: "#C2410C" },
};

const ESTADO_LABEL: Record<EstadoPaciente, string> = {
  contactando: "Contactando",
  agendado:    "Agendado",
  atendido:    "Atendido",
  esperando:   "Esperando",
  completo:    "Completo",
  abandono:    "Abandono",
  recuperado:  "Recuperado",
};

interface SesionTimeline {
  id: string;
  estado: string;
  fecha: string;
  nota: string | null;
}

interface Props {
  pacienteId: string;
  sesiones: SesionTimeline[];
  automatizaciones: Automatizacion[];
}

type Evento =
  | { tipo: "estado"; id: string; fecha: string; estado: EstadoPaciente; nota: string | null }
  | { tipo: "nota"; id: string; fecha: string; texto: string }
  | { tipo: "automatizacion"; auto: Automatizacion };

function formatFecha(iso: string) {
  return new Date(iso).toLocaleDateString("es-CL", { day: "numeric", month: "short", year: "numeric" });
}

export default function TimelineUnificado({ pacienteId, sesiones, automatizaciones: inicial }: Props) {
  const router = useRouter();
  const [listaAutos, setListaAutos] = useState(inicial);
  const [modalAutoAbierto, setModalAutoAbierto] = useState(false);
  const [modalNotaAbierto, setModalNotaAbierto] = useState(false);

  const eventos: Evento[] = [
    ...sesiones
      .filter((s) => s.estado !== "nota")
      .map((s) => ({ tipo: "estado" as const, id: s.id, fecha: s.fecha, estado: s.estado as EstadoPaciente, nota: s.nota })),
    ...sesiones
      .filter((s) => s.estado === "nota")
      .map((s) => ({ tipo: "nota" as const, id: s.id, fecha: s.fecha, texto: s.nota ?? "" })),
    ...listaAutos.map((a) => ({ tipo: "automatizacion" as const, auto: a })),
  ].sort((a, b) => {
    const fa = a.tipo === "automatizacion" ? a.auto.created_at : a.fecha;
    const fb = b.tipo === "automatizacion" ? b.auto.created_at : b.fecha;
    return new Date(fb).getTime() - new Date(fa).getTime();
  });

  const primerEstadoId = eventos.find((e) => e.tipo === "estado")?.id ?? null;

  return (
    <>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "20px" }}>
        <div>
          <h3 style={{ fontFamily: "var(--font-lora-var, serif)", fontSize: "1rem", fontWeight: 700, color: "#1C1917" }}>
            Línea de tiempo
          </h3>
          <p style={{ fontFamily: "var(--font-outfit-var, sans-serif)", fontSize: "12px", color: "#9B9188", marginTop: "2px" }}>
            Historial completo del paciente
          </p>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <button
            onClick={() => setModalNotaAbierto(true)}
            className="om-btn om-btn-ghost"
            style={{ fontSize: "12px", padding: "6px 12px" }}
          >
            📝 Agregar nota
          </button>
          <button
            onClick={() => setModalAutoAbierto(true)}
            className="om-btn om-btn-primary"
            style={{ fontSize: "12px", padding: "6px 12px" }}
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            Nueva automatización
          </button>
        </div>
      </div>

      {/* Timeline */}
      {eventos.length === 0 ? (
        <div style={{ textAlign: "center", padding: "40px 20px", border: "2px dashed #E7E5E0", borderRadius: "12px" }}>
          <p style={{ fontFamily: "var(--font-outfit-var, sans-serif)", color: "#9B9188", fontSize: "14px" }}>Sin actividad registrada</p>
          <p style={{ fontFamily: "var(--font-outfit-var, sans-serif)", color: "#D6D3D1", fontSize: "12px", marginTop: "4px" }}>
            Los estados, notas y automatizaciones aparecerán aquí
          </p>
        </div>
      ) : (
        <ol style={{ position: "relative", borderLeft: "2px solid #F0EFEB", marginLeft: "8px", paddingLeft: "0" }}>
          {eventos.map((evento, i) => {
            const isLast = i === eventos.length - 1;
            if (evento.tipo === "estado") {
              return <EventoEstado key={evento.id} evento={evento} esActual={evento.id === primerEstadoId} isLast={isLast} />;
            }
            if (evento.tipo === "nota") {
              return <EventoNota key={evento.id} evento={evento} isLast={isLast} />;
            }
            return (
              <EventoAutomatizacion
                key={evento.auto.id}
                auto={evento.auto}
                isLast={isLast}
                onEliminar={(id) => { setListaAutos((prev) => prev.filter((x) => x.id !== id)); eliminarAutomatizacion(id); }}
                onEstado={(id, estado) => { setListaAutos((prev) => prev.map((x) => (x.id === id ? { ...x, estado } : x))); actualizarEstadoAutomatizacion(id, estado); }}
              />
            );
          })}
        </ol>
      )}

      <ModalAutomatizacion
        abierto={modalAutoAbierto}
        onCerrar={() => setModalAutoAbierto(false)}
        onGuardado={() => { setModalAutoAbierto(false); router.refresh(); }}
        pacienteId={pacienteId}
      />
      <ModalNota
        abierto={modalNotaAbierto}
        onCerrar={() => setModalNotaAbierto(false)}
        onGuardado={() => router.refresh()}
        pacienteId={pacienteId}
      />
    </>
  );
}

function EventoEstado({ evento, esActual, isLast }: {
  evento: Extract<Evento, { tipo: "estado" }>;
  esActual: boolean;
  isLast: boolean;
}) {
  const st = ESTADO_STYLE[evento.estado];
  const label = ESTADO_LABEL[evento.estado];

  return (
    <li style={{ marginLeft: "20px", paddingBottom: isLast ? 0 : "18px" }}>
      <span style={{ position: "absolute", left: "-9px", width: "16px", height: "16px", borderRadius: "50%", background: st.bg, border: `2px solid ${st.color}`, display: "block" }} />
      <div style={{ background: "#FFFFFF", borderRadius: "10px", border: "1px solid rgba(0,0,0,0.07)", padding: "12px 14px" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "8px", flexWrap: "wrap" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "6px", flexWrap: "wrap" }}>
            <span style={{ display: "inline-flex", alignItems: "center", padding: "3px 10px", borderRadius: "999px", background: st.bg, color: st.color, fontSize: "11.5px", fontWeight: 600, fontFamily: "var(--font-outfit-var, sans-serif)" }}>
              {label}
            </span>
            {esActual && (
              <span style={{ display: "inline-flex", alignItems: "center", padding: "3px 8px", borderRadius: "999px", background: "#1C1917", color: "#FFFFFF", fontSize: "10.5px", fontWeight: 600, fontFamily: "var(--font-outfit-var, sans-serif)" }}>
                actual
              </span>
            )}
          </div>
          <time style={{ fontFamily: "var(--font-outfit-var, sans-serif)", fontSize: "11.5px", color: "#B0A89F" }}>{formatFecha(evento.fecha)}</time>
        </div>
        {evento.nota && (
          <p style={{ marginTop: "8px", fontFamily: "var(--font-outfit-var, sans-serif)", fontSize: "12.5px", color: "#44403C", background: "#FAFAF9", borderRadius: "8px", padding: "8px 12px", lineHeight: 1.6 }}>
            {evento.nota}
          </p>
        )}
      </div>
    </li>
  );
}

function EventoNota({ evento, isLast }: { evento: Extract<Evento, { tipo: "nota" }>; isLast: boolean }) {
  return (
    <li style={{ marginLeft: "20px", paddingBottom: isLast ? 0 : "18px" }}>
      <span style={{ position: "absolute", left: "-9px", width: "16px", height: "16px", borderRadius: "50%", background: "#FFFBEB", border: "2px solid #D97706", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "8px" }}>📝</span>
      <div style={{ background: "#FFFFFF", borderRadius: "10px", border: "1px solid rgba(0,0,0,0.07)", padding: "12px 14px" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "6px" }}>
          <span style={{ fontFamily: "var(--font-outfit-var, sans-serif)", fontSize: "12px", fontWeight: 600, color: "#78716C" }}>Nota clínica</span>
          <time style={{ fontFamily: "var(--font-outfit-var, sans-serif)", fontSize: "11.5px", color: "#B0A89F" }}>{formatFecha(evento.fecha)}</time>
        </div>
        <p style={{ fontFamily: "var(--font-outfit-var, sans-serif)", fontSize: "12.5px", color: "#44403C", lineHeight: 1.6, whiteSpace: "pre-wrap" }}>{evento.texto}</p>
      </div>
    </li>
  );
}

function EventoAutomatizacion({ auto: a, isLast, onEliminar, onEstado }: {
  auto: Automatizacion;
  isLast: boolean;
  onEliminar: (id: string) => void;
  onEstado: (id: string, estado: EstadoAutomatizacion) => void;
}) {
  const [isPending, startTransition] = useTransition();
  const estadoConfig = ESTADO_AUTO_CONFIG[a.estado];
  const descripcion = describir(a.tipo, a.configuracion);
  const emoji = emojiTipo(a.tipo);

  const ESTADOS_ORDEN: EstadoAutomatizacion[] = ["pendiente", "enviado", "completado"];

  return (
    <li style={{ marginLeft: "20px", paddingBottom: isLast ? 0 : "18px", opacity: isPending ? 0.5 : 1 }}>
      <span style={{ position: "absolute", left: "-10px", width: "18px", height: "18px", borderRadius: "50%", background: "#F5F4F1", border: "2px solid #E7E5E0", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "9px" }}>
        {emoji}
      </span>
      <div style={{ background: "#FFFFFF", borderRadius: "10px", border: "1px solid rgba(0,0,0,0.07)", padding: "12px 14px" }}>
        <div style={{ display: "flex", alignItems: "flex-start", gap: "10px" }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <p style={{ fontFamily: "var(--font-outfit-var, sans-serif)", fontSize: "13px", fontWeight: 500, color: "#1C1917", lineHeight: 1.4 }}>{descripcion}</p>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginTop: "6px", flexWrap: "wrap" }}>
              <select
                value={a.estado}
                onChange={(e) => startTransition(() => onEstado(a.id, e.target.value as EstadoAutomatizacion))}
                disabled={isPending}
                style={{
                  fontFamily: "var(--font-outfit-var, sans-serif)",
                  fontSize: "11.5px",
                  fontWeight: 600,
                  padding: "3px 10px",
                  borderRadius: "999px",
                  border: "none",
                  cursor: "pointer",
                  background: estadoConfig.bgHex,
                  color: estadoConfig.colorHex,
                  outline: "none",
                }}
              >
                {ESTADOS_ORDEN.map((e) => (
                  <option key={e} value={e}>{ESTADO_AUTO_CONFIG[e].label}</option>
                ))}
              </select>
              <span style={{ fontFamily: "var(--font-outfit-var, sans-serif)", fontSize: "11.5px", color: "#B0A89F" }}>{formatFecha(a.created_at)}</span>
            </div>
          </div>
          <button
            onClick={() => startTransition(() => onEliminar(a.id))}
            disabled={isPending}
            title="Eliminar automatización"
            style={{ flexShrink: 0, padding: "5px", borderRadius: "6px", background: "transparent", border: "none", cursor: "pointer", color: "#D6D3D1", transition: "all 0.1s ease" }}
            onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = "#FFF1F2"; (e.currentTarget as HTMLButtonElement).style.color = "#BE123C"; }}
            onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = "transparent"; (e.currentTarget as HTMLButtonElement).style.color = "#D6D3D1"; }}
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <polyline points="3 6 5 6 21 6"/>
              <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
              <path d="M10 11v6"/><path d="M14 11v6"/>
              <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
            </svg>
          </button>
        </div>
      </div>
    </li>
  );
}
