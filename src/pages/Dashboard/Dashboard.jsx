import { Card } from "../../components/common/Card.jsx";
import { useAppData } from "../../context/AppDataContext.jsx";
import { greetingForNow, formatGermanDate, todayISO } from "../../utils/date.js";
import { getTodayAgenda } from "../../data/selectors.js";
import { subjectName } from "../../data/selectors.js";
import { NextUpCard } from "./NextUpCard.jsx";
import { OverviewCards } from "./OverviewCards.jsx";
import { InsightList } from "./InsightList.jsx";
import { TodayTaskList } from "./TodayTaskList.jsx";
import { useRouter } from "../../router/Router.jsx";
import { ROUTES } from "../../router/routes.js";
import { formatCountdown } from "../../utils/date.js";

export function Dashboard() {
  const { state } = useAppData();
  const { navigate } = useRouter();
  const agenda = getTodayAgenda(state);

  return (
    <div>
      <div className="dashboard-greeting">
        <h1>{greetingForNow()} 👋</h1>
        <p className="muted">{formatGermanDate(todayISO(), { weekday: true })}</p>
      </div>

      <InsightList />

      <div className="dashboard-grid">
        <Card>
          <h3 className="section-title">Heute</h3>
          <NextUpCard />

          <div className="dashboard-today-columns">
            <div>
              <h4 className="task-group__title">📝 Hausaufgaben heute</h4>
              {agenda.homework.length === 0 ? (
                <p className="muted">Keine Hausaufgaben heute fällig.</p>
              ) : (
                <ul className="simple-list clickable" onClick={() => navigate(ROUTES.HAUSAUFGABEN)}>
                  {agenda.homework.map((h) => (
                    <li key={h.id}>
                      <span>{h.task}</span>
                      <span className="muted">{subjectName(state, h.subjectId)}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <div>
              <h4 className="task-group__title">🧪 Tests</h4>
              {agenda.tests.length === 0 ? (
                <p className="muted">Kein Test heute.</p>
              ) : (
                <ul className="simple-list clickable" onClick={() => navigate(ROUTES.TESTS)}>
                  {agenda.tests.map((t) => (
                    <li key={t.id}>
                      <span>{t.topic}</span>
                      <span className="muted">{formatCountdown(t.date)}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <div>
              <h4 className="task-group__title">🏫 Termine</h4>
              {agenda.events.length === 0 && agenda.reminders.length === 0 ? (
                <p className="muted">Keine Termine heute.</p>
              ) : (
                <ul className="simple-list clickable" onClick={() => navigate(ROUTES.KALENDER)}>
                  {agenda.events.map((e) => (
                    <li key={e.id}>
                      <span>{e.title}</span>
                      <span className="muted">{e.time}</span>
                    </li>
                  ))}
                  {agenda.reminders.map((r) => (
                    <li key={r.id}>
                      <span>🔔 {r.title}</span>
                      <span className="muted">{r.time}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </Card>

        <TodayTaskList />
      </div>

      <h3 className="section-title">Übersicht</h3>
      <OverviewCards />
    </div>
  );
}
