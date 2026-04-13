"use client";

import { useState, useTransition } from "react";
import { asignarMedico, desasignarMedico } from "@/app/actions/admin";
import { useRouter } from "next/navigation";

interface Props {
  asistenta: { id: string; nombre: string; email: string };
  medicos: { id: string; nombre: string }[];
  medicosAsignados: string[];
}

export default function AsistentaRow({ asistenta, medicos, medicosAsignados }: Props) {
  const router = useRouter();
  const [expandido, setExpandido] = useState(false);
  const [asignados, setAsignados] = useState(new Set(medicosAsignados));
  const [, startTransition] = useTransition();

  const nombresAsignados = medicos
    .filter((m) => asignados.has(m.id))
    .map((m) => m.nombre);

  function toggleMedico(medicoId: string, checked: boolean) {
    setAsignados((prev) => {
      const next = new Set(prev);
      if (checked) next.add(medicoId); else next.delete(medicoId);
      return next;
    });
    startTransition(async () => {
      if (checked) await asignarMedico(asistenta.id, medicoId);
      else await desasignarMedico(asistenta.id, medicoId);
      router.refresh();
    });
  }

  return (
    <>
      <tr className="group" style={{ cursor: "pointer" }} onClick={() => setExpandido((v) => !v)}>
        <td>
          <p style={{ fontWeight: 600, color: "#1C1917", fontSize: "14px" }}>{asistenta.nombre}</p>
          <p style={{ fontSize: "12px", color: "#9B9188", marginTop: "1px" }}>{asistenta.email}</p>
        </td>
        <td>
          {nombresAsignados.length === 0 ? (
            <span style={{ fontSize: "13px", color: "#D6D3D1", fontStyle: "italic" }}>Sin asignar</span>
          ) : (
            <div style={{ display: "flex", flexWrap: "wrap", gap: "4px" }}>
              {nombresAsignados.map((n) => (
                <span key={n} style={{
                  fontFamily: "var(--font-outfit-var, sans-serif)",
                  fontSize: "11.5px", fontWeight: 500,
                  background: "#F0FAFA", color: "#0B6E72",
                  border: "1px solid #B2E8E9",
                  padding: "2px 8px", borderRadius: "999px",
                }}>
                  {n}
                </span>
              ))}
            </div>
          )}
        </td>
        <td>
          <div style={{ display: "flex", justifyContent: "center" }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#D6D3D1" strokeWidth="2.5" strokeLinecap="round"
              className="group-hover:!stroke-[#0B6E72]"
              style={{ transition: "transform 0.15s ease, stroke 0.12s ease", transform: expandido ? "rotate(90deg)" : "rotate(0deg)" }}>
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </div>
        </td>
      </tr>

      {expandido && (
        <tr>
          <td colSpan={3} style={{ padding: "0", background: "#FAFAF9" }}>
            <div style={{ padding: "14px 20px 16px", borderTop: "1px solid #F0EFEB" }}>
              <p style={{ fontFamily: "var(--font-outfit-var, sans-serif)", fontSize: "11.5px", fontWeight: 600, color: "#9B9188", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "10px" }}>
                Médicos asignados
              </p>
              {medicos.length === 0 ? (
                <p style={{ fontFamily: "var(--font-outfit-var, sans-serif)", fontSize: "13px", color: "#B0A89F" }}>No hay médicos registrados.</p>
              ) : (
                <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                  {medicos.map((m) => (
                    <label key={m.id} style={{ display: "flex", alignItems: "center", gap: "7px", cursor: "pointer" }}>
                      <input
                        type="checkbox"
                        checked={asignados.has(m.id)}
                        onChange={(e) => toggleMedico(m.id, e.target.checked)}
                        style={{ width: "14px", height: "14px", cursor: "pointer", accentColor: "#0B6E72" }}
                      />
                      <span style={{ fontFamily: "var(--font-outfit-var, sans-serif)", fontSize: "13.5px", color: "#44403C" }}>{m.nombre}</span>
                    </label>
                  ))}
                </div>
              )}
            </div>
          </td>
        </tr>
      )}
    </>
  );
}
