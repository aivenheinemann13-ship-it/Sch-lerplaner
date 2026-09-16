import { useState } from "react";
import { Modal } from "../../components/common/Modal.jsx";
import { FormField, Input, Select, Textarea } from "../../components/common/FormField.jsx";
import { Button } from "../../components/common/Button.jsx";
import { validateHomeworkForm } from "../../utils/validate.js";
import { todayISO } from "../../utils/date.js";

const EMPTY = {
  subjectId: "",
  task: "",
  description: "",
  dueDate: todayISO(),
  priority: "mittel",
  status: "offen",
  notes: "",
};

export function HomeworkForm({ open, onClose, onSave, initialValues, subjects }) {
  const [values, setValues] = useState(initialValues || EMPTY);
  const [errors, setErrors] = useState({});

  const set = (field) => (e) => setValues((v) => ({ ...v, [field]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    const fieldErrors = validateHomeworkForm(values);
    if (Object.keys(fieldErrors).length) {
      setErrors(fieldErrors);
      return;
    }
    onSave(values);
  };

  return (
    <Modal open={open} onClose={onClose} title={values.id ? "Hausaufgabe bearbeiten" : "Neue Hausaufgabe"}>
      <form onSubmit={handleSubmit} className="form">
        <FormField label="Fach" error={errors.subjectId}>
          <Select value={values.subjectId} onChange={set("subjectId")}>
            <option value="">Fach wählen…</option>
            {subjects.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </Select>
        </FormField>
        <FormField label="Aufgabe" error={errors.task}>
          <Input value={values.task} onChange={set("task")} placeholder="z. B. Vokabeln lernen" />
        </FormField>
        <FormField label="Beschreibung">
          <Textarea value={values.description} onChange={set("description")} rows={3} />
        </FormField>
        <div className="form-row">
          <FormField label="Abgabedatum" error={errors.dueDate}>
            <Input type="date" value={values.dueDate} onChange={set("dueDate")} />
          </FormField>
          <FormField label="Priorität">
            <Select value={values.priority} onChange={set("priority")}>
              <option value="hoch">🔴 Hoch</option>
              <option value="mittel">🟡 Mittel</option>
              <option value="niedrig">🟢 Niedrig</option>
            </Select>
          </FormField>
        </div>
        <FormField label="Status">
          <Select value={values.status} onChange={set("status")}>
            <option value="offen">Offen</option>
            <option value="in_bearbeitung">In Bearbeitung</option>
            <option value="erledigt">Erledigt</option>
          </Select>
        </FormField>
        <FormField label="Notizen">
          <Textarea value={values.notes} onChange={set("notes")} rows={2} />
        </FormField>
        <div className="modal__footer">
          <Button variant="ghost" type="button" onClick={onClose}>
            Abbrechen
          </Button>
          <Button variant="primary" type="submit">
            Speichern
          </Button>
        </div>
      </form>
    </Modal>
  );
}
