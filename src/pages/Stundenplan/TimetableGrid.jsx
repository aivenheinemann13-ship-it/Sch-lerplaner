import { Pencil, Trash2 } from "lucide-react";
import { WEEKDAYS_DE, timeToMinutes } from "../../utils/date.js";
import { subjectName, subjectColor } from "../../data/selectors.js";
import { useAppData } from "../../context/AppDataContext.jsx";

export function TimetableGrid({ lessons, breaks, onEditLesson, onDeleteLesson, onEditBreak, onDeleteBreak }) {
  const { state } = useAppData();

  const dayEntries = (day) => {
    const entries = [
      ...lessons.filter((l) => l.day === day).map((l) => ({ ...l, kind: "lesson" })),
      ...breaks.filter((b) => b.day === day).map((b) => ({ ...b, kind: "break" })),
    ];
    return entries.sort((a, b) => timeToMinutes(a.startTime) - timeToMinutes(b.startTime));
  };

  return (
    <div className="timetable-grid">
      {WEEKDAYS_DE.map((day, dayIndex) => (
        <div key={day} className="timetable-column">
          <h4 className="timetable-column__header">{day}</h4>
          <div className="timetable-column__entries">
            {dayEntries(dayIndex).length === 0 && <p className="muted timetable-empty">Keine Einträge</p>}
            {dayEntries(dayIndex).map((entry) =>
              entry.kind === "lesson" ? (
                <div
                  key={entry.id}
                  className="timetable-entry"
                  style={{ borderLeftColor: subjectColor(state, entry.subjectId) }}
                >
                  <div className="timetable-entry__time">
                    {entry.startTime} – {entry.endTime}
                  </div>
                  <div className="timetable-entry__subject">{subjectName(state, entry.subjectId)}</div>
                  <div className="timetable-entry__meta">
                    {entry.teacher && <span>{entry.teacher}</span>}
                    {entry.room && <span>Raum {entry.room}</span>}
                  </div>
                  <div className="timetable-entry__actions">
                    <button className="icon-button icon-button--sm" onClick={() => onEditLesson(entry)}>
                      <Pencil size={13} />
                    </button>
                    <button className="icon-button icon-button--sm" onClick={() => onDeleteLesson(entry)}>
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
              ) : (
                <div key={entry.id} className="timetable-entry timetable-entry--break">
                  <div className="timetable-entry__time">
                    {entry.startTime} – {entry.endTime}
                  </div>
                  <div className="timetable-entry__subject">☕ {entry.label}</div>
                  <div className="timetable-entry__actions">
                    <button className="icon-button icon-button--sm" onClick={() => onEditBreak(entry)}>
                      <Pencil size={13} />
                    </button>
                    <button className="icon-button icon-button--sm" onClick={() => onDeleteBreak(entry)}>
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
              )
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
