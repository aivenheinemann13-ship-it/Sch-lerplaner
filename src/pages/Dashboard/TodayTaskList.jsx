import { Card } from "../../components/common/Card.jsx";
import { useAppData } from "../../context/AppDataContext.jsx";
import { subjectName } from "../../data/selectors.js";
import { daysUntilISO, todayISO } from "../../utils/date.js";
import { useRouter } from "../../router/Router.jsx";
import { ROUTES } from "../../router/routes.js";

export function TodayTaskList() {
  const { state } = useAppData();
  const { navigate } = useRouter();

  const dringend = state.homework.filter(
    (h) => h.status !== "erledigt" && (h.priority === "hoch" || daysUntilISO(h.dueDate) < 0)
  );
  const baldFaellig = state.homework.filter(
    (h) =>
      h.status !== "erledigt" &&
      h.priority !== "hoch" &&
      daysUntilISO(h.dueDate) >= 0 &&
      daysUntilISO(h.dueDate) <= 2
  );
  const erledigtHeute = state.homework.filter(
    (h) => h.status === "erledigt" && (h.completedAt || "").slice(0, 10) === todayISO()
  );

  const groups = [
    { label: "Dringend", dot: "🔴", items: dringend },
    { label: "Bald fällig", dot: "🟡", items: baldFaellig },
    { label: "Erledigt heute", dot: "🟢", items: erledigtHeute },
  ];

  return (
    <Card>
      <h3 className="section-title">Aufgaben</h3>
      {groups.map((g) => (
        <div key={g.label} className="task-group">
          <h4 className="task-group__title">
            {g.dot} {g.label} ({g.items.length})
          </h4>
          {g.items.length === 0 ? (
            <p className="muted">Keine Aufgaben.</p>
          ) : (
            <ul className="simple-list" onClick={() => navigate(ROUTES.HAUSAUFGABEN)}>
              {g.items.slice(0, 4).map((h) => (
                <li key={h.id} className="clickable">
                  <span>{h.task}</span>
                  <span className="muted">{subjectName(state, h.subjectId)}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      ))}
    </Card>
  );
}
