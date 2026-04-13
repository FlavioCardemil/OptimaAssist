interface Props {
  totalActivos: number;
  perdidos: number;
  recuperados: number;
  tasaConversion: number;
  nuevosEsteMes: number;
  variacionMes: number;
}

const CARDS = [
  {
    key: "activos",
    label: "Pacientes activos",
    desc: "excl. abandono",
    barColor: "#0B6E72",
    getValor: (p: Props) => p.totalActivos,
    getColor: () => "#0B6E72",
  },
  {
    key: "nuevos",
    label: "Nuevos este mes",
    desc: null,
    barColor: "#6D28D9",
    getValor: (p: Props) => p.nuevosEsteMes,
    getColor: () => "#6D28D9",
    isFeature: true,
    getValorMes: (p: Props) => p.variacionMes,
  },
  {
    key: "perdidos",
    label: "Perdidos",
    desc: "en abandono",
    barColor: "#BE123C",
    getValor: (p: Props) => p.perdidos,
    getColor: () => "#BE123C",
  },
  {
    key: "recuperados",
    label: "Recuperados",
    desc: "volvieron al flujo",
    barColor: "#C2410C",
    getValor: (p: Props) => p.recuperados,
    getColor: () => "#C2410C",
  },
  {
    key: "tasa",
    label: "Tasa de conversión",
    desc: "llegaron a completo",
    barColor: "#0F766E",
    getValor: (p: Props) => `${p.tasaConversion}%`,
    getColor: (p: Props) => p.tasaConversion >= 50 ? "#0F766E" : "#B45309",
  },
] as const;

export default function MetricasCards(props: Props) {
  const mesActual = new Date().toLocaleDateString("es-CL", { month: "long" });

  return (
    <div className="om-stagger" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: "12px" }}>
      {CARDS.map((card) => {
        const valor = card.getValor(props);
        const color = card.getColor(props as Props);

        return (
          <div key={card.key} className="om-metric-card">
            <div className="om-metric-topbar" style={{ background: card.barColor }} />
            <div className="om-metric-body">
              <p style={{ fontFamily: "var(--font-outfit-var, sans-serif)", fontSize: "11.5px", fontWeight: 600, color: "#9B9188", textTransform: "uppercase", letterSpacing: "0.06em" }}>
                {card.key === "nuevos" ? `Nuevos en ${mesActual}` : card.label}
              </p>
              <p style={{ fontFamily: "var(--font-lora-var, 'Lora', serif)", fontSize: "38px", fontWeight: 700, color, lineHeight: 1.05, marginTop: "8px", marginBottom: "6px", letterSpacing: "-0.02em" }}>
                {valor}
              </p>
              {card.key === "nuevos" && (() => {
                const v = props.variacionMes;
                const vc = v > 0 ? "#047857" : v < 0 ? "#BE123C" : "#9B9188";
                const vi = v > 0 ? "↑" : v < 0 ? "↓" : "–";
                const vt = v !== 0 ? `${v > 0 ? "+" : ""}${v} vs mes ant.` : "sin cambios";
                return (
                  <p style={{ fontFamily: "var(--font-outfit-var, sans-serif)", fontSize: "12px", fontWeight: 600, color: vc }}>
                    {vi} {vt}
                  </p>
                );
              })()}
              {card.key !== "nuevos" && card.desc && (
                <p style={{ fontFamily: "var(--font-outfit-var, sans-serif)", fontSize: "12px", color: "#B0A89F" }}>{card.desc}</p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
