import { useState } from "react";
import { Modal } from "../../components/common/Modal.jsx";
import { FormField, Input, Select, Textarea } from "../../components/common/FormField.jsx";
import { Button } from "../../components/common/Button.jsx";
import { required } from "../../utils/validate.js";

const EMPTY = { title: "", description: "", progress: 0, deadline: "", subjectId: "", priority: "mittel" };

export function GoalForm({ open, onClose, onSave, initialValues, subjects }) {
  const [values, setValues] = useState(initialValues || EMPTY);
  const [errors, setErrors] = useState({});

  const set = (field) => (e) => setValues((v) => ({ ...v, [field]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    const fieldErrors = {};
    if (required(values.title)) fieldErrors.title = "Bitte einen Titel eingeben.";
    if (Object.keys(fieldErrors).length) {
      setErrors(fieldErrors);
      return;
    }
    onSave({ ...values, progress: Number(values.progress) || 0 });
  };

  return (
    <Modal open={open} onClose={onClose} title={values.id ? "Ziel bearbeiten" : "Neues Ziel"}>
      <form onSubmit={handleSubmit} className="form">
        <FormField label="Titel" error={errors.title}>
          <Input value={values.title} onChange={set("title")} placeholder="z. B. Mathe auf Note 2 verbessern" />
        </FormField>
        <FormField label="Beschreibung">
          <Textarea value={values.description} onChange={set("description")} rows={2} />
        </FormField>
        <div className="form-row">
          <FormField label="Fach">
            <Select value={values.subjectId} onChange={set("subjectId")}>
              <option value="">Kein Fach</option>
              {subjects.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </Select>
          </FormField>
          <FormField label="Priorität">
            <Select value={values.priority} onChange={set("priority")}>
              <option value="hoch">🔴 Hoch</option>
              <option value="mittel">🟡 Mittel</option>
              <option value="niedrig">🟢 Niedrig</option>
            </Select>
          </FormField>
        </div>
        <FormField label="Deadline">
          <Input type="date" value={values.deadline || ""} onChange={set("deadline")} />
        </FormField>
        <FormField label={`Fortschritt (${values.progress}%)`}>
          <input
            type="range"
            min={0}
            max={100}
            step={5}
            value={values.progress}
            onChange={(e) => setValues((v) => ({ ...v, progress: Number(e.target.value) }))}
            className="range-input"
          />
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
