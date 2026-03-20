import { useState } from "react";

const COLS = 28;
const TOTAL_BLUE = 173; // each = ~100 admissions → 17,282
const TOTAL_RED = 51;   // each = 1 death → 50.9
const TOTAL = TOTAL_BLUE + TOTAL_RED; // 274
const ROWS = Math.ceil(TOTAL / COLS);

const ICON_W = 36;
const ICON_H = 44;
const PAD_X = 2;
const PAD_Y = 2;

const CIRCLE = { cx: 299.51, cy: 254.51, r: 55.22 };
const BODY_PATH = "M295.71,480.19l-6.69,77.38c-.83,9.62-8.89,17.01-18.55,17.01h0c-10.28,0-18.62-8.33-18.62-18.62v-180.99c0-1.53-1.92-2.21-2.88-1.01l-35.64,44.41c-4.48,5.59-12.42,6.97-18.53,3.22h0c-6.71-4.11-8.8-12.88-4.68-19.58,10.47-17,29.28-47.32,38.54-60.7,13.25-19.13,34.59-23.18,47.46-23.18,12.88,0,33.85,0,46.73,0,12.88,0,34.22,4.05,47.46,23.18,9.27,13.39,28.08,43.7,38.54,60.7,4.12,6.7,2.03,15.47-4.68,19.58h0c-6.11,3.74-14.04,2.36-18.53-3.22l-35.64-44.41c-.96-1.19-2.88-.52-2.88,1.01v180.99c0,10.28-8.33,18.62-18.62,18.62h0c-9.66,0-17.71-7.39-18.55-17.01l-6.69-77.38c-.17-1.97-1.82-3.48-3.8-3.48h0c-1.98,0-3.63,1.51-3.8,3.48Z";

const VB = "180 190 240 410";

const NAVY = "#1a2a50";
const RED = "#8B1A1A";

export default function App() {
  const [hovered, setHovered] = useState(null);
  const [tipPos, setTipPos] = useState({ x: 0, y: 0 });

  const icons = [];
  for (let i = 0; i < TOTAL; i++) {
    icons.push({
      i,
      col: i % COLS,
      row: Math.floor(i / COLS),
      isCase: i >= TOTAL_BLUE,
    });
  }

  const svgW = COLS * (ICON_W + PAD_X) + PAD_X;
  const svgH = ROWS * (ICON_H + PAD_Y) + PAD_Y + 50;

  const handleMove = (e) => {
    const svg = e.currentTarget.closest("svg");
    if (!svg) return;
    const r = svg.getBoundingClientRect();
    setTipPos({ x: e.clientX - r.left, y: e.clientY - r.top });
  };

  const getLabel = (icon) => {
    if (icon.isCase) {
      const deathNum = icon.i - TOTAL_BLUE + 1;
      return `Death ${deathNum} of 50.9  —  represents 1 death`;
    }
    const groupNum = icon.i + 1;
    return `Admission group ${groupNum} of ${TOTAL_BLUE}  —  represents ~100 admissions`;
  };

  return (
    <div style={{ background: "transparent", display: "flex", flexDirection: "column", alignItems: "center", padding: "24px 8px", fontFamily: "'Montserrat', sans-serif" }}>
      <h2 style={{ color: "var(--navy)", fontSize: "calc(var(--fs-section-title) * 0.5)", fontWeight: 600, marginBottom: 4, textAlign: "center" }}>
        Average Malaria monthly admissions and deaths during the rainy season
      </h2>
      <p style={{ color: "#999", fontSize: "0.85rem", marginBottom: 20 }}>Hover over any figure to see what it represents</p>

      <svg width={svgW} height={svgH} style={{ overflow: "visible" }} onMouseMove={handleMove}>
        {icons.map(({ i, col, row, isCase }) => {
          const x = PAD_X + col * (ICON_W + PAD_X);
          const y = PAD_Y + row * (ICON_H + PAD_Y);
          const active = hovered === i;
          const fill = isCase ? RED : NAVY;
          const dimmed = hovered !== null && !active;

          return (
            <g key={i}
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(null)}
              style={{ cursor: "pointer" }}
            >
              <svg x={x} y={y} width={ICON_W} height={ICON_H} viewBox={VB}>
                <circle cx={CIRCLE.cx} cy={CIRCLE.cy} r={CIRCLE.r} fill={fill}
                  opacity={dimmed ? 0.25 : 1}
                  style={{ transition: "opacity 0.15s" }}
                />
                <path d={BODY_PATH} fill={fill}
                  opacity={dimmed ? 0.25 : 1}
                  style={{ transition: "opacity 0.15s" }}
                />
              </svg>
              {active && (
                <rect x={x - 1} y={y - 1} width={ICON_W + 2} height={ICON_H + 2}
                  rx={3} fill="none" stroke={fill} strokeWidth={1.5} opacity={0.5}
                />
              )}
            </g>
          );
        })}

        <text x={svgW / 2} y={ROWS * (ICON_H + PAD_Y) + 20} textAnchor="middle" fontSize="15" fill="#333" fontWeight="600">
          <tspan fill={NAVY}>17,282 admissions</tspan>
          <tspan fill="#999"> ‖ </tspan>
          <tspan fill={RED}>50.9 deaths</tspan>
        </text>

        {hovered !== null && (() => {
          const label = getLabel(icons[hovered]);
          const tw = Math.min(label.length * 5.8 + 24, 360);
          const tx = Math.max(tw / 2 + 4, Math.min(tipPos.x, svgW - tw / 2 - 4));
          const ty = tipPos.y - 14;
          const bg = icons[hovered].isCase ? RED : NAVY;
          return (
            <g style={{ pointerEvents: "none" }}>
              <rect x={tx - tw / 2} y={ty - 24} width={tw} height={26} rx={5} fill={bg} opacity={0.95} />
              <polygon points={`${tx - 5},${ty + 2} ${tx + 5},${ty + 2} ${tx},${ty + 7}`} fill={bg} opacity={0.95} />
              <text x={tx} y={ty - 7} textAnchor="middle" fontSize="11" fill="white" fontWeight="500">{label}</text>
            </g>
          );
        })()}
      </svg>

      <div style={{ display: "flex", gap: 28, marginTop: 10 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <svg width={14} height={18} viewBox={VB}>
            <circle cx={CIRCLE.cx} cy={CIRCLE.cy} r={CIRCLE.r} fill={NAVY} />
            <path d={BODY_PATH} fill={NAVY} />
          </svg>
          <span style={{ fontSize: 13, color: "#444" }}>Admissions (each icon ≈ 100)</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <svg width={14} height={18} viewBox={VB}>
            <circle cx={CIRCLE.cx} cy={CIRCLE.cy} r={CIRCLE.r} fill={RED} />
            <path d={BODY_PATH} fill={RED} />
          </svg>
          <span style={{ fontSize: 13, color: "#444" }}>Deaths (each icon = 1)</span>
        </div>
      </div>
    </div>
  );
}
