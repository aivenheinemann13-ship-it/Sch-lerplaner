import { startOfWeek, addDays, toISODate, WEEKDAYS_DE, todayISO } from "../../utils/date.js";
import { EVENT_CATEGORY_META } from "../../data/schema.js";

export function WeekView({ referenceDate, events, selectedDate, onSelectDate }) {
  const weekStart = startOfWeek(referenceDate);
  const days = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));
  const today = todayISO();

  const eventsFor = (iso) => events.filter((e) => e.date === iso);

  return (
    <div className="week-view">
      {days.map((date, i) => {
        const iso = toISODate(date);
        const dayEvents = eventsFor(iso);
        const label = i < 5 ? WEEKDAYS_DE[i] : i === 5 ? "Samstag" : "Sonntag";
        return (
          <button
            key={iso}
            className={[
              "week-view__day",
              iso === today && "week-view__day--today",
              iso === selectedDate && "week-view__day--selected",
            ]
              .filter(Boolean)
              .join(" ")}
            onClick={() => onSelectDate(iso)}
          >
            <span className="week-view__label">{label}</span>
            <span className="week-view__date">{date.getDate()}.</span>
            <div className="week-view__events">
              {dayEvents.map((e) => (
                <span
                  key={e.id}
                  className="week-view__event"
                  style={{ background: e.color || EVENT_CATEGORY_META[e.category]?.color }}
                >
                  {e.title}
                </span>
              ))}
            </div>
          </button>
        );
      })}
    </div>
  );
}
