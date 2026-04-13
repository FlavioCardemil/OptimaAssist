"use client";

import { useState } from "react";
import { guardarContacto } from "@/app/actions/landing";

export default function ContactForm() {
  const [form, setForm] = useState({ nombre: "", email: "", especialidad: "", mensaje: "" });
  const [enviado, setEnviado] = useState(false);
  const [loading, setLoading] = useState(false);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const result = await guardarContacto(form);
    setLoading(false);
    if (result?.error) {
      alert("Hubo un error al enviar el formulario. Inténtalo de nuevo.");
      return;
    }
    setEnviado(true);
  }

  if (enviado) {
    return (
      <div style={{ textAlign: "center", padding: "48px 24px" }}>
        <div style={{
          width: "64px", height: "64px", borderRadius: "50%",
          background: "rgba(11,110,114,0.12)", border: "1.5px solid rgba(11,110,114,0.3)",
          display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px"
        }}>
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#0B6E72" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12"/>
          </svg>
        </div>
        <p style={{ fontFamily: "var(--font-lora-var, serif)", fontSize: "1.3rem", fontWeight: 700, color: "#FFFFFF", marginBottom: "10px" }}>
          Mensaje recibido
        </p>
        <p style={{ fontFamily: "var(--font-outfit-var, sans-serif)", fontSize: "15px", color: "rgba(255,255,255,0.65)", lineHeight: 1.6 }}>
          Elizabeth se pondrá en contacto contigo en las próximas 24 horas.
        </p>
      </div>
    );
  }

  const inputStyle: React.CSSProperties = {
    width: "100%",
    padding: "12px 16px",
    background: "rgba(255,255,255,0.06)",
    border: "1px solid rgba(255,255,255,0.15)",
    borderRadius: "10px",
    color: "#FFFFFF",
    fontFamily: "var(--font-outfit-var, sans-serif)",
    fontSize: "14px",
    outline: "none",
    transition: "border-color 0.15s ease",
  };

  const labelStyle: React.CSSProperties = {
    display: "block",
    fontFamily: "var(--font-outfit-var, sans-serif)",
    fontSize: "12px",
    fontWeight: 600,
    letterSpacing: "0.06em",
    textTransform: "uppercase",
    color: "rgba(255,255,255,0.45)",
    marginBottom: "7px",
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
        <div>
          <label style={labelStyle}>Nombre</label>
          <input
            name="nombre" type="text" required placeholder="Dr. García"
            value={form.nombre} onChange={handleChange}
            style={inputStyle}
            onFocus={e => (e.target.style.borderColor = "rgba(11,110,114,0.7)")}
            onBlur={e => (e.target.style.borderColor = "rgba(255,255,255,0.15)")}
          />
        </div>
        <div>
          <label style={labelStyle}>Email</label>
          <input
            name="email" type="email" required placeholder="dr@clinica.cl"
            value={form.email} onChange={handleChange}
            style={inputStyle}
            onFocus={e => (e.target.style.borderColor = "rgba(11,110,114,0.7)")}
            onBlur={e => (e.target.style.borderColor = "rgba(255,255,255,0.15)")}
          />
        </div>
      </div>

      <div>
        <label style={labelStyle}>Especialidad</label>
        <select
          name="especialidad" required
          value={form.especialidad} onChange={handleChange}
          style={{ ...inputStyle, cursor: "pointer" }}
          onFocus={e => (e.currentTarget.style.borderColor = "rgba(11,110,114,0.7)")}
          onBlur={e => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.15)")}
        >
          <option value="" style={{ background: "#111" }}>Selecciona tu especialidad</option>
          <option value="traumatologia" style={{ background: "#111" }}>Traumatología</option>
          <option value="cardiologia" style={{ background: "#111" }}>Cardiología</option>
          <option value="neurologia" style={{ background: "#111" }}>Neurología</option>
          <option value="ginecologia" style={{ background: "#111" }}>Ginecología</option>
          <option value="oftalmologia" style={{ background: "#111" }}>Oftalmología</option>
          <option value="dermatologia" style={{ background: "#111" }}>Dermatología</option>
          <option value="otra" style={{ background: "#111" }}>Otra especialidad</option>
        </select>
      </div>

      <div>
        <label style={labelStyle}>Cuéntanos tu situación</label>
        <textarea
          name="mensaje" rows={4}
          placeholder="Tengo X pacientes por mes, mi problema principal es..."
          value={form.mensaje} onChange={handleChange}
          style={{ ...inputStyle, resize: "none", lineHeight: 1.6 }}
          onFocus={e => (e.target.style.borderColor = "rgba(11,110,114,0.7)")}
          onBlur={e => (e.target.style.borderColor = "rgba(255,255,255,0.15)")}
        />
      </div>

      <button
        type="submit" disabled={loading}
        style={{
          width: "100%", padding: "14px 24px",
          background: loading ? "rgba(11,110,114,0.5)" : "#0B6E72",
          border: "none", borderRadius: "10px",
          color: "#FFFFFF", fontFamily: "var(--font-outfit-var, sans-serif)",
          fontSize: "15px", fontWeight: 600, cursor: loading ? "not-allowed" : "pointer",
          transition: "all 0.15s ease", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
        }}
        onMouseEnter={e => { if (!loading) (e.currentTarget as HTMLButtonElement).style.background = "#074F52"; }}
        onMouseLeave={e => { if (!loading) (e.currentTarget as HTMLButtonElement).style.background = "#0B6E72"; }}
      >
        {loading ? (
          <>
            <span style={{ width: "14px", height: "14px", border: "2px solid rgba(255,255,255,0.3)", borderTopColor: "#fff", borderRadius: "50%", animation: "spin 0.7s linear infinite", display: "inline-block" }} />
            Enviando…
          </>
        ) : "Quiero una demo gratuita →"}
      </button>
    </form>
  );
}
