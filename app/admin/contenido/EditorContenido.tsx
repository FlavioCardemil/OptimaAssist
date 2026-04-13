"use client";

import { useState, useTransition } from "react";
import { guardarCampoLanding } from "@/app/actions/landing";

const SECCIONES = [
  {
    id: "hero",
    label: "Hero",
    campos: [
      { clave: "hero_eyebrow",        label: "Etiqueta superior",     tipo: "text" },
      { clave: "hero_heading",         label: "Título principal",       tipo: "textarea" },
      { clave: "hero_subheading",      label: "Subtítulo",              tipo: "textarea" },
      { clave: "hero_cta_principal",   label: "Botón CTA principal",    tipo: "text" },
      { clave: "hero_cta_secundario",  label: "Botón CTA secundario",   tipo: "text" },
    ],
  },
  {
    id: "problema",
    label: "El Problema",
    campos: [
      { clave: "problema_heading",    label: "Título",    tipo: "textarea" },
      { clave: "problema_subheading", label: "Subtítulo", tipo: "textarea" },
    ],
  },
  {
    id: "solucion",
    label: "Nuestra Solución",
    campos: [
      { clave: "solucion_heading",    label: "Título",    tipo: "text" },
      { clave: "solucion_subheading", label: "Subtítulo", tipo: "text" },
    ],
  },
  {
    id: "planes",
    label: "Planes",
    campos: [
      { clave: "planes_heading",    label: "Título",    tipo: "text" },
      { clave: "planes_subheading", label: "Subtítulo", tipo: "text" },
    ],
  },
  {
    id: "elizabeth",
    label: "Elizabeth Milla",
    campos: [
      { clave: "elizabeth_heading",  label: "Título",        tipo: "textarea" },
      { clave: "elizabeth_parrafo1", label: "Párrafo 1",     tipo: "textarea" },
      { clave: "elizabeth_parrafo2", label: "Párrafo 2",     tipo: "textarea" },
      { clave: "elizabeth_parrafo3", label: "Párrafo 3 / cita en cuerpo", tipo: "textarea" },
      { clave: "elizabeth_cita",     label: "Cita destacada (tarjeta)", tipo: "textarea" },
    ],
  },
  {
    id: "beneficios",
    label: "Beneficios",
    campos: [
      { clave: "beneficios_heading", label: "Título", tipo: "text" },
    ],
  },
  {
    id: "cta",
    label: "CTA Final",
    campos: [
      { clave: "cta_heading",    label: "Título",    tipo: "textarea" },
      { clave: "cta_subheading", label: "Subtítulo", tipo: "textarea" },
    ],
  },
];

export default function EditorContenido({ contenido }: { contenido: Record<string, string> }) {
  const [valores, setValores] = useState<Record<string, string>>(contenido);
  const [guardando, setGuardando] = useState<Record<string, boolean>>({});
  const [guardado, setGuardado] = useState<Record<string, boolean>>({});
  const [errores, setErrores] = useState<Record<string, string>>({});
  const [, startTransition] = useTransition();

  function handleChange(clave: string, valor: string) {
    setValores(v => ({ ...v, [clave]: valor }));
    setGuardado(v => ({ ...v, [clave]: false }));
  }

  function handleSave(clave: string) {
    setGuardando(v => ({ ...v, [clave]: true }));
    setErrores(v => ({ ...v, [clave]: "" }));
    startTransition(async () => {
      const result = await guardarCampoLanding(clave, valores[clave] ?? "");
      setGuardando(v => ({ ...v, [clave]: false }));
      if (result.error) {
        setErrores(v => ({ ...v, [clave]: result.error! }));
      } else {
        setGuardado(v => ({ ...v, [clave]: true }));
        setTimeout(() => setGuardado(v => ({ ...v, [clave]: false })), 2000);
      }
    });
  }

  const labelStyle: React.CSSProperties = {
    display: "block",
    fontFamily: "var(--font-outfit-var, sans-serif)",
    fontSize: "11.5px", fontWeight: 700,
    letterSpacing: "0.05em", textTransform: "uppercase",
    color: "#9B9188", marginBottom: "6px",
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "32px" }}>
      {SECCIONES.map(sec => (
        <div key={sec.id} className="om-card" style={{ padding: "28px" }}>
          <h2 style={{
            fontFamily: "var(--font-lora-var, serif)", fontSize: "1rem",
            fontWeight: 700, color: "#1C1917", marginBottom: "24px",
            paddingBottom: "14px", borderBottom: "1px solid #F0EFEB",
          }}>
            {sec.label}
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            {sec.campos.map(campo => {
              const val = valores[campo.clave] ?? "";
              const isDirty = val !== contenido[campo.clave];
              const isSaving = guardando[campo.clave];
              const isSaved = guardado[campo.clave];
              const error = errores[campo.clave];

              return (
                <div key={campo.clave}>
                  <label style={labelStyle}>{campo.label}</label>
                  <div style={{ display: "flex", gap: "10px", alignItems: "flex-start" }}>
                    {campo.tipo === "textarea" ? (
                      <textarea
                        value={val}
                        onChange={e => handleChange(campo.clave, e.target.value)}
                        rows={3}
                        className="om-input"
                        style={{ resize: "vertical", flex: 1, fontFamily: "var(--font-outfit-var, sans-serif)", fontSize: "14px" }}
                      />
                    ) : (
                      <input
                        type="text"
                        value={val}
                        onChange={e => handleChange(campo.clave, e.target.value)}
                        className="om-input"
                        style={{ flex: 1 }}
                      />
                    )}
                    <button
                      onClick={() => handleSave(campo.clave)}
                      disabled={!isDirty || isSaving}
                      style={{
                        padding: "8px 16px", borderRadius: "8px", border: "none",
                        fontFamily: "var(--font-outfit-var, sans-serif)", fontSize: "13px", fontWeight: 600,
                        cursor: (!isDirty || isSaving) ? "not-allowed" : "pointer",
                        transition: "all 0.15s ease", whiteSpace: "nowrap", flexShrink: 0,
                        background: isSaved ? "#ECFDF5" : (!isDirty || isSaving) ? "#F0EFEB" : "#0B6E72",
                        color: isSaved ? "#047857" : (!isDirty || isSaving) ? "#B0A89F" : "#FFFFFF",
                      }}
                    >
                      {isSaving ? "Guardando…" : isSaved ? "✓ Guardado" : "Guardar"}
                    </button>
                  </div>
                  {error && (
                    <p style={{ fontFamily: "var(--font-outfit-var, sans-serif)", fontSize: "12px", color: "#BE123C", marginTop: "6px" }}>
                      {error}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
