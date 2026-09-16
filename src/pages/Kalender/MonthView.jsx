import { getMonthMatrix, WEEKDAYS_SHORT_DE, todayISO } from "../../utils/date.js";
import { EVENT_CATEGORY_META } from "../../data/schema.js";

export function MonthView({ year, month, events, selectedDate, onSelectDate }) {
  const days = getMonthMatrix(year, month);
  const today = todayISO();

  const eventsFor = (iso) => events.filter((e) => e.date === iso);

  return (
    <div className="month-view">
      <div className="month-view__weekdays">
        {WEEKDAYS_SHORT_DE.slice(0, 5).concat(["Sa", "So"]).map((d) => (
          <div key={d} className="month-view__weekday">
            {d}
          </div>
        ))}
      </div>
      <div className="month-view__grid">
        {days.map(({ iso, inMonth, date }) => {
          const dayEvents = eventsFor(iso);
          return (
            <button
              key={iso}
              className={[
                "month-view__day",
                !inMonth && "month-view__day--muted",
                iso === today && "month-view__day--today",
                iso === selectedDate && "month-view__day--selected",
              ]
                .filter(Boolean)
                .join(" ")}
              onClick={() => onSelectDate(iso)}
            >
              <span className="month-view__day-number">{date.getDate()}</span>
              <div className="month-view__day-dots">
                {dayEvents.slice(0, 3).map((e) => (
                  <span
                    key={e.id}
                    className="month-view__dot"
                    style={{ background: e.color || EVENT_CATEGORY_META[e.category]?.color }}
                  />
                ))}
                {dayEvents.length > 3 && <span className="month-view__more">+{dayEvents.length - 3}</span>}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
