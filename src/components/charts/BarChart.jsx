import { scaleLinear } from "../../utils/scale.js";

export function BarChart({
  data,
  width = 480,
  height = 240,
  yMin = 0,
  yMax = 6,
  invertY = false,
  valueFormatter = (v) => v,
  color = "var(--accent)",
}) {
  const padding = { top: 16, right: 16, bottom: 36, left: 32 };
  const chartW = width - padding.left - padding.right;
  const chartH = height - padding.top - padding.bottom;

  if (!data.length) {
    return <div className="chart-empty">Keine Daten vorhanden.</div>;
  }

  const yScale = invertY
    ? scaleLinear([yMin, yMax], [padding.top, padding.top + chartH])
    : scaleLinear([yMin, yMax], [padding.top + chartH, padding.top]);

  const barWidth = Math.min(48, (chartW / data.length) * 0.6);
  const step = chartW / data.length;

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="chart" role="img">
      <line
        x1={padding.left}
        y1={padding.top + chartH}
        x2={padding.left + chartW}
        y2={padding.top + chartH}
        className="chart__axis"
      />
      {data.map((d, i) => {
        const x = padding.left + step * i + step / 2 - barWidth / 2;
        const zeroY = invertY ? padding.top : padding.top + chartH;
        const barY = Math.min(yScale(d.value), zeroY);
        const barH = Math.abs(yScale(d.value) - zeroY);
        return (
          <g key={d.label}>
            <rect
              x={x}
              y={barY}
              width={barWidth}
              height={Math.max(barH, 1)}
              rx={6}
              fill={d.color || color}
              className="chart__bar"
            />
            <text x={x + barWidth / 2} y={barY - 6} textAnchor="middle" className="chart__value">
              {valueFormatter(d.value)}
            </text>
            <text
              x={x + barWidth / 2}
              y={padding.top + chartH + 18}
              textAnchor="middle"
              className="chart__label"
            >
              {d.label}
            </text>
          </g>
        );
      })}
    </svg>
  );
}
