import { useState } from "react";
import { Modal } from "../../components/common/Modal.jsx";
import { FormField, Input, Select, Textarea } from "../../components/common/FormField.jsx";
import { Button } from "../../components/common/Button.jsx";
import { validateGradeForm } from "../../utils/validate.js";
import { todayISO } from "../../utils/date.js";

function buildEmpty(fixed) {
  return {
    subjectId: fixed?.subjectId || "",
    testId: fixed?.testId || null,
    type: fixed?.testId ? "klassenarbeit" : "sonstige",
    value: 2,
    date: todayISO(),
    note: "",
  };
}

export function GradeForm({ open, onClose, onSave, initialValues, subjects, fixed }) {
  const [values, setValues] = useState(initialValues || buildEmpty(fixed));
  const [errors, setErrors] = useState({});

  const set = (field) => (e) => setValues((v) => ({ ...v, [field]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    const fieldErrors = validateGradeForm(values);
    if (Object.keys(fieldErrors).length) {
      setErrors(fieldErrors);
      return;
    }
    onSave({ ...values, value: Number(values.value) });
  };

  return (
    <Modal open={open} onClose={onClose} title={values.id ? "Note bearbeiten" : "Note eintragen"}>
      <form onSubmit={handleSubmit} className="form">
        <FormField label="Fach" error={errors.subjectId}>
          <Select value={values.subjectId} onChange={set("subjectId")} disabled={!!fixed?.subjectId}>
            <option value="">Fach wählen…</option>
            {subjects.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </Select>
        </FormField>
        <FormField label="Art">
          <Select value={values.type} onChange={set("type")}>
            <option value="klassenarbeit">Klassenarbeit</option>
            <option value="test">Test</option>
            <option value="muendlich">Mündliche Leistung</option>
            <option value="sonstige">Sonstige Leistung</option>
          </Select>
        </FormField>
        <FormField label="Note (1–6)" error={errors.value}>
          <Select value={values.value} onChange={set("value")}>
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </Select>
        </FormField>
        <FormField label="Datum">
          <Input type="date" value={values.date} onChange={set("date")} />
        </FormField>
        <FormField label="Notiz">
          <Textarea value={values.note} onChange={set("note")} rows={2} />
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
