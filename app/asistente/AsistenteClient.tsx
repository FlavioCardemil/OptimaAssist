"use client";

import { useRef, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { guardarAsistente } from "@/app/actions/asistente";

interface AsistenteData {
  nombre: string;
  frase_presentacion: string;
  avatar_url: string | null;
}

interface Props {
  profesionalId: string;
  asistente: AsistenteData | null;
}

export default function AsistenteClient({ profesionalId, asistente }: Props) {
  const [nombre, setNombre] = useState(asistente?.nombre ?? "");
  const [frase, setFrase] = useState(asistente?.frase_presentacion ?? "");
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(
    asistente?.avatar_url ?? null
  );
  const [guardando, setGuardando] = useState(false);
  const [exito, setExito] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setError("Solo se permiten imágenes (JPG, PNG)");
      return;
    }
    setAvatarFile(file);
    setAvatarPreview(URL.createObjectURL(file));
    setError(null);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!nombre.trim()) {
      setError("El nombre de la asistente es requerido");
      return;
    }
    if (!frase.trim()) {
      setError("La frase de presentación es requerida");
      return;
    }

    setGuardando(true);
    setError(null);
    setExito(false);

    let avatarUrl = asistente?.avatar_url ?? null;

    if (avatarFile) {
      const supabase = createClient();
      const ext = avatarFile.name.split(".").pop()?.toLowerCase() ?? "jpg";
      const path = `${profesionalId}/avatar.${ext}`;
      const { error: uploadError } = await supabase.storage
        .from("avatares")
        .upload(path, avatarFile, { upsert: true, contentType: avatarFile.type });

      if (uploadError) {
        setError("Error al subir la imagen: " + uploadError.message);
        setGuardando(false);
        return;
      }

      const { data: urlData } = supabase.storage
        .from("avatares")
        .getPublicUrl(path);
      avatarUrl = `${urlData.publicUrl}?t=${Date.now()}`;
    }

    const resultado = await guardarAsistente({
      nombre,
      frase_presentacion: frase,
      avatar_url: avatarUrl,
    });

    if (resultado.error) {
      setError(resultado.error);
    } else {
      setExito(true);
      setAvatarFile(null);
      setTimeout(() => setExito(false), 3000);
    }

    setGuardando(false);
  }

  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "40px", alignItems: "start" }} className="om-asistente-grid">
      <style>{`@media (min-width: 900px) { .om-asistente-grid { grid-template-columns: 1fr 1fr; } }`}</style>

      {/* Formulario */}
      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
        <div>
          <label className="om-label">Nombre de la asistente <span style={{ color: "#DC2626" }}>*</span></label>
          <input value={nombre} onChange={(e) => setNombre(e.target.value)} placeholder="Ej: Sofía, Valentina, Andrea" className="om-input" />
        </div>

        <div>
          <label className="om-label">Frase de presentación <span style={{ color: "#DC2626" }}>*</span></label>
          <textarea
            value={frase}
            onChange={(e) => setFrase(e.target.value)}
            placeholder="Ej: Hola, soy Sofía, tu asistente de agenda. ¿En qué te puedo ayudar?"
            rows={3}
            className="om-input"
            style={{ resize: "none" }}
          />
          <p style={{ fontFamily: "var(--font-outfit-var, sans-serif)", fontSize: "12px", color: "#B0A89F", marginTop: "4px" }}>
            Este será el primer mensaje que recibirán tus pacientes.
          </p>
        </div>

        <div>
          <label className="om-label">Imagen / Avatar</label>
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <div
              onClick={() => fileInputRef.current?.click()}
              style={{ width: "60px", height: "60px", borderRadius: "50%", overflow: "hidden", background: "#F5F4F1", border: "2px solid #E7E5E0", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, cursor: "pointer", transition: "opacity 0.15s ease" }}
              onMouseEnter={e => (e.currentTarget.style.opacity = "0.7")}
              onMouseLeave={e => (e.currentTarget.style.opacity = "1")}
            >
              {avatarPreview ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={avatarPreview} alt="Avatar preview" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              ) : (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#D6D3D1" strokeWidth="1.5" strokeLinecap="round">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                  <circle cx="12" cy="7" r="4"/>
                </svg>
              )}
            </div>
            <div>
              <button type="button" onClick={() => fileInputRef.current?.click()} style={{ fontFamily: "var(--font-outfit-var, sans-serif)", fontSize: "13.5px", fontWeight: 600, color: "#0B6E72", background: "none", border: "none", cursor: "pointer", padding: 0 }}>
                {avatarPreview ? "Cambiar imagen" : "Subir imagen"}
              </button>
              <p style={{ fontFamily: "var(--font-outfit-var, sans-serif)", fontSize: "12px", color: "#B0A89F", marginTop: "2px" }}>JPG o PNG, máx. 2 MB</p>
            </div>
          </div>
          <input ref={fileInputRef} type="file" accept="image/jpeg,image/png,image/webp" onChange={handleImageChange} style={{ display: "none" }} />
        </div>

        {error && <div className="om-error-msg">{error}</div>}
        {exito && (
          <div style={{ fontFamily: "var(--font-outfit-var, sans-serif)", fontSize: "13px", color: "#047857", background: "#ECFDF5", border: "1px solid #A7F3D0", borderRadius: "8px", padding: "10px 14px" }}>
            Cambios guardados correctamente.
          </div>
        )}

        <button type="submit" disabled={guardando} className="om-btn om-btn-primary" style={{ width: "100%", justifyContent: "center", padding: "11px 16px", fontSize: "15px" }}>
          {guardando ? "Guardando…" : "Guardar cambios"}
        </button>
      </form>

      {/* Vista previa WhatsApp */}
      <div>
        <p style={{ fontFamily: "var(--font-outfit-var, sans-serif)", fontSize: "11px", fontWeight: 600, color: "#9B9188", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "16px", textAlign: "center" }}>
          Vista previa — Así lo verán tus pacientes
        </p>
        <WhatsAppPreview nombre={nombre} frase={frase} avatarSrc={avatarPreview} />
      </div>
    </div>
  );
}

