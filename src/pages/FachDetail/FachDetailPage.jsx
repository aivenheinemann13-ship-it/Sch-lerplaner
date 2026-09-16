import { ArrowLeft } from "lucide-react";
import { useAppData } from "../../context/AppDataContext.jsx";
import { useRouter } from "../../router/Router.jsx";
import { ROUTES } from "../../router/routes.js";
import { Card, PageHeader } from "../../components/common/Card.jsx";
import { PriorityBadge, StatusBadge } from "../../components/common/Badge.jsx";
import { EmptyState } from "../../components/common/EmptyState.jsx";
import { getGradeStats } from "../../data/selectors.js";
import { formatGrade, gradeLabel } from "../../utils/grades.js";
import { formatGermanDate } from "../../utils/date.js";

export function FachDetailPage() {
  const { state } = useAppData();
  const { params, navigate } = useRouter();
  const subject = state.subjects.find((s) => s.id === params.subjectId);

  if (!subject) {
    return (
      <EmptyState
        title="Fach nicht gefunden"
        message="Dieses Fach existiert nicht mehr."
        action={
          <button className="btn btn--primary btn--md" onClick={() => navigate(ROUTES.FAECHER)}>
            Zurück zu Fächern
          </button>
        }
      />
    );
  }

  const stats = getGradeStats(state, subject.id);
  const homework = state.homework.filter((h) => h.subjectId === subject.id);
  const notes = state.notes.filter((n) => n.subjectId === subject.id);
  const grades = state.grades.filter((g) => g.subjectId === subject.id);

  return (
    <div>
      <button className="back-link" onClick={() => navigate(ROUTES.FAECHER)}>
        <ArrowLeft size={16} /> Zurück zu Fächern
      </button>

      <PageHeader
        title={
          <span className="fach-detail-title">
            <span className="subject-dot" style={{ background: subject.color }} />
            {subject.name}
          </span>
        }
        subtitle={`${subject.teacher || "Keine Lehrkraft angegeben"} · Raum ${subject.room || "–"}`}
      />

      <div className="fach-detail-grid">
        <Card className="stat-card">
          <span className="stat-card__label">Durchschnitt</span>
          <span className="stat-card__value">{stats.average ? formatGrade(stats.average) : "–"}</span>
        </Card>
        <Card className="stat-card">
          <span className="stat-card__label">Noten</span>
          <span className="stat-card__value">{stats.count}</span>
        </Card>
        <Card className="stat-card">
          <span className="stat-card__label">Beste Note</span>
          <span className="stat-card__value">{stats.best ? formatGrade(stats.best) : "–"}</span>
        </Card>
        <Card className="stat-card">
          <span className="stat-card__label">Offene Aufgaben</span>
          <span className="stat-card__value">
            {homework.filter((h) => h.status !== "erledigt").length}
          </span>
        </Card>
      </div>

      <div className="fach-detail-columns">
        <Card>
          <h3 className="section-title">Noten</h3>
          {grades.length === 0 ? (
            <p className="muted">Noch keine Noten eingetragen.</p>
          ) : (
            <ul className="simple-list">
              {grades.map((g) => (
                <li key={g.id}>
                  <span>{formatGrade(g.value)} · {gradeLabel(g.value)}</span>
                  <span className="muted">{formatGermanDate(g.date, { short: true })}</span>
                </li>
              ))}
            </ul>
          )}
        </Card>

        <Card>
          <h3 className="section-title">Hausaufgaben</h3>
          {homework.length === 0 ? (
            <p className="muted">Keine Hausaufgaben für dieses Fach.</p>
          ) : (
            <ul className="simple-list">
              {homework.map((h) => (
                <li key={h.id}>
                  <span>{h.task}</span>
                  <span className="simple-list__badges">
                    <PriorityBadge priority={h.priority} />
                    <StatusBadge status={h.status} />
                  </span>
                </li>
              ))}
            </ul>
          )}
        </Card>

        <Card>
          <h3 className="section-title">Notizen</h3>
          {notes.length === 0 ? (
            <p className="muted">Keine Notizen für dieses Fach.</p>
          ) : (
            <ul className="simple-list">
              {notes.map((n) => (
                <li key={n.id}>
                  <span>{n.title}</span>
                  <span className="muted">{formatGermanDate(n.date, { short: true })}</span>
                </li>
              ))}
            </ul>
          )}
        </Card>

        {subject.notes && (
          <Card>
            <h3 className="section-title">Persönliche Notizen zum Fach</h3>
            <p>{subject.notes}</p>
          </Card>
        )}
      </div>
    </div>
  );
}
