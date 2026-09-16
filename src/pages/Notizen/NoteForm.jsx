import { useState } from "react";
import { Modal } from "../../components/common/Modal.jsx";
import { FormField, Input, Select, Textarea } from "../../components/common/FormField.jsx";
import { Button } from "../../components/common/Button.jsx";
import { required } from "../../utils/validate.js";
import { todayISO } from "../../utils/date.js";

export function NoteForm({ open, onClose, onSave, initialValues, subjects }) {
  const [values, setValues] = useState(
    initialValues || { title: "", text: "", subjectId: "", date: todayISO() }
  );
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
    onSave(values);
  };

  return (
    <Modal open={open} onClose={onClose} title={values.id ? "Notiz bearbeiten" : "Neue Notiz"} width={560}>
      <form onSubmit={handleSubmit} className="form">
        <FormField label="Titel" error={errors.title}>
          <Input value={values.title} onChange={set("title")} placeholder="z. B. Ökosysteme" />
        </FormField>
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
        <FormField label="Text">
          <Textarea value={values.text} onChange={set("text")} rows={8} placeholder="Notiz…" />
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
