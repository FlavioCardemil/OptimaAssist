"use client";

import { useEffect, useState, useTransition } from "react";
import type { TipoAutomatizacion, UnidadTiempo, ModoEspecialista } from "@/lib/types";
import { ESPECIALIDADES, calcularFecha, toISODate, describir, emojiTipo } from "@/lib/automatizaciones";
import { crearAutomatizacion } from "@/app/actions/automatizaciones";

interface Props {
  abierto: boolean;
  onCerrar: () => void;
  onGuardado: () => void;
  pacienteId: string;
}

const TIPOS: { tipo: TipoAutomatizacion; label: string; desc: string }[] = [
  { tipo: "volver_en",           label: "Volver en tiempo",  desc: "En X días, semanas o meses" },
  { tipo: "volver_fecha",        label: "Volver en fecha",   desc: "Fecha exacta de regreso" },
  { tipo: "tomar_examen",        label: "Tomar examen",      desc: "Uno o más exámenes" },
  { tipo: "visitar_especialista",label: "Ver especialista",  desc: "Por tipo o nombre" },
];

export default function ModalAutomatizacion({ abierto, onCerrar, onGuardado, pacienteId }: Props) {
  const [tipo, setTipo] = useState<TipoAutomatizacion>("volver_en");
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const [cantidad, setCantidad] = useState(2);
  const [unidad, setUnidad] = useState<UnidadTiempo>("semanas");
  const [fechaExacta, setFechaExacta] = useState("");
  const [examenes, setExamenes] = useState(["", ""]);
  const [modo, setModo] = useState<ModoEspecialista>("tipo");
  const [especialidad, setEspecialidad] = useState(ESPECIALIDADES[0]);
  const [nombreEsp, setNombreEsp] = useState("");
  const [apellidoEsp, setApellidoEsp] = useState("");
  const [telefonoEsp, setTelefonoEsp] = useState("");
  const [emailEsp, setEmailEsp] = useState("");

  useEffect(() => {
    if (abierto) {
      setTipo("volver_en"); setCantidad(2); setUnidad("semanas"); setFechaExacta("");
      setExamenes(["", ""]); setModo("tipo"); setEspecialidad(ESPECIALIDADES[0]);
      setNombreEsp(""); setApellidoEsp(""); setTelefonoEsp(""); setEmailEsp(""); setError(null);
    }
  }, [abierto]);

  useEffect(() => {
    function handleEsc(e: KeyboardEvent) { if (e.key === "Escape") onCerrar(); }
    if (abierto) document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, [abierto, onCerrar]);

  function buildConfig(): Record<string, unknown> {
    switch (tipo) {
      case "volver_en":
        return { cantidad, unidad, fecha_calculada: toISODate(calcularFecha(cantidad, unidad)) };
      case "volver_fecha":
        return { fecha: fechaExacta };
      case "tomar_examen":
        return { examenes: examenes.filter(Boolean) };
      case "visitar_especialista":
        return modo === "tipo"
          ? { modo, especialidad }
          : { modo, nombre: nombreEsp.trim(), apellido: apellidoEsp.trim(), telefono: telefonoEsp.trim() || undefined, email: emailEsp.trim() || undefined };
    }
  }

  function validar(): string | null {
    if (tipo === "volver_en" && cantidad < 1) return "La cantidad debe ser al menos 1";
    if (tipo === "volver_fecha" && !fechaExacta) return "Selecciona una fecha";
    if (tipo === "tomar_examen" && !examenes.some(Boolean)) return "Agrega al menos un examen";
    if (tipo === "visitar_especialista" && modo === "nombre" && !nombreEsp.trim()) return "Ingresa el nombre del especialista";
    return null;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const err = validar();
    if (err) { setError(err); return; }
    setError(null);
    startTransition(async () => {
      const result = await crearAutomatizacion(pacienteId, tipo, buildConfig());
      if (result.error) { setError(result.error); return; }
      onGuardado(); onCerrar();
    });
  }

  const previewConfig = buildConfig();
  const previewText = describir(tipo, previewConfig);

  if (!abierto) return null;

  return (
    <div className="om-modal-overlay" onClick={onCerrar}>
      <div className="om-modal" style={{ maxWidth: "520px" }} onClick={(e) => e.stopPropagation()}>
        <div className="om-modal-header">
          <div>
            <h2 style={{ fontFamily: "var(--font-lora-var, serif)", fontSize: "1.2rem", fontWeight: 700, color: "#1C1917", letterSpacing: "-0.01em" }}>
              Nueva automatización
            </h2>
            <p style={{ fontFamily: "var(--font-outfit-var, sans-serif)", fontSize: "13px", color: "#9B9188", marginTop: "3px" }}>
              Selecciona el tipo y configura los parámetros
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
          <div className="om-modal-body" style={{ maxHeight: "60vh", overflowY: "auto" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>

              {/* Selector de tipo */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
                {TIPOS.map((t) => (
                  <button
                    key={t.tipo}
                    type="button"
                    onClick={() => setTipo(t.tipo)}
                    style={{
                      textAlign: "left",
                      padding: "12px",
                      borderRadius: "10px",
                      border: `2px solid ${tipo === t.tipo ? "#0B6E72" : "#E7E5E0"}`,
                      background: tipo === t.tipo ? "#F0FAFA" : "#FAFAF9",
                      cursor: "pointer",
                      transition: "all 0.1s ease",
                    }}
                  >
                    <p style={{ fontSize: "17px", marginBottom: "4px" }}>{emojiTipo(t.tipo)}</p>
                    <p style={{ fontFamily: "var(--font-outfit-var, sans-serif)", fontSize: "12.5px", fontWeight: 600, color: tipo === t.tipo ? "#0B6E72" : "#1C1917" }}>{t.label}</p>
                    <p style={{ fontFamily: "var(--font-outfit-var, sans-serif)", fontSize: "11px", color: "#9B9188", marginTop: "2px" }}>{t.desc}</p>
                  </button>
                ))}
              </div>

              {/* Formulario por tipo */}
              <div>
                {tipo === "volver_en" && <FormVolverEn cantidad={cantidad} onCantidad={setCantidad} unidad={unidad} onUnidad={setUnidad} />}
                {tipo === "volver_fecha" && <FormVolverFecha fecha={fechaExacta} onFecha={setFechaExacta} />}
                {tipo === "tomar_examen" && <FormTomarExamen examenes={examenes} onExamenes={setExamenes} />}
                {tipo === "visitar_especialista" && (
                  <FormVisitarEspecialista modo={modo} onModo={setModo} especialidad={especialidad} onEspecialidad={setEspecialidad}
                    nombre={nombreEsp} onNombre={setNombreEsp} apellido={apellidoEsp} onApellido={setApellidoEsp}
                    telefono={telefonoEsp} onTelefono={setTelefonoEsp} email={emailEsp} onEmail={setEmailEsp} />
                )}
              </div>

              {/* Preview */}
              <div style={{ background: "#F5F4F1", borderRadius: "10px", padding: "12px 14px", border: "1px solid #E7E5E0" }}>
                <p style={{ fontFamily: "var(--font-outfit-var, sans-serif)", fontSize: "11px", fontWeight: 600, color: "#9B9188", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "4px" }}>Vista previa</p>
                <p style={{ fontFamily: "var(--font-outfit-var, sans-serif)", fontSize: "13.5px", color: "#1C1917" }}>
                  <span style={{ marginRight: "6px" }}>{emojiTipo(tipo)}</span>
                  {previewText}
                </p>
              </div>

              {error && <div className="om-error-msg">{error}</div>}
            </div>
          </div>

          <div className="om-modal-footer">
            <button type="button" onClick={onCerrar} disabled={isPending} className="om-btn om-btn-ghost">Cancelar</button>
            <button type="submit" disabled={isPending} className="om-btn om-btn-primary">
              {isPending ? "Guardando…" : "Guardar automatización"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ── Sub-formularios ───────────────────────────────────────────────────────────

function FormVolverEn({ cantidad, onCantidad, unidad, onUnidad }: {
  cantidad: number; onCantidad: (n: number) => void;
  unidad: UnidadTiempo; onUnidad: (u: UnidadTiempo) => void;
}) {
  const fechaCalc = calcularFecha(cantidad, unidad);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
      <label className="om-label">Tiempo de seguimiento</label>
      <div style={{ display: "flex", gap: "8px" }}>
        <input
          type="number" min={1} max={999} value={cantidad}
          onChange={(e) => onCantidad(Math.max(1, parseInt(e.target.value) || 1))}
          className="om-input" style={{ width: "90px", textAlign: "center", fontWeight: 600 }}
        />
        <select value={unidad} onChange={(e) => onUnidad(e.target.value as UnidadTiempo)} className="om-input" style={{ flex: 1, cursor: "pointer" }}>
          <option value="dias">Días</option>
          <option value="semanas">Semanas</option>
          <option value="meses">Meses</option>
        </select>
      </div>
      <p style={{ fontFamily: "var(--font-outfit-var, sans-serif)", fontSize: "12px", color: "#9B9188" }}>
        Fecha calculada: <span style={{ fontWeight: 600, color: "#44403C" }}>
          {fechaCalc.toLocaleDateString("es-CL", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
        </span>
      </p>
    </div>
  );
}

function FormVolverFecha({ fecha, onFecha }: { fecha: string; onFecha: (f: string) => void }) {
  const hoy = toISODate(new Date());
  return (
    <div>
      <label className="om-label">Fecha de regreso</label>
      <input type="date" value={fecha} min={hoy} onChange={(e) => onFecha(e.target.value)} className="om-input" />
      {fecha && (
        <p style={{ fontFamily: "var(--font-outfit-var, sans-serif)", fontSize: "12px", color: "#9B9188", marginTop: "4px" }}>
          {new Date(fecha + "T12:00:00").toLocaleDateString("es-CL", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
        </p>
      )}
    </div>
  );
}

function FormTomarExamen({ examenes, onExamenes }: { examenes: string[]; onExamenes: (e: string[]) => void }) {
  function update(i: number, val: string) { const next = [...examenes]; next[i] = val; onExamenes(next); }
  function agregar() { onExamenes([...examenes, ""]); }
  function eliminar(i: number) { if (examenes.length === 1) return; onExamenes(examenes.filter((_, idx) => idx !== i)); }
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
      <label className="om-label">Exámenes</label>
      {examenes.map((ex, i) => (
        <div key={i} style={{ display: "flex", gap: "6px" }}>
          <input
            value={ex} onChange={(e) => update(i, e.target.value)}
            placeholder={`Ej: Hemograma${i > 0 ? ", Perfil lipídico" : ""}`}
            className="om-input" style={{ flex: 1 }}
          />
          {examenes.length > 1 && (
            <button type="button" onClick={() => eliminar(i)} style={{ padding: "6px", background: "none", border: "none", cursor: "pointer", color: "#B0A89F", borderRadius: "6px", transition: "color 0.1s" }}
              onMouseEnter={e => (e.currentTarget.style.color = "#BE123C")}
              onMouseLeave={e => (e.currentTarget.style.color = "#B0A89F")}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>
          )}
        </div>
      ))}
      <button type="button" onClick={agregar} style={{ fontFamily: "var(--font-outfit-var, sans-serif)", fontSize: "12.5px", color: "#0B6E72", fontWeight: 600, background: "none", border: "none", cursor: "pointer", textAlign: "left", padding: "0", display: "flex", alignItems: "center", gap: "4px" }}>
        <span style={{ fontSize: "14px" }}>+</span> Agregar otro examen
      </button>
    </div>
  );
}

function FormVisitarEspecialista({
  modo, onModo, especialidad, onEspecialidad,
  nombre, onNombre, apellido, onApellido,
  telefono, onTelefono, email, onEmail,
}: {
  modo: ModoEspecialista; onModo: (m: ModoEspecialista) => void;
  especialidad: string; onEspecialidad: (s: string) => void;
  nombre: string; onNombre: (s: string) => void;
  apellido: string; onApellido: (s: string) => void;
  telefono: string; onTelefono: (s: string) => void;
  email: string; onEmail: (s: string) => void;
}) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
      <div>
        <label className="om-label">Modo de derivación</label>
        <div style={{ display: "inline-flex", borderRadius: "8px", border: "1px solid #E7E5E0", background: "#F5F4F1", padding: "3px" }}>
          {(["tipo", "nombre"] as ModoEspecialista[]).map((m) => (
            <button
              key={m} type="button" onClick={() => onModo(m)}
              style={{
                padding: "5px 14px",
                borderRadius: "6px",
                border: "none",
                cursor: "pointer",
                fontFamily: "var(--font-outfit-var, sans-serif)",
                fontSize: "12.5px",
                fontWeight: 500,
                background: modo === m ? "#FFFFFF" : "transparent",
                color: modo === m ? "#1C1917" : "#9B9188",
                boxShadow: modo === m ? "0 1px 2px rgba(0,0,0,0.06)" : "none",
                transition: "all 0.1s ease",
              }}
            >
              {m === "tipo" ? "Por tipo" : "Por nombre"}
            </button>
          ))}
        </div>
      </div>

      {modo === "tipo" ? (
        <div>
          <label className="om-label">Especialidad</label>
          <select value={especialidad} onChange={(e) => onEspecialidad(e.target.value)} className="om-input" style={{ cursor: "pointer" }}>
            {ESPECIALIDADES.map((e) => <option key={e}>{e}</option>)}
          </select>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
            <div>
              <label className="om-label">Nombre <span style={{ color: "#DC2626" }}>*</span></label>
              <input value={nombre} onChange={(e) => onNombre(e.target.value)} placeholder="Juan" className="om-input" />
            </div>
            <div>
              <label className="om-label">Apellido</label>
              <input value={apellido} onChange={(e) => onApellido(e.target.value)} placeholder="Pérez" className="om-input" />
            </div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
            <div>
              <label className="om-label">Teléfono <span style={{ color: "#B0A89F", fontWeight: 400 }}>(opcional)</span></label>
              <input value={telefono} onChange={(e) => onTelefono(e.target.value)} placeholder="+56912345678" type="tel" className="om-input" />
            </div>
            <div>
              <label className="om-label">Email <span style={{ color: "#B0A89F", fontWeight: 400 }}>(opcional)</span></label>
              <input value={email} onChange={(e) => onEmail(e.target.value)} placeholder="dr@clinica.cl" type="email" className="om-input" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
