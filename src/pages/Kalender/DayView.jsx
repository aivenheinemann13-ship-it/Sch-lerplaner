import { formatGermanDate } from "../../utils/date.js";
import { EVENT_CATEGORY_META } from "../../data/schema.js";
import { Pencil, Trash2 } from "lucide-react";

export function DayView({ date, events, onEdit, onDelete }) {
  const sorted = [...events].sort((a, b) => (a.time || "").localeCompare(b.time || ""));

  return (
    <div className="day-view">
      <h4 className="day-view__heading">{formatGermanDate(date, { weekday: true })}</h4>
      {sorted.length === 0 ? (
        <p className="muted">Keine Termine an diesem Tag.</p>
      ) : (
        <ul className="day-view__list">
          {sorted.map((e) => (
            <li key={e.id} className="day-view__item" style={{ borderLeftColor: e.color }}>
              <div>
                <span className="day-view__category">
                  {EVENT_CATEGORY_META[e.category]?.icon} {EVENT_CATEGORY_META[e.category]?.label}
                </span>
                <strong>{e.title}</strong>
                {e.time && <span className="muted"> · {e.time}</span>}
                {e.description && <p className="muted">{e.description}</p>}
              </div>
              <div className="day-view__actions">
                <button className="icon-button icon-button--sm" onClick={() => onEdit(e)}>
                  <Pencil size={14} />
                </button>
                <button className="icon-button icon-button--sm" onClick={() => onDelete(e)}>
                  <Trash2 size={14} />
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
