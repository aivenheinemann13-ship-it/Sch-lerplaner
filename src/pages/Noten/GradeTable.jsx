import { Pencil, Trash2 } from "lucide-react";
import { subjectName, subjectColor } from "../../data/selectors.js";
import { useAppData } from "../../context/AppDataContext.jsx";
import { formatGermanDate } from "../../utils/date.js";
import { formatGrade, gradeColor } from "../../utils/grades.js";

const TYPE_LABELS = {
  klassenarbeit: "Klassenarbeit",
  test: "Test",
  muendlich: "Mündlich",
  sonstige: "Sonstige",
};

export function GradeTable({ grades, onEdit, onDelete }) {
  const { state } = useAppData();

  if (!grades.length) return <p className="muted">Noch keine Noten eingetragen.</p>;

  return (
    <div className="table-wrap scroll-x">
      <table className="table">
        <thead>
          <tr>
            <th>Fach</th>
            <th>Art</th>
            <th>Note</th>
            <th>Datum</th>
            <th>Notiz</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {[...grades]
            .sort((a, b) => b.date.localeCompare(a.date))
            .map((g) => (
              <tr key={g.id}>
                <td>
                  <span className="subject-tag" style={{ background: subjectColor(state, g.subjectId) }}>
                    {subjectName(state, g.subjectId)}
                  </span>
                </td>
                <td>{TYPE_LABELS[g.type] || g.type}</td>
                <td>
                  <strong style={{ color: gradeColor(g.value) }}>{formatGrade(g.value)}</strong>
                </td>
                <td className="muted">{formatGermanDate(g.date, { short: true })}</td>
                <td className="muted">{g.note}</td>
                <td className="table__actions">
                  <button className="icon-button icon-button--sm" onClick={() => onEdit(g)}>
                    <Pencil size={14} />
                  </button>
                  <button className="icon-button icon-button--sm" onClick={() => onDelete(g)}>
                    <Trash2 size={14} />
                  </button>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
}
