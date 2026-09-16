import { Pencil, Trash2, Award } from "lucide-react";
import { Card } from "../../components/common/Card.jsx";
import { subjectName, subjectColor } from "../../data/selectors.js";
import { useAppData } from "../../context/AppDataContext.jsx";
import { formatGermanDate, formatCountdown } from "../../utils/date.js";
import { formatGrade } from "../../utils/grades.js";

export function TestItem({ test, onEdit, onDelete, onEnterGrade }) {
  const { state } = useAppData();
  const grade = state.grades.find((g) => g.id === test.gradeId);
  const countdown = formatCountdown(test.date);
  const urgent = countdown === "Morgen!" || countdown === "Heute!";

  return (
    <Card className="test-item">
      <div className="test-item__accent" style={{ background: subjectColor(state, test.subjectId) }} />
      <div className="test-item__body">
        <div className="test-item__top">
          <span className="subject-tag" style={{ background: subjectColor(state, test.subjectId) }}>
            {subjectName(state, test.subjectId)}
          </span>
          <span className={`badge ${urgent ? "badge--danger" : "badge--info"}`}>{countdown}</span>
        </div>
        <h4 className="test-item__topic">{test.topic}</h4>
        <p className="muted">{formatGermanDate(test.date, { weekday: true })}{test.time && ` · ${test.time}`}{test.room && ` · Raum ${test.room}`}</p>
        {test.material && <p className="test-item__material">Lernstoff: {test.material}</p>}
        {grade && (
          <p className="test-item__grade">
            <Award size={14} /> Note: {formatGrade(grade.value)}
          </p>
        )}
      </div>
      <div className="test-item__actions">
        {!grade && (
          <button className="btn btn--ghost btn--sm" onClick={() => onEnterGrade(test)}>
            Note eintragen
          </button>
        )}
        <button className="icon-button icon-button--sm" onClick={() => onEdit(test)}>
          <Pencil size={15} />
        </button>
        <button className="icon-button icon-button--sm" onClick={() => onDelete(test)}>
          <Trash2 size={15} />
        </button>
      </div>
    </Card>
  );
}
