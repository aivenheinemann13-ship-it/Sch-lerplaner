import { Card } from "../../components/common/Card.jsx";
import { useAppData } from "../../context/AppDataContext.jsx";

const LABELS = {
  tests: "Tests",
  homework: "Hausaufgaben",
  appointments: "Termine",
  reminders: "Erinnerungen",
};

export function NotificationsSection() {
  const { state, actions } = useAppData();
  const notifications = state.settings.notifications;

  return (
    <Card>
      <h3 className="section-title">Benachrichtigungen</h3>
      <p className="muted">Steuere, für welche Bereiche Hinweise auf dem Dashboard erscheinen.</p>
      {Object.entries(LABELS).map(([key, label]) => (
        <div className="settings-row" key={key}>
          <strong>{label}</strong>
          <button
            className="toggle-switch"
            data-on={notifications[key]}
            onClick={() => actions.updateNotifications({ [key]: !notifications[key] })}
          />
        </div>
      ))}
    </Card>
  );
}
