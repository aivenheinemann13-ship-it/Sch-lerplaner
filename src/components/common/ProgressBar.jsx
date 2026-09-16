export function ProgressBar({ value, tone = "accent", showLabel = true }) {
  const clamped = Math.max(0, Math.min(100, value));
  return (
    <div className="progress-bar">
      <div className="progress-bar__track">
        <div
          className={`progress-bar__fill progress-bar__fill--${tone}`}
          style={{ width: `${clamped}%` }}
        />
      </div>
      {showLabel && <span className="progress-bar__label">{Math.round(clamped)}%</span>}
    </div>
  );
}
