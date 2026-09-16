import { useState } from "react";
import { Modal } from "../../components/common/Modal.jsx";
import { FormField, Input, Textarea } from "../../components/common/FormField.jsx";
import { ColorPicker } from "../../components/common/ColorPicker.jsx";
import { Button } from "../../components/common/Button.jsx";
import { validateSubjectForm } from "../../utils/validate.js";
import { SUBJECT_COLORS } from "../../data/schema.js";

const EMPTY = { name: "", teacher: "", room: "", abbreviation: "", color: SUBJECT_COLORS[0], notes: "" };

export function SubjectForm({ open, onClose, onSave, initialValues, existingSubjects }) {
  const [values, setValues] = useState(initialValues || EMPTY);
  const [errors, setErrors] = useState({});

  const set = (field) => (e) => setValues((v) => ({ ...v, [field]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    const fieldErrors = validateSubjectForm(values, existingSubjects, values.id);
    if (Object.keys(fieldErrors).length) {
      setErrors(fieldErrors);
      return;
    }
    onSave(values);
  };

  return (
    <Modal open={open} onClose={onClose} title={values.id ? "Fach bearbeiten" : "Neues Fach"}>
      <form onSubmit={handleSubmit} className="form">
        <FormField label="Name" error={errors.name}>
          <Input value={values.name} onChange={set("name")} placeholder="z. B. Mathematik" />
        </FormField>
        <div className="form-row">
          <FormField label="Kürzel">
            <Input value={values.abbreviation} onChange={set("abbreviation")} placeholder="MA" maxLength={6} />
          </FormField>
          <FormField label="Raum">
            <Input value={values.room} onChange={set("room")} placeholder="204" />
          </FormField>
        </div>
        <FormField label="Lehrer/in">
          <Input value={values.teacher} onChange={set("teacher")} placeholder="Frau/Herr …" />
        </FormField>
        <FormField label="Farbe">
          <ColorPicker value={values.color} onChange={(color) => setValues((v) => ({ ...v, color }))} />
        </FormField>
        <FormField label="Notizen">
          <Textarea value={values.notes} onChange={set("notes")} rows={3} placeholder="Persönliche Notizen…" />
        </FormField>
        <div className="modal__footer">
          <Button variant="ghost" onClick={onClose} type="button">
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
