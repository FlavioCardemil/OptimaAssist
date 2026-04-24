"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import ModalPaciente from "@/components/ModalPaciente";

interface Props {
  profesionalId: string;
  nombreMedico: string;
}

export default function BotonCrearPacienteAdmin({ profesionalId, nombreMedico }: Props) {
  const router = useRouter();
  const [abierto, setAbierto] = useState(false);

  return (
    <>
      <button
        onClick={() => setAbierto(true)}
        className="om-btn om-btn-primary"
        style={{ fontSize: "13px" }}
      >
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
          <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
        </svg>
        Nuevo paciente
      </button>

      <ModalPaciente
        abierto={abierto}
        onCerrar={() => setAbierto(false)}
        onGuardado={() => { setAbierto(false); router.refresh(); }}
        paciente={null}
        medicos={[{ id: profesionalId, nombre: nombreMedico }]}
      />
    </>
  );
}
