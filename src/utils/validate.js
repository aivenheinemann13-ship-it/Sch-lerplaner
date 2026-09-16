// Shared field validators. Each returns an error string (German, user-facing)
// or null if the value is valid.

export function required(value, label = "Dieses Feld") {
  if (value === null || value === undefined) return `${label} ist erforderlich.`;
  if (typeof value === "string" && value.trim() === "") return `${label} ist erforderlich.`;
  return null;
}

export function isDuplicateName(list, name, excludeId = null) {
  const normalized = name.trim().toLowerCase();
  return list.some(
    (item) => item.id !== excludeId && item.name.trim().toLowerCase() === normalized
  );
}

export function isValidDate(iso) {
  if (!iso) return false;
  return /^\d{4}-\d{2}-\d{2}$/.test(iso);
}

export function isValidTime(time) {
  if (!time) return false;
  return /^\d{2}:\d{2}$/.test(time);
}

export function isValidGradeValue(value) {
  const n = Number(value);
  return Number.isFinite(n) && n >= 1 && n <= 6;
}

export function isEndAfterStart(start, end) {
  if (!start || !end) return true;
  return end > start;
}

export function validateSubjectForm(values, existingSubjects, excludeId = null) {
  const errors = {};
  const nameError = required(values.name, "Fachname");
  if (nameError) errors.name = nameError;
  else if (isDuplicateName(existingSubjects, values.name, excludeId)) {
    errors.name = "Ein Fach mit diesem Namen existiert bereits.";
  }
  return errors;
}

export function validateHomeworkForm(values) {
  const errors = {};
  if (required(values.subjectId, "Fach")) errors.subjectId = "Bitte ein Fach auswählen.";
  if (required(values.task, "Aufgabe")) errors.task = "Bitte eine Aufgabe eingeben.";
  if (!isValidDate(values.dueDate)) errors.dueDate = "Bitte ein gültiges Abgabedatum wählen.";
  return errors;
}

export function validateTestForm(values) {
  const errors = {};
  if (required(values.subjectId, "Fach")) errors.subjectId = "Bitte ein Fach auswählen.";
  if (!isValidDate(values.date)) errors.date = "Bitte ein gültiges Datum wählen.";
  if (required(values.topic, "Thema")) errors.topic = "Bitte ein Thema eingeben.";
  return errors;
}

export function validateGradeForm(values) {
  const errors = {};
  if (required(values.subjectId, "Fach")) errors.subjectId = "Bitte ein Fach auswählen.";
  if (!isValidGradeValue(values.value)) errors.value = "Note muss zwischen 1 und 6 liegen.";
  return errors;
}

export function validateEventForm(values) {
  const errors = {};
  if (required(values.title, "Titel")) errors.title = "Bitte einen Titel eingeben.";
  if (!isValidDate(values.date)) errors.date = "Bitte ein gültiges Datum wählen.";
  return errors;
}
