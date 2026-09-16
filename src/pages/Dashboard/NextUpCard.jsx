import { Card } from "../../components/common/Card.jsx";
import { subjectName, subjectColor, getCurrentLesson, getNextLesson } from "../../data/selectors.js";
import { useAppData } from "../../context/AppDataContext.jsx";
import { WEEKDAYS_DE } from "../../utils/date.js";

export function NextUpCard() {
  const { state } = useAppData();
  const current = getCurrentLesson(state);
  const next = getNextLesson(state);

  return (
    <Card className="next-up-card">
      {current && (
        <div className="next-up-card__row">
          <span className="badge badge--success">Jetzt</span>
          <div>
            <strong style={{ color: subjectColor(state, current.subjectId) }}>
              {subjectName(state, current.subjectId)}
            </strong>
            <p className="muted">
              {current.startTime} – {current.endTime} {current.room && `· Raum ${current.room}`}
            </p>
          </div>
        </div>
      )}
      {next ? (
        <div className="next-up-card__row">
          <span className="badge badge--info">Nächste Stunde</span>
          <div>
            <strong style={{ color: subjectColor(state, next.lesson.subjectId) }}>
              {subjectName(state, next.lesson.subjectId)}
            </strong>
            <p className="muted">
              {next.daysAhead === 0
                ? `Heute, ${next.lesson.startTime} Uhr`
                : `${WEEKDAYS_DE[next.lesson.day]}, ${next.lesson.startTime} Uhr`}
              {next.lesson.room && ` · Raum ${next.lesson.room}`}
            </p>
          </div>
        </div>
      ) : (
        !current && <p className="muted">Keine weiteren Stunden im Stundenplan.</p>
      )}
    </Card>
  );
}
