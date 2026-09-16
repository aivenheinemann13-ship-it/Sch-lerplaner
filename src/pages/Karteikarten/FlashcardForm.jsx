import { useState } from "react";
import { Modal } from "../../components/common/Modal.jsx";
import { FormField, Textarea, Input } from "../../components/common/FormField.jsx";
import { Button } from "../../components/common/Button.jsx";
import { required } from "../../utils/validate.js";

export function DeckForm({ open, onClose, onSave, initialValues, subjects }) {
  const [values, setValues] = useState(initialValues || { name: "", subjectId: "" });
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (required(values.name)) {
      setError("Bitte einen Namen eingeben.");
      return;
    }
    onSave(values);
  };

  return (
    <Modal open={open} onClose={onClose} title={values.id ? "Deck bearbeiten" : "Neues Deck"}>
      <form onSubmit={handleSubmit} className="form">
        <FormField label="Name" error={error}>
          <Input value={values.name} onChange={(e) => setValues((v) => ({ ...v, name: e.target.value }))} />
        </FormField>
        <FormField label="Fach">
          <select
            className="input"
            value={values.subjectId || ""}
            onChange={(e) => setValues((v) => ({ ...v, subjectId: e.target.value }))}
          >
            <option value="">Kein Fach</option>
            {subjects.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>
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

export function FlashcardForm({ open, onClose, onSave, initialValues }) {
  const [values, setValues] = useState(initialValues || { front: "", back: "" });
  const [errors, setErrors] = useState({});

  const handleSubmit = (e) => {
    e.preventDefault();
    const fieldErrors = {};
    if (required(values.front)) fieldErrors.front = "Bitte die Vorderseite ausfüllen.";
    if (required(values.back)) fieldErrors.back = "Bitte die Rückseite ausfüllen.";
    if (Object.keys(fieldErrors).length) {
      setErrors(fieldErrors);
      return;
    }
    onSave(values);
  };

  return (
    <Modal open={open} onClose={onClose} title={values.id ? "Karte bearbeiten" : "Neue Karteikarte"}>
      <form onSubmit={handleSubmit} className="form">
        <FormField label="Vorderseite (Frage)" error={errors.front}>
          <Textarea
            value={values.front}
            onChange={(e) => setValues((v) => ({ ...v, front: e.target.value }))}
            rows={2}
            placeholder="z. B. Was ist ein Verb?"
          />
        </FormField>
        <FormField label="Rückseite (Antwort)" error={errors.back}>
          <Textarea
            value={values.back}
            onChange={(e) => setValues((v) => ({ ...v, back: e.target.value }))}
            rows={2}
            placeholder="z. B. Ein Verb ist ein Tätigkeitswort."
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
