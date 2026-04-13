import { obtenerContenidoLanding } from "@/app/actions/landing";
import EditorContenido from "./EditorContenido";

export default async function ContenidoPage() {
  const contenido = await obtenerContenidoLanding();

  return (
    <main style={{ maxWidth: "1040px", margin: "0 auto", padding: "32px 24px" }}>
      <div className="om-stagger">
        <div style={{ marginBottom: "28px" }}>
          <h1 style={{ fontFamily: "var(--font-lora-var, serif)", fontSize: "1.5rem", fontWeight: 700, color: "#1C1917" }}>
            Contenido del sitio público
          </h1>
          <p style={{ fontFamily: "var(--font-outfit-var, sans-serif)", fontSize: "14px", color: "#78716C", marginTop: "6px" }}>
            Edita los textos de la landing page. Los cambios se reflejan de inmediato al guardar.
          </p>
        </div>
        <EditorContenido contenido={contenido} />
      </div>
    </main>
  );
}
