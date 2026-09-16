import { Card } from "../../components/common/Card.jsx";
import { useAppData } from "../../context/AppDataContext.jsx";
import { subjectName } from "../../data/selectors.js";
import { formatDuration } from "../../utils/date.js";

export function SessionLog() {
  const { state } = useAppData();
  const sessions = [...state.studySessions].sort((a, b) => b.startedAt.localeCompare(a.startedAt)).slice(0, 10);

  return (
    <Card>
      <h3 className="section-title">Letzte Lerneinheiten</h3>
      {sessions.length === 0 ? (
        <p className="muted">Noch keine Lernzeit erfasst.</p>
      ) : (
        <ul className="simple-list">
          {sessions.map((s) => (
            <li key={s.id}>
              <span>
                {subjectName(state, s.subjectId)} {s.goal && `· ${s.goal}`}
              </span>
              <span className="muted">
                {formatDuration(s.actualMinutes)} · {s.mode === "pomodoro" ? "Pomodoro" : "Normal"}
              </span>
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
}
