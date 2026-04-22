"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import type { Automatizacion, EstadoAutomatizacion } from "@/lib/types";
import {
  describir,
  emojiTipo,
  ESTADO_AUTO_CONFIG,
} from "@/lib/automatizaciones";
import {
  eliminarAutomatizacion,
  actualizarEstadoAutomatizacion,
} from "@/app/actions/automatizaciones";
import ModalAutomatizacion from "./ModalAutomatizacion";

interface Props {
  pacienteId: string;
  automatizaciones: Automatizacion[];
}

export default function AutomatizacionesSection({
  pacienteId,
  automatizaciones: inicial,
}: Props) {
  const router = useRouter();
  const [lista, setLista] = useState(inicial);
  const [modalAbierto, setModalAbierto] = useState(false);

  function handleGuardado() {
    router.refresh();
  }

  // Sync list when server refreshes props (via router.refresh)
  // React re-renders with new props but useState keeps stale state.
  // We use a key trick in the parent instead — see DetallePacienteClient.

  return (
    <>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-semibold text-slate-900">Automatizaciones</h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Recordatorios y derivaciones para este paciente
          </p>
        </div>
        <button
          onClick={() => setModalAbierto(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium rounded-lg transition-colors"
        >
          <span className="text-sm leading-none">+</span>
          Nueva
        </button>
      </div>

      {lista.length === 0 ? (
        <div className="text-center py-8 border-2 border-dashed border-slate-200 rounded-xl">
          <p className="text-slate-400 text-sm">Sin automatizaciones</p>
          <p className="text-slate-300 text-xs mt-1">
            Agrega recordatorios o derivaciones para este paciente
          </p>
        </div>
      ) : (
        <ul className="space-y-2">
          {lista.map((a) => (
            <AutomatizacionItem
              key={a.id}
              automatizacion={a}
              onEliminar={(id) => {
                setLista((prev) => prev.filter((x) => x.id !== id));
                eliminarAutomatizacion(id);
              }}
              onEstado={(id, estado) => {
                setLista((prev) =>
                  prev.map((x) => (x.id === id ? { ...x, estado } : x))
                );
                actualizarEstadoAutomatizacion(id, estado);
              }}
            />
          ))}
        </ul>
      )}

      <ModalAutomatizacion
        abierto={modalAbierto}
        onCerrar={() => setModalAbierto(false)}
        onGuardado={() => {
          setModalAbierto(false);
          handleGuardado();
        }}
        pacienteId={pacienteId}
      />
    </>
  );
}

function AutomatizacionItem({
  automatizacion: a,
  onEliminar,
  onEstado,
}: {
  automatizacion: Automatizacion;
  onEliminar: (id: string) => void;
  onEstado: (id: string, estado: EstadoAutomatizacion) => void;
}) {
  const [isPending, startTransition] = useTransition();
  const estadoConfig = ESTADO_AUTO_CONFIG[a.estado];
  const descripcion = describir(a.tipo, a.configuracion);
  const emoji = emojiTipo(a.tipo);

  const ESTADOS_ORDEN: EstadoAutomatizacion[] = ["pendiente", "mensaje1_enviado", "mensaje2_enviado", "completado", "sin_recordatorio"];

  return (
    <li className={`flex items-start gap-3 p-3 rounded-xl border border-slate-200 bg-white transition-opacity ${isPending ? "opacity-50" : ""}`}>
      <span className="text-xl leading-none mt-0.5 flex-shrink-0">{emoji}</span>

      <div className="flex-1 min-w-0">
        <p className="text-sm text-slate-800 font-medium leading-snug">{descripcion}</p>
        <div className="flex items-center gap-2 mt-1.5">
          {/* Selector de estado */}
          <select
            value={a.estado}
            onChange={(e) => {
              startTransition(() => {
                onEstado(a.id, e.target.value as EstadoAutomatizacion);
              });
            }}
            disabled={isPending}
            className={`text-xs font-medium px-2 py-0.5 rounded-full border-0 cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-blue-500 ${estadoConfig.bg} ${estadoConfig.text}`}
          >
            {ESTADOS_ORDEN.map((e) => (
              <option key={e} value={e}>
                {ESTADO_AUTO_CONFIG[e].label}
              </option>
            ))}
          </select>
          <span className="text-xs text-slate-400">
            {new Date(a.created_at).toLocaleDateString("es-CL")}
          </span>
        </div>
      </div>

      <button
        onClick={() => startTransition(() => onEliminar(a.id))}
        disabled={isPending}
        title="Eliminar automatización"
        className="flex-shrink-0 p-1.5 rounded-md text-slate-300 hover:text-red-500 hover:bg-red-50 transition-colors"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="3 6 5 6 21 6"/>
          <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
          <path d="M10 11v6"/><path d="M14 11v6"/>
          <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
        </svg>
      </button>
    </li>
  );
}
