import { createId } from "../utils/id.js";
import { todayISO } from "../utils/date.js";

export const SCHEMA_VERSION = 2;

export const PRIORITIES = ["hoch", "mittel", "niedrig"];
export const HOMEWORK_STATUSES = ["offen", "in_bearbeitung", "erledigt"];
export const TEST_STATUSES = ["geplant", "geschrieben", "bewertet"];
export const GRADE_TYPES = ["klassenarbeit", "test", "muendlich", "sonstige"];
export const EVENT_CATEGORIES = ["schule", "hausaufgabe", "test", "termin", "sonstige"];
export const DOCUMENT_CATEGORIES = [
  "arbeitsblaetter",
  "hausaufgaben",
  "lernzettel",
  "praesentationen",
  "sonstiges",
];
export const ACCENT_COLORS = ["blau", "violett", "gruen", "rot", "orange"];

export const SUBJECT_COLORS = [
  "#3b82f6", "#8b5cf6", "#22c55e", "#ef4444", "#f97316",
  "#06b6d4", "#eab308", "#ec4899", "#6366f1", "#14b8a6",
];

export const EVENT_CATEGORY_META = {
  schule: { label: "Schule", icon: "📚", color: "#3b82f6" },
  hausaufgabe: { label: "Hausaufgabe", icon: "📝", color: "#f59e0b" },
  test: { label: "Test", icon: "🧪", color: "#ef4444" },
  termin: { label: "Termin", icon: "🏫", color: "#8b5cf6" },
  sonstige: { label: "Sonstiges", icon: "🎯", color: "#6b7280" },
};

export const DOCUMENT_CATEGORY_LABELS = {
  arbeitsblaetter: "Arbeitsblätter",
  hausaufgaben: "Hausaufgaben",
  lernzettel: "Lernzettel",
  praesentationen: "Präsentationen",
  sonstiges: "Sonstiges",
};

export function createSubject(overrides = {}) {
  return {
    id: createId(),
    name: "",
    teacher: "",
    room: "",
    color: SUBJECT_COLORS[0],
    abbreviation: "",
    notes: "",
    createdAt: new Date().toISOString(),
    ...overrides,
  };
}

export function createTimetable(overrides = {}) {
  return {
    id: createId(),
    name: "Stundenplan",
    isActive: false,
    createdAt: new Date().toISOString(),
    ...overrides,
  };
}

export function createLesson(overrides = {}) {
  return {
    id: createId(),
    timetableId: null,
    subjectId: null,
    day: 0,
    startTime: "08:00",
    endTime: "08:45",
    room: "",
    teacher: "",
    ...overrides,
  };
}

export function createBreak(overrides = {}) {
  return {
    id: createId(),
    timetableId: null,
    day: 0,
    startTime: "09:30",
    endTime: "09:45",
    label: "Pause",
    ...overrides,
  };
}

export function createHomework(overrides = {}) {
  return {
    id: createId(),
    subjectId: null,
    task: "",
    description: "",
    dueDate: todayISO(),
    priority: "mittel",
    status: "offen",
    notes: "",
    createdAt: new Date().toISOString(),
    completedAt: null,
    ...overrides,
  };
}

export function createReminder(overrides = {}) {
  return {
    id: createId(),
    title: "",
    date: todayISO(),
    time: "08:00",
    note: "",
    createdAt: new Date().toISOString(),
    ...overrides,
  };
}

export function createEvent(overrides = {}) {
  return {
    id: createId(),
    title: "",
    date: todayISO(),
    time: "",
    description: "",
    category: "sonstige",
    color: EVENT_CATEGORY_META.sonstige.color,
    createdAt: new Date().toISOString(),
    ...overrides,
  };
}

export function createTest(overrides = {}) {
  return {
    id: createId(),
    subjectId: null,
    date: todayISO(),
    time: "",
    topic: "",
    material: "",
    room: "",
    status: "geplant",
    gradeId: null,
    createdAt: new Date().toISOString(),
    ...overrides,
  };
}

export function createGrade(overrides = {}) {
  return {
    id: createId(),
    subjectId: null,
    testId: null,
    type: "sonstige",
    value: 2,
    weight: 1,
    date: todayISO(),
    note: "",
    createdAt: new Date().toISOString(),
    ...overrides,
  };
}

export function createStudySession(overrides = {}) {
  return {
    id: createId(),
    subjectId: null,
    mode: "normal",
    goal: "",
    plannedMinutes: 0,
    actualMinutes: 0,
    startedAt: new Date().toISOString(),
    endedAt: null,
    ...overrides,
  };
}

export function createGoal(overrides = {}) {
  return {
    id: createId(),
    title: "",
    description: "",
    progress: 0,
    deadline: null,
    subjectId: null,
    priority: "mittel",
    achievedAt: null,
    createdAt: new Date().toISOString(),
    ...overrides,
  };
}

export function createDeck(overrides = {}) {
  return {
    id: createId(),
    name: "",
    subjectId: null,
    createdAt: new Date().toISOString(),
    ...overrides,
  };
}

export function createFlashcard(overrides = {}) {
  return {
    id: createId(),
    deckId: null,
    front: "",
    back: "",
    correctCount: 0,
    wrongCount: 0,
    lastResult: null,
    createdAt: new Date().toISOString(),
    ...overrides,
  };
}

export function createNote(overrides = {}) {
  return {
    id: createId(),
    title: "",
    text: "",
    subjectId: null,
    date: todayISO(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    ...overrides,
  };
}

export function createDocument(overrides = {}) {
  return {
    id: createId(),
    name: "",
    category: "sonstiges",
    subjectId: null,
    sizeBytes: 0,
    mimeType: "",
    createdAt: new Date().toISOString(),
    fileRef: null,
    ...overrides,
  };
}

export function defaultSettings() {
  return {
    darkMode: false,
    accentColor: "blau",
    animationsEnabled: true,
    klassenstufe: "",
    schulname: "",
    schuljahr: "",
    notensystem: "1-6 (Deutschland)",
    notifications: {
      tests: true,
      homework: true,
      appointments: true,
      reminders: true,
    },
  };
}

export function emptyState() {
  return {
    subjects: [],
    timetables: [],
    lessons: [],
    breaks: [],
    homework: [],
    reminders: [],
    events: [],
    tests: [],
    grades: [],
    studySessions: [],
    goals: [],
    decks: [],
    flashcards: [],
    notes: [],
    documents: [],
    settings: defaultSettings(),
    meta: { schemaVersion: SCHEMA_VERSION },
  };
}
