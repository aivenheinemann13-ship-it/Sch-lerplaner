import { Card, PageHeader } from "../../components/common/Card.jsx";
import { useAppData } from "../../context/AppDataContext.jsx";
import { getTodayAgenda, subjectName, subjectColor } from "../../data/selectors.js";
import { formatGermanDate, todayISO, formatCountdown, addDaysISO } from "../../utils/date.js";
import { PriorityBadge } from "../../components/common/Badge.jsx";
import { InsightList } from "../Dashboard/InsightList.jsx";

export function HeutePage() {
  const { state } = useAppData();
  const agenda = getTodayAgenda(state);
  const tomorrowTests = state.tests.filter((t) => t.date === addDaysISO(todayISO(), 1));

  return (
    <div className="heute-page">
      <PageHeader title="Heute" subtitle={formatGermanDate(todayISO(), { weekday: true })} />

      <InsightList />

      <Card>
        <h3 className="section-title">Stundenplan</h3>
        {agenda.lessons.length === 0 ? (
          <p className="muted">Heute kein Unterricht laut Stundenplan.</p>
        ) : (
          <div className="heute-lessons">
            {agenda.lessons.map((l) => (
              <div key={l.id} className="heute-lesson" style={{ borderLeftColor: subjectColor(state, l.subjectId) }}>
                <span className="heute-lesson__time">{l.startTime}</span>
                <div>
                  <strong>{subjectName(state, l.subjectId)}</strong>
                  <p className="muted">
                    {l.room && `Raum ${l.room}`} {l.teacher && `· ${l.teacher}`}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      <Card>
        <h3 className="section-title">Hausaufgaben</h3>
        {agenda.homework.length === 0 ? (
          <p className="muted">Keine Hausaufgaben heute fällig.</p>
        ) : (
          <ul className="simple-list">
            {agenda.homework.map((h) => (
              <li key={h.id}>
                <span>☐ {h.task}</span>
                <PriorityBadge priority={h.priority} />
              </li>
            ))}
          </ul>
        )}
      </Card>

      <Card>
        <h3 className="section-title">Tests</h3>
        {agenda.tests.length === 0 && tomorrowTests.length === 0 ? (
          <p className="muted">Keine Tests in Sicht.</p>
        ) : (
          <ul className="simple-list">
            {agenda.tests.map((t) => (
              <li key={t.id}>
                <span>🧪 Heute: {subjectName(state, t.subjectId)}-Test</span>
                <span className="muted">{t.topic}</span>
              </li>
            ))}
            {tomorrowTests.map((t) => (
              <li key={t.id}>
                <span>⚠️ {formatCountdown(t.date)} {subjectName(state, t.subjectId)}-Test</span>
                <span className="muted">{t.topic}</span>
              </li>
            ))}
          </ul>
        )}
      </Card>

      <Card>
        <h3 className="section-title">Erinnerungen & Termine</h3>
        {agenda.reminders.length === 0 && agenda.events.length === 0 ? (
          <p className="muted">Keine Erinnerungen oder Termine heute.</p>
        ) : (
          <ul className="simple-list">
            {agenda.reminders.map((r) => (
              <li key={r.id}>
                <span>🔔 {r.title}</span>
                <span className="muted">{r.time}</span>
              </li>
            ))}
            {agenda.events.map((e) => (
              <li key={e.id}>
                <span>🏫 {e.title}</span>
                <span className="muted">{e.time}</span>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </div>
  );
}