function WhatsAppPreview({
  nombre,
  frase,
  avatarSrc,
}: {
  nombre: string;
  frase: string;
  avatarSrc: string | null;
}) {
  const displayNombre = nombre.trim() || "Asistente";
  const displayFrase = frase.trim() || "Hola, ¿en qué te puedo ayudar?";
  const hora = new Date().toLocaleTimeString("es-CL", {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className="max-w-[300px] mx-auto">
      {/* Marco del teléfono */}
      <div className="rounded-[36px] overflow-hidden shadow-2xl ring-[7px] ring-slate-800 bg-slate-800">
        {/* Barra de estado */}
        <div className="bg-slate-900 px-5 pt-2 pb-1 flex justify-between items-center">
          <span className="text-white text-[11px] font-semibold">9:41</span>
          <div className="flex items-center gap-1.5">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="10" viewBox="0 0 14 10" fill="white">
              <rect x="0" y="4" width="2" height="6" rx="0.5"/>
              <rect x="3" y="3" width="2" height="7" rx="0.5"/>
              <rect x="6" y="1.5" width="2" height="8.5" rx="0.5"/>
              <rect x="9" y="0" width="2" height="10" rx="0.5"/>
            </svg>
            <svg xmlns="http://www.w3.org/2000/svg" width="15" height="10" viewBox="0 0 20 15" fill="none" stroke="white" strokeWidth="1.5">
              <path d="M1 6.5C4.5 3 8 1.5 10 1.5C12 1.5 15.5 3 19 6.5"/>
              <path d="M3.5 9C6 6.5 8 5.5 10 5.5C12 5.5 14 6.5 16.5 9"/>
              <path d="M6.5 11.5C8 10 9 9.5 10 9.5C11 9.5 12 10 13.5 11.5"/>
              <circle cx="10" cy="14" r="1" fill="white" stroke="none"/>
            </svg>
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="11" viewBox="0 0 22 11">
              <rect x="0" y="0" width="19" height="11" rx="2" fill="none" stroke="white" strokeWidth="1"/>
              <rect x="1" y="1" width="14" height="9" rx="1" fill="white"/>
              <path d="M20 3.5v4a1.5 1.5 0 0 0 0-4z" fill="white"/>
            </svg>
          </div>
        </div>

        {/* Header WhatsApp */}
        <div className="bg-[#075E54] px-3 py-2 flex items-center gap-2.5">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="flex-shrink-0">
            <polyline points="15 18 9 12 15 6"/>
          </svg>

          {/* Avatar */}
          <div className="w-8 h-8 rounded-full overflow-hidden bg-slate-400 flex items-center justify-center flex-shrink-0">
            {avatarSrc ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={avatarSrc} alt="avatar" className="w-full h-full object-cover" />
            ) : (
              <span className="text-white text-sm font-bold">
                {displayNombre[0]?.toUpperCase()}
              </span>
            )}
          </div>

          <div className="flex-1 min-w-0">
            <p className="text-white text-[13px] font-semibold leading-tight truncate">
              {displayNombre}
            </p>
            <p className="text-green-200 text-[10px]">en línea</p>
          </div>

          <div className="flex items-center gap-3 flex-shrink-0">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
              <path d="M15.05 5A5 5 0 0 1 19 8.95M15.05 1A9 9 0 0 1 23 8.94m-1 7.98v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13.1a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 2.37h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 9.91"/>
            </svg>
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
              <circle cx="12" cy="5" r="1"/><circle cx="12" cy="12" r="1"/><circle cx="12" cy="19" r="1"/>
            </svg>
          </div>
        </div>

        {/* Área de chat */}
        <div
          className="p-3 min-h-[220px] flex flex-col justify-start"
          style={{ backgroundColor: "#ECE5DD" }}
        >
          {/* Fecha */}
          <div className="flex justify-center mb-3">
            <span className="bg-white/70 text-slate-500 text-[10px] px-2.5 py-0.5 rounded-full">
              Hoy
            </span>
          </div>

          {/* Burbuja de mensaje recibido */}
          <div className="max-w-[85%]">
            <div className="bg-white rounded-lg rounded-tl-none px-3 py-2 shadow-sm relative">
              {/* Triángulo */}
              <div className="absolute -left-1.5 top-0 w-0 h-0 border-t-[6px] border-r-[6px] border-b-0 border-l-0 border-t-white border-r-transparent" />
              <p className="text-[12.5px] text-slate-800 leading-relaxed whitespace-pre-wrap break-words">
                {displayFrase}
              </p>
              <div className="flex justify-end items-center gap-1 mt-1">
                <span className="text-[10px] text-slate-400">{hora}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Barra de entrada */}
        <div className="bg-[#F0F2F5] px-2 py-2 flex items-center gap-2">
          <div className="flex-1 bg-white rounded-full px-3 py-1.5 flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#8696A0" strokeWidth="2">
              <circle cx="12" cy="12" r="10"/><path d="M8 14s1.5 2 4 2 4-2 4-2"/><line x1="9" y1="9" x2="9.01" y2="9"/><line x1="15" y1="9" x2="15.01" y2="9"/>
            </svg>
            <span className="text-slate-300 text-xs flex-1">Mensaje</span>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#8696A0" strokeWidth="2">
              <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"/>
            </svg>
          </div>
          <div className="w-9 h-9 rounded-full bg-[#075E54] flex items-center justify-center flex-shrink-0">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
              <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="23"/><line x1="8" y1="23" x2="16" y2="23"/>
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}
