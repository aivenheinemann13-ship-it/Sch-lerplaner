import { useState } from "react";
import { Modal } from "../../components/common/Modal.jsx";
import { FormField, Input, Select, Textarea } from "../../components/common/FormField.jsx";
import { Button } from "../../components/common/Button.jsx";
import { validateTestForm } from "../../utils/validate.js";
import { todayISO } from "../../utils/date.js";

const EMPTY = {
  subjectId: "",
  date: todayISO(),
  time: "",
  topic: "",
  material: "",
  room: "",
  status: "geplant",
};

export function TestForm({ open, onClose, onSave, initialValues, subjects }) {
  const [values, setValues] = useState(initialValues || EMPTY);
  const [errors, setErrors] = useState({});

  const set = (field) => (e) => setValues((v) => ({ ...v, [field]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    const fieldErrors = validateTestForm(values);
    if (Object.keys(fieldErrors).length) {
      setErrors(fieldErrors);
      return;
    }
    onSave(values);
  };

  return (
    <Modal open={open} onClose={onClose} title={values.id ? "Test bearbeiten" : "Neuer Test"}>
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
        <div className="form-row">
          <FormField label="Datum" error={errors.date}>
            <Input type="date" value={values.date} onChange={set("date")} />
          </FormField>
          <FormField label="Uhrzeit">
            <Input type="time" value={values.time} onChange={set("time")} />
          </FormField>
        </div>
        <FormField label="Thema" error={errors.topic}>
          <Input value={values.topic} onChange={set("topic")} placeholder="z. B. Terme und Gleichungen" />
        </FormField>
        <FormField label="Lernstoff">
          <Textarea
            value={values.material}
            onChange={set("material")}
            rows={3}
            placeholder="z. B. Kapitel 3–5"
          />
        </FormField>
        <FormField label="Raum">
          <Input value={values.room} onChange={set("room")} placeholder="204" />
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
