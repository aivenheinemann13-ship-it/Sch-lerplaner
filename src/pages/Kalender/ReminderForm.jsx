import { useState } from "react";
import { Modal } from "../../components/common/Modal.jsx";
import { FormField, Input, Textarea } from "../../components/common/FormField.jsx";
import { Button } from "../../components/common/Button.jsx";
import { required, isValidDate } from "../../utils/validate.js";
import { todayISO } from "../../utils/date.js";

export function ReminderForm({ open, onClose, onSave, initialValues }) {
  const [values, setValues] = useState(
    initialValues || { title: "", date: todayISO(), time: "08:00", note: "" }
  );
  const [errors, setErrors] = useState({});

  const set = (field) => (e) => setValues((v) => ({ ...v, [field]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    const fieldErrors = {};
    if (required(values.title)) fieldErrors.title = "Bitte einen Titel eingeben.";
    if (!isValidDate(values.date)) fieldErrors.date = "Bitte ein gültiges Datum wählen.";
    if (Object.keys(fieldErrors).length) {
      setErrors(fieldErrors);
      return;
    }
    onSave(values);
  };

  return (
    <Modal open={open} onClose={onClose} title={values.id ? "Erinnerung bearbeiten" : "Neue Erinnerung"}>
      <form onSubmit={handleSubmit} className="form">
        <FormField label="Titel" error={errors.title}>
          <Input value={values.title} onChange={set("title")} placeholder="z. B. Mathe-Hausaufgaben machen" />
        </FormField>
        <div className="form-row">
          <FormField label="Datum" error={errors.date}>
            <Input type="date" value={values.date} onChange={set("date")} />
          </FormField>
          <FormField label="Uhrzeit">
            <Input type="time" value={values.time} onChange={set("time")} />
          </FormField>
        </div>
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
