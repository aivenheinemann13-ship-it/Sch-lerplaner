import { Pencil, Trash2 } from "lucide-react";
import { Card } from "../../components/common/Card.jsx";
import { subjectName, subjectColor } from "../../data/selectors.js";
import { useAppData } from "../../context/AppDataContext.jsx";
import { formatGermanDate } from "../../utils/date.js";

export function NoteCard({ note, onEdit, onDelete }) {
  const { state } = useAppData();

  return (
    <Card className="note-card">
      <div className="note-card__header">
        <h4>{note.title}</h4>
        <div className="subject-card__actions">
          <button className="icon-button icon-button--sm" onClick={() => onEdit(note)}>
            <Pencil size={14} />
          </button>
          <button className="icon-button icon-button--sm" onClick={() => onDelete(note)}>
            <Trash2 size={14} />
          </button>
        </div>
      </div>
      {note.subjectId && (
        <span className="subject-tag" style={{ background: subjectColor(state, note.subjectId) }}>
          {subjectName(state, note.subjectId)}
        </span>
      )}
      <p className="note-card__text">{note.text}</p>
      <span className="muted note-card__date">{formatGermanDate(note.date, { short: true })}</span>
    </Card>
  );
}
