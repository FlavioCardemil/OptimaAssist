const ESTADOS_CONFIG: {
  key: string;
  label: string;
  fill: string;
  light: string;
}[] = [
  { key: "contactando", label: "Contactando",  fill: "#3B82F6", light: "#EFF6FF" },
  { key: "agendado",    label: "Agendado",     fill: "#8B5CF6", light: "#F5F3FF" },
  { key: "atendido",    label: "Atendido",     fill: "#10B981", light: "#ECFDF5" },
  { key: "esperando",   label: "Esperando",    fill: "#F59E0B", light: "#FFFBEB" },
  { key: "completo",    label: "Completo",     fill: "#0F766E", light: "#F0FDFA" },
  { key: "abandono",    label: "Abandono",     fill: "#F43F5E", light: "#FFF1F2" },
  { key: "recuperado",  label: "Recuperado",   fill: "#F97316", light: "#FFF7ED" },
];

export default function FunnelConversion({ conteos }: { conteos: Record<string, number> }) {
  const total = Object.values(conteos).reduce((s, n) => s + n, 0);

  const filas = ESTADOS_CONFIG
    .map((e) => ({ ...e, count: conteos[e.key] ?? 0 }))
    .filter((e) => e.count > 0);

  if (total === 0) {
    return (
      <div style={{ padding: "32px", textAlign: "center" }}>
        <p style={{ fontFamily: "var(--font-outfit-var, sans-serif)", fontSize: "14px", color: "#B0A89F" }}>
          Sin datos para mostrar
        </p>
      </div>
    );
  }

  // Sort by count descending for clarity
  filas.sort((a, b) => b.count - a.count);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "0" }}>
      {/* Total header */}
      <div style={{ display: "flex", alignItems: "baseline", gap: "8px", marginBottom: "20px" }}>
        <span style={{ fontFamily: "var(--font-lora-var, serif)", fontSize: "2rem", fontWeight: 700, color: "#1C1917", lineHeight: 1 }}>
          {total}
        </span>
        <span style={{ fontFamily: "var(--font-outfit-var, sans-serif)", fontSize: "13px", color: "#9B9188" }}>
          pacientes en total
        </span>
      </div>

      {/* Rows */}
      <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        {filas.map(({ key, label, fill, light, count }) => {
          const pct = Math.round((count / total) * 100);
          const barWidth = Math.max(2, pct);

          return (
            <div key={key} style={{ display: "grid", gridTemplateColumns: "110px 1fr 80px", alignItems: "center", gap: "14px" }}>
              {/* Label */}
              <div style={{ display: "flex", alignItems: "center", gap: "7px" }}>
                <span style={{ width: "8px", height: "8px", borderRadius: "99px", background: fill, flexShrink: 0 }} />
                <span style={{ fontFamily: "var(--font-outfit-var, sans-serif)", fontSize: "13px", fontWeight: 500, color: "#44403C", whiteSpace: "nowrap" }}>
                  {label}
                </span>
              </div>

              {/* Bar track */}
              <div style={{ height: "28px", background: "#F5F4F1", borderRadius: "6px", overflow: "hidden", position: "relative" }}>
                <div style={{
                  position: "absolute", inset: "0 auto 0 0",
                  width: `${barWidth}%`,
                  background: fill,
                  borderRadius: "6px",
                  display: "flex", alignItems: "center",
                  paddingLeft: "10px",
                  transition: "width 0.4s ease",
                  minWidth: "28px",
                }}>
                  {pct >= 8 && (
                    <span style={{ fontFamily: "var(--font-outfit-var, sans-serif)", fontSize: "12px", fontWeight: 700, color: "#FFFFFF", whiteSpace: "nowrap" }}>
                      {count}
                    </span>
                  )}
                </div>
                {pct < 8 && (
                  <span style={{ position: "absolute", left: `${barWidth}% `, marginLeft: "6px", fontFamily: "var(--font-outfit-var, sans-serif)", fontSize: "12px", fontWeight: 600, color: "#78716C", top: "50%", transform: "translateY(-50%)" }}>
                    {count}
                  </span>
                )}
              </div>

              {/* Pct + light badge */}
              <div style={{ display: "flex", justifyContent: "flex-end" }}>
                <span style={{
                  fontFamily: "var(--font-outfit-var, sans-serif)",
                  fontSize: "12.5px", fontWeight: 600,
                  color: fill, background: light,
                  padding: "3px 9px", borderRadius: "99px",
                  whiteSpace: "nowrap",
                }}>
                  {pct}%
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
