import { emptyState, createSubject, createTimetable } from "./schema.js";

const DEFAULT_SUBJECTS = [
  { name: "Mathematik", abbreviation: "MA", color: "#3b82f6" },
  { name: "Deutsch", abbreviation: "DE", color: "#ef4444" },
  { name: "Englisch", abbreviation: "EN", color: "#22c55e" },
  { name: "Geschichte", abbreviation: "GE", color: "#f97316" },
  { name: "Biologie", abbreviation: "BIO", color: "#14b8a6" },
  { name: "Physik", abbreviation: "PH", color: "#6366f1" },
  { name: "Chemie", abbreviation: "CH", color: "#eab308" },
  { name: "Erdkunde", abbreviation: "EK", color: "#8b5cf6" },
  { name: "Sport", abbreviation: "SP", color: "#06b6d4" },
  { name: "Kunst", abbreviation: "KU", color: "#ec4899" },
  { name: "Musik", abbreviation: "MU", color: "#f43f5e" },
  { name: "Informatik", abbreviation: "IF", color: "#0ea5e9" },
];

export function buildSeedState() {
  const state = emptyState();

  state.subjects = DEFAULT_SUBJECTS.map((s) => createSubject(s));
  state.timetables = [createTimetable({ name: "Mein Stundenplan", isActive: true })];

  return state;
}
