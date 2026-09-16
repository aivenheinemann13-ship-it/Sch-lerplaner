import { Card } from "../../components/common/Card.jsx";
import { FormField, Input, Select } from "../../components/common/FormField.jsx";
import { useAppData } from "../../context/AppDataContext.jsx";

export function SchoolInfoSection() {
  const { state, actions } = useAppData();
  const { klassenstufe, schulname, schuljahr, notensystem } = state.settings;

  const update = (field) => (e) => actions.updateSettings({ [field]: e.target.value });

  return (
    <Card>
      <h3 className="section-title">Schule</h3>
      <div className="form-row">
        <FormField label="Schulname">
          <Input value={schulname} onChange={update("schulname")} placeholder="z. B. Gesamtschule Musterstadt" />
        </FormField>
        <FormField label="Klassenstufe">
          <Input value={klassenstufe} onChange={update("klassenstufe")} placeholder="z. B. 9b" />
        </FormField>
      </div>
      <div className="form-row">
        <FormField label="Schuljahr">
          <Input value={schuljahr} onChange={update("schuljahr")} placeholder="z. B. 2025/2026" />
        </FormField>
        <FormField label="Notensystem">
          <Select value={notensystem} onChange={update("notensystem")}>
            <option value="1-6 (Deutschland)">1–6 (Deutschland)</option>
            <option value="1-6 (Österreich)">1–6 (Österreich)</option>
          </Select>
        </FormField>
      </div>
    </Card>
  );
}
