import { Pencil, Trash2, ChevronRight } from "lucide-react";
import { Card } from "../../components/common/Card.jsx";
import { getSubjectAverage } from "../../data/selectors.js";
import { formatGrade } from "../../utils/grades.js";
import { useAppData } from "../../context/AppDataContext.jsx";

export function SubjectCard({ subject, onOpen, onEdit, onDelete }) {
  const { state } = useAppData();
  const avg = getSubjectAverage(state, subject.id);
  const homeworkCount = state.homework.filter(
    (h) => h.subjectId === subject.id && h.status !== "erledigt"
  ).length;

  return (
    <Card className="subject-card fp-fade" onClick={() => onOpen(subject)}>
      <div className="subject-card__bar" style={{ background: subject.color }} />
      <div className="subject-card__body">
        <div className="subject-card__header">
          <span className="subject-card__abbr" style={{ background: subject.color }}>
            {subject.abbreviation || subject.name.slice(0, 2).toUpperCase()}
          </span>
          <div className="subject-card__actions">
            <button
              className="icon-button icon-button--sm"
              onClick={(e) => {
                e.stopPropagation();
                onEdit(subject);
              }}
              aria-label="Bearbeiten"
            >
              <Pencil size={15} />
            </button>
            <button
              className="icon-button icon-button--sm"
              onClick={(e) => {
                e.stopPropagation();
                onDelete(subject);
              }}
              aria-label="Löschen"
            >
              <Trash2 size={15} />
            </button>
          </div>
        </div>
        <h3 className="subject-card__name">{subject.name}</h3>
        <p className="subject-card__meta">
          {subject.teacher || "—"} {subject.room && `· Raum ${subject.room}`}
        </p>
        <div className="subject-card__stats">
          <span>⌀ {avg ? formatGrade(avg) : "–"}</span>
          <span>{homeworkCount} offene Aufgabe{homeworkCount === 1 ? "" : "n"}</span>
        </div>
      </div>
      <ChevronRight size={18} className="subject-card__chevron" />
    </Card>
  );
}
