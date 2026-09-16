import { scaleLinear } from "../../utils/scale.js";

export function LineChart({
  series,
  width = 560,
  height = 260,
  yMin = 1,
  yMax = 6,
  invertY = true,
  xFormatter = (v) => v,
}) {
  const padding = { top: 16, right: 20, bottom: 32, left: 32 };
  const chartW = width - padding.left - padding.right;
  const chartH = height - padding.top - padding.bottom;

  const allPoints = series.flatMap((s) => s.points);
  if (!allPoints.length) {
    return <div className="chart-empty">Keine Daten vorhanden.</div>;
  }

  const xValues = [...new Set(allPoints.map((p) => p.x))].sort();
  const xScale = scaleLinear([0, Math.max(xValues.length - 1, 1)], [padding.left, padding.left + chartW]);
  const yScale = invertY
    ? scaleLinear([yMin, yMax], [padding.top, padding.top + chartH])
    : scaleLinear([yMin, yMax], [padding.top + chartH, padding.top]);

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="chart" role="img">
      <line
        x1={padding.left}
        y1={padding.top + chartH}
        x2={padding.left + chartW}
        y2={padding.top + chartH}
        className="chart__axis"
      />
      {series.map((s) => {
        const path = s.points
          .map((p, i) => {
            const x = xScale(xValues.indexOf(p.x));
            const y = yScale(p.y);
            return `${i === 0 ? "M" : "L"}${x},${y}`;
          })
          .join(" ");
        return (
          <g key={s.label}>
            <path d={path} fill="none" stroke={s.color} strokeWidth={2.5} className="chart__line" />
            {s.points.map((p) => (
              <circle
                key={p.x}
                cx={xScale(xValues.indexOf(p.x))}
                cy={yScale(p.y)}
                r={4}
                fill={s.color}
              />
            ))}
          </g>
        );
      })}
      {xValues.map((x, i) => (
        <text
          key={x}
          x={xScale(i)}
          y={padding.top + chartH + 18}
          textAnchor="middle"
          className="chart__label"
        >
          {xFormatter(x)}
        </text>
      ))}
    </svg>
  );
}
