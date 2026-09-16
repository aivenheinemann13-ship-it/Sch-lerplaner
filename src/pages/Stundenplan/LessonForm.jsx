import { useState } from "react";
import { Modal } from "../../components/common/Modal.jsx";
import { FormField, Input, Select } from "../../components/common/FormField.jsx";
import { Button } from "../../components/common/Button.jsx";
import { WEEKDAYS_DE } from "../../utils/date.js";
import { isValidTime, isEndAfterStart } from "../../utils/validate.js";

const EMPTY_LESSON = { day: 0, startTime: "08:00", endTime: "08:45", subjectId: "", room: "", teacher: "" };
const EMPTY_BREAK = { day: 0, startTime: "09:30", endTime: "09:45", label: "Pause" };

export function LessonForm({ open, onClose, onSave, initialValues, subjects, entryType = "lesson" }) {
  const [type, setType] = useState(entryType);
  const [values, setValues] = useState(
    initialValues || (entryType === "break" ? EMPTY_BREAK : EMPTY_LESSON)
  );
  const [errors, setErrors] = useState({});

  const set = (field) => (e) => setValues((v) => ({ ...v, [field]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    const fieldErrors = {};
    if (!isValidTime(values.startTime)) fieldErrors.startTime = "Ungültige Uhrzeit.";
    if (!isValidTime(values.endTime)) fieldErrors.endTime = "Ungültige Uhrzeit.";
    if (!isEndAfterStart(values.startTime, values.endTime)) {
      fieldErrors.endTime = "Ende muss nach dem Start liegen.";
    }
    if (type === "lesson" && !values.subjectId) fieldErrors.subjectId = "Bitte ein Fach wählen.";
    if (type === "break" && !values.label?.trim()) fieldErrors.label = "Bitte eine Bezeichnung eingeben.";

    if (Object.keys(fieldErrors).length) {
      setErrors(fieldErrors);
      return;
    }
    onSave(type, { ...values, day: Number(values.day) });
  };

  return (
    <Modal open={open} onClose={onClose} title={initialValues ? "Eintrag bearbeiten" : "Neuer Eintrag"}>
      <form onSubmit={handleSubmit} className="form">
        {!initialValues && (
          <div className="segmented">
            <button
              type="button"
              className={type === "lesson" ? "segmented__btn segmented__btn--active" : "segmented__btn"}
              onClick={() => setType("lesson")}
            >
              Unterrichtsstunde
            </button>
            <button
              type="button"
              className={type === "break" ? "segmented__btn segmented__btn--active" : "segmented__btn"}
              onClick={() => setType("break")}
            >
              Pause
            </button>
          </div>
        )}

        <FormField label="Wochentag">
          <Select value={values.day} onChange={set("day")}>
            {WEEKDAYS_DE.map((d, i) => (
              <option key={d} value={i}>
                {d}
              </option>
            ))}
          </Select>
        </FormField>

        <div className="form-row">
          <FormField label="Von" error={errors.startTime}>
            <Input type="time" value={values.startTime} onChange={set("startTime")} />
          </FormField>
          <FormField label="Bis" error={errors.endTime}>
            <Input type="time" value={values.endTime} onChange={set("endTime")} />
          </FormField>
        </div>

        {type === "lesson" ? (
          <>
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
              <FormField label="Raum">
                <Input value={values.room} onChange={set("room")} placeholder="204" />
              </FormField>
              <FormField label="Lehrer/in">
                <Input value={values.teacher} onChange={set("teacher")} placeholder="Frau/Herr …" />
              </FormField>
            </div>
          </>
        ) : (
          <FormField label="Bezeichnung" error={errors.label}>
            <Input value={values.label} onChange={set("label")} placeholder="Pause" />
          </FormField>
        )}

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
