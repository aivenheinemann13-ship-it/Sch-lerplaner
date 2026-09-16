import { PageHeader } from "../../components/common/Card.jsx";
import { Timer } from "./Timer.jsx";
import { SessionLog } from "./SessionLog.jsx";
import { useAppData } from "../../context/AppDataContext.jsx";
import { getTotalStudyMinutes, getStudyMinutesToday } from "../../data/selectors.js";
import { formatDuration } from "../../utils/date.js";
import { Card } from "../../components/common/Card.jsx";

export function LernenPage() {
  const { state } = useAppData();
  const total = getTotalStudyMinutes(state);
  const today = getStudyMinutesToday(state);

  return (
    <div>
      <PageHeader title="Lernen" subtitle="Normal- oder Pomodoro-Timer" />

      <div className="fach-detail-grid">
        <Card className="stat-card">
          <span className="stat-card__label">Heute gelernt</span>
          <span className="stat-card__value">{formatDuration(today)}</span>
        </Card>
        <Card className="stat-card">
          <span className="stat-card__label">Insgesamt</span>
          <span className="stat-card__value">{formatDuration(total)}</span>
        </Card>
      </div>

      <Timer />
      <SessionLog />
    </div>
  );
}
