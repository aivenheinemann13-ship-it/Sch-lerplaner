export function DonutChart({ segments, size = 180, thickness = 22, centerLabel, centerSubLabel }) {
  const total = segments.reduce((acc, s) => acc + s.value, 0);
  const radius = (size - thickness) / 2;
  const circumference = 2 * Math.PI * radius;
  let offset = 0;

  if (total === 0) {
    return <div className="chart-empty">Keine Daten vorhanden.</div>;
  }

  return (
    <div className="donut-chart" style={{ width: size, height: size }}>
      <svg viewBox={`0 0 ${size} ${size}`} width={size} height={size}>
        <g transform={`rotate(-90 ${size / 2} ${size / 2})`}>
          {segments.map((s) => {
            const fraction = s.value / total;
            const dash = fraction * circumference;
            const circle = (
              <circle
                key={s.label}
                cx={size / 2}
                cy={size / 2}
                r={radius}
                fill="none"
                stroke={s.color}
                strokeWidth={thickness}
                strokeDasharray={`${dash} ${circumference - dash}`}
                strokeDashoffset={-offset}
                className="donut-chart__segment"
              />
            );
            offset += dash;
            return circle;
          })}
        </g>
      </svg>
      <div className="donut-chart__center">
        <strong>{centerLabel}</strong>
        {centerSubLabel && <span>{centerSubLabel}</span>}
      </div>
    </div>
  );
}
