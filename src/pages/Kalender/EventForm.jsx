import { useState } from "react";
import { Modal } from "../../components/common/Modal.jsx";
import { FormField, Input, Select, Textarea } from "../../components/common/FormField.jsx";
import { Button } from "../../components/common/Button.jsx";
import { validateEventForm } from "../../utils/validate.js";
import { EVENT_CATEGORY_META } from "../../data/schema.js";

export function EventForm({ open, onClose, onSave, initialValues, defaultDate }) {
  const [values, setValues] = useState(
    initialValues || {
      title: "",
      date: defaultDate,
      time: "",
      description: "",
      category: "sonstige",
      color: EVENT_CATEGORY_META.sonstige.color,
    }
  );
  const [errors, setErrors] = useState({});

  const set = (field) => (e) => setValues((v) => ({ ...v, [field]: e.target.value }));

  const setCategory = (e) => {
    const category = e.target.value;
    setValues((v) => ({ ...v, category, color: EVENT_CATEGORY_META[category].color }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const fieldErrors = validateEventForm(values);
    if (Object.keys(fieldErrors).length) {
      setErrors(fieldErrors);
      return;
    }
    onSave(values);
  };

  return (
    <Modal open={open} onClose={onClose} title={values.id ? "Termin bearbeiten" : "Neuer Termin"}>
      <form onSubmit={handleSubmit} className="form">
        <FormField label="Titel" error={errors.title}>
          <Input value={values.title} onChange={set("title")} placeholder="z. B. Elternsprechtag" />
        </FormField>
        <div className="form-row">
          <FormField label="Datum" error={errors.date}>
            <Input type="date" value={values.date} onChange={set("date")} />
          </FormField>
          <FormField label="Uhrzeit">
            <Input type="time" value={values.time} onChange={set("time")} />
          </FormField>
        </div>
        <FormField label="Kategorie">
          <Select value={values.category} onChange={setCategory}>
            {Object.entries(EVENT_CATEGORY_META).map(([key, meta]) => (
              <option key={key} value={key}>
                {meta.icon} {meta.label}
              </option>
            ))}
          </Select>
        </FormField>
        <FormField label="Beschreibung">
          <Textarea value={values.description} onChange={set("description")} rows={3} />
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
