import { Pencil, Trash2, Check } from "lucide-react";
import { PriorityBadge } from "../../components/common/Badge.jsx";
import { subjectName, subjectColor } from "../../data/selectors.js";
import { useAppData } from "../../context/AppDataContext.jsx";
import { formatGermanDate, isPastISO, isTodayISO } from "../../utils/date.js";

export function HomeworkItem({ homework, onEdit, onDelete, onToggleDone }) {
  const { state } = useAppData();
  const done = homework.status === "erledigt";
  const overdue = !done && isPastISO(homework.dueDate) && !isTodayISO(homework.dueDate);

  return (
    <div className={`homework-item ${done ? "homework-item--done" : ""}`}>
      <button
        className={`checkbox ${done ? "checkbox--checked" : ""}`}
        onClick={() => onToggleDone(homework)}
        aria-label={done ? "Als offen markieren" : "Als erledigt markieren"}
      >
        {done && <Check size={13} strokeWidth={3} />}
      </button>
      <div className="homework-item__body">
        <div className="homework-item__top">
          <span className="subject-tag" style={{ background: subjectColor(state, homework.subjectId) }}>
            {subjectName(state, homework.subjectId)}
          </span>
          <PriorityBadge priority={homework.priority} />
          {overdue && <span className="badge badge--danger">🔴 Überfällig</span>}
        </div>
        <p className="homework-item__task">{homework.task}</p>
        {homework.description && <p className="homework-item__description">{homework.description}</p>}
        <span className="homework-item__due muted">
          Abgabe: {formatGermanDate(homework.dueDate, { weekday: true })}
        </span>
      </div>
      <div className="homework-item__actions">
        <button className="icon-button icon-button--sm" onClick={() => onEdit(homework)}>
          <Pencil size={15} />
        </button>
        <button className="icon-button icon-button--sm" onClick={() => onDelete(homework)}>
          <Trash2 size={15} />
        </button>
      </div>
    </div>
  );
}
