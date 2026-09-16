import { NotebookPen, FlaskConical, BarChart3, Timer, ListTodo } from "lucide-react";
import { Card } from "../../components/common/Card.jsx";
import { useAppData } from "../../context/AppDataContext.jsx";
import {
  getOpenHomework,
  getUpcomingTests,
  getOverallAverage,
  getTotalStudyMinutes,
} from "../../data/selectors.js";
import { formatGrade } from "../../utils/grades.js";
import { formatDuration } from "../../utils/date.js";
import { useRouter } from "../../router/Router.jsx";
import { ROUTES } from "../../router/routes.js";

export function OverviewCards() {
  const { state } = useAppData();
  const { navigate } = useRouter();

  const openHomework = getOpenHomework(state);
  const upcomingTests = getUpcomingTests(state);
  const overallAverage = getOverallAverage(state);
  const studyMinutes = getTotalStudyMinutes(state);

  const cards = [
    {
      icon: NotebookPen,
      label: "Hausaufgaben",
      value: openHomework.length,
      hint: "offen",
      route: ROUTES.HAUSAUFGABEN,
    },
    {
      icon: FlaskConical,
      label: "Tests",
      value: upcomingTests.length,
      hint: "bevorstehend",
      route: ROUTES.TESTS,
    },
    {
      icon: BarChart3,
      label: "Notendurchschnitt",
      value: overallAverage ? formatGrade(overallAverage) : "–",
      hint: "gesamt",
      route: ROUTES.NOTEN,
    },
    {
      icon: Timer,
      label: "Lernzeit",
      value: formatDuration(studyMinutes),
      hint: "insgesamt",
      route: ROUTES.LERNEN,
    },
    {
      icon: ListTodo,
      label: "Offene Aufgaben",
      value: openHomework.length,
      hint: "zu erledigen",
      route: ROUTES.HAUSAUFGABEN,
    },
  ];

  return (
    <div className="overview-cards">
      {cards.map((c) => (
        <Card key={c.label} className="overview-card" onClick={() => navigate(c.route)}>
          <c.icon size={20} className="overview-card__icon" />
          <span className="overview-card__value">{c.value}</span>
          <span className="overview-card__label">
            {c.label} <span className="muted">· {c.hint}</span>
          </span>
        </Card>
      ))}
    </div>
  );
}
