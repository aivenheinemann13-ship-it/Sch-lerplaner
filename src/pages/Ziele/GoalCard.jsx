import { Pencil, Trash2, Trophy } from "lucide-react";
import { Card } from "../../components/common/Card.jsx";
import { ProgressBar } from "../../components/common/ProgressBar.jsx";
import { PriorityBadge } from "../../components/common/Badge.jsx";
import { subjectName } from "../../data/selectors.js";
import { useAppData } from "../../context/AppDataContext.jsx";
import { formatGermanDate } from "../../utils/date.js";

export function GoalCard({ goal, onEdit, onDelete }) {
  const { state } = useAppData();

  return (
    <Card className="goal-card">
      <div className="goal-card__top">
        <h4>
          {goal.achievedAt && <Trophy size={16} className="goal-card__trophy" />} {goal.title}
        </h4>
        <PriorityBadge priority={goal.priority} />
      </div>
      {goal.description && <p className="muted">{goal.description}</p>}
      <ProgressBar value={goal.progress} tone={goal.progress >= 100 ? "success" : "accent"} />
      <div className="goal-card__meta">
        {goal.subjectId && <span>{subjectName(state, goal.subjectId)}</span>}
        {goal.deadline && <span>Bis {formatGermanDate(goal.deadline, { short: true })}</span>}
      </div>
      <div className="goal-card__actions">
        <button className="icon-button icon-button--sm" onClick={() => onEdit(goal)}>
          <Pencil size={14} />
        </button>
        <button className="icon-button icon-button--sm" onClick={() => onDelete(goal)}>
          <Trash2 size={14} />
        </button>
      </div>
    </Card>
  );
}
