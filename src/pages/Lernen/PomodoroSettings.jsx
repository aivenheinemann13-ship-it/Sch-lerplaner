import { FormField, Input } from "../../components/common/FormField.jsx";

export function PomodoroSettings({ settings, onChange, disabled }) {
  const set = (field) => (e) => onChange({ ...settings, [field]: Number(e.target.value) });

  return (
    <div className="pomodoro-settings">
      <FormField label="Lernzeit (Min)">
        <Input type="number" min={5} max={90} value={settings.workMinutes} onChange={set("workMinutes")} disabled={disabled} />
      </FormField>
      <FormField label="Pause (Min)">
        <Input type="number" min={1} max={30} value={settings.breakMinutes} onChange={set("breakMinutes")} disabled={disabled} />
      </FormField>
      <FormField label="Lange Pause (Min)">
        <Input type="number" min={5} max={60} value={settings.longBreakMinutes} onChange={set("longBreakMinutes")} disabled={disabled} />
      </FormField>
      <FormField label="Runden bis lange Pause">
        <Input type="number" min={2} max={8} value={settings.roundsUntilLongBreak} onChange={set("roundsUntilLongBreak")} disabled={disabled} />
      </FormField>
    </div>
  );
}
