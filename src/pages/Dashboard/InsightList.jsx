import { useAppData } from "../../context/AppDataContext.jsx";
import { useRouter } from "../../router/Router.jsx";
import { getInsights } from "../../data/insights.js";
import { Icon } from "../../components/common/Icon.jsx";

export function InsightList() {
  const { state } = useAppData();
  const { navigate } = useRouter();
  const insights = getInsights(state);

  return (
    <div className="insight-list">
      {insights.map((insight) => (
        <button
          key={insight.id}
          className={`insight insight--${insight.severity} ${insight.route ? "insight--clickable" : ""}`}
          onClick={() => insight.route && navigate(insight.route)}
          disabled={!insight.route}
        >
          <Icon name={insight.icon} size={18} />
          <span>{insight.text}</span>
        </button>
      ))}
    </div>
  );
}
