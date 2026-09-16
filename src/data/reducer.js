// Single reducer for the whole app state tree. Action types are namespaced
// per entity (SUBJECT_*, HOMEWORK_*, ...) but all live in one file since they
// all operate on one shared state shape.

function replaceById(list, id, updater) {
  return list.map((item) => (item.id === id ? { ...item, ...updater } : item));
}

function removeById(list, id) {
  return list.filter((item) => item.id !== id);
}

export function reducer(state, action) {
  switch (action.type) {
    // --- Subjects ---
    case "SUBJECT_ADD":
      return { ...state, subjects: [...state.subjects, action.payload] };
    case "SUBJECT_UPDATE":
      return { ...state, subjects: replaceById(state.subjects, action.payload.id, action.payload) };
    case "SUBJECT_DELETE":
      return { ...state, subjects: removeById(state.subjects, action.payload.id) };

    // --- Timetables ---
    case "TIMETABLE_ADD":
      return { ...state, timetables: [...state.timetables, action.payload] };
    case "TIMETABLE_UPDATE":
      return { ...state, timetables: replaceById(state.timetables, action.payload.id, action.payload) };
    case "TIMETABLE_DELETE":
      return {
        ...state,
        timetables: removeById(state.timetables, action.payload.id),
        lessons: state.lessons.filter((l) => l.timetableId !== action.payload.id),
        breaks: state.breaks.filter((b) => b.timetableId !== action.payload.id),
      };
    case "TIMETABLE_SET_ACTIVE":
      return {
        ...state,
        timetables: state.timetables.map((t) => ({ ...t, isActive: t.id === action.payload.id })),
      };

    // --- Lessons / Breaks ---
    case "LESSON_ADD":
      return { ...state, lessons: [...state.lessons, action.payload] };
    case "LESSON_UPDATE":
      return { ...state, lessons: replaceById(state.lessons, action.payload.id, action.payload) };
    case "LESSON_DELETE":
      return { ...state, lessons: removeById(state.lessons, action.payload.id) };
    case "BREAK_ADD":
      return { ...state, breaks: [...state.breaks, action.payload] };
    case "BREAK_UPDATE":
      return { ...state, breaks: replaceById(state.breaks, action.payload.id, action.payload) };
    case "BREAK_DELETE":
      return { ...state, breaks: removeById(state.breaks, action.payload.id) };

    // --- Homework ---
    case "HOMEWORK_ADD":
      return { ...state, homework: [...state.homework, action.payload] };
    case "HOMEWORK_UPDATE":
      return { ...state, homework: replaceById(state.homework, action.payload.id, action.payload) };
    case "HOMEWORK_DELETE":
      return { ...state, homework: removeById(state.homework, action.payload.id) };
    case "HOMEWORK_SET_STATUS":
      return {
        ...state,
        homework: replaceById(state.homework, action.payload.id, {
          status: action.payload.status,
          completedAt: action.payload.status === "erledigt" ? new Date().toISOString() : null,
        }),
      };

    // --- Reminders ---
    case "REMINDER_ADD":
      return { ...state, reminders: [...state.reminders, action.payload] };
    case "REMINDER_UPDATE":
      return { ...state, reminders: replaceById(state.reminders, action.payload.id, action.payload) };
    case "REMINDER_DELETE":
      return { ...state, reminders: removeById(state.reminders, action.payload.id) };

    // --- Calendar events ---
    case "EVENT_ADD":
      return { ...state, events: [...state.events, action.payload] };
    case "EVENT_UPDATE":
      return { ...state, events: replaceById(state.events, action.payload.id, action.payload) };
    case "EVENT_DELETE":
      return { ...state, events: removeById(state.events, action.payload.id) };

    // --- Tests ---
    case "TEST_ADD":
      return { ...state, tests: [...state.tests, action.payload] };
    case "TEST_UPDATE":
      return { ...state, tests: replaceById(state.tests, action.payload.id, action.payload) };
    case "TEST_DELETE":
      return {
        ...state,
        tests: removeById(state.tests, action.payload.id),
        grades: state.grades.filter((g) => g.testId !== action.payload.id),
      };

    // --- Grades ---
    case "GRADE_ADD": {
      const grades = [...state.grades, action.payload];
      const tests = action.payload.testId
        ? replaceById(state.tests, action.payload.testId, { status: "bewertet", gradeId: action.payload.id })
        : state.tests;
      return { ...state, grades, tests };
    }
    case "GRADE_UPDATE":
      return { ...state, grades: replaceById(state.grades, action.payload.id, action.payload) };
    case "GRADE_DELETE": {
      const grade = state.grades.find((g) => g.id === action.payload.id);
      const tests = grade?.testId
        ? replaceById(state.tests, grade.testId, { status: "geschrieben", gradeId: null })
        : state.tests;
      return { ...state, grades: removeById(state.grades, action.payload.id), tests };
    }

    // --- Study sessions ---
    case "STUDY_SESSION_ADD":
      return { ...state, studySessions: [...state.studySessions, action.payload] };
    case "STUDY_SESSION_UPDATE":
      return {
        ...state,
        studySessions: replaceById(state.studySessions, action.payload.id, action.payload),
      };
    case "STUDY_SESSION_DELETE":
      return { ...state, studySessions: removeById(state.studySessions, action.payload.id) };

    // --- Goals ---
    case "GOAL_ADD":
      return { ...state, goals: [...state.goals, action.payload] };
    case "GOAL_UPDATE":
      return { ...state, goals: replaceById(state.goals, action.payload.id, action.payload) };
    case "GOAL_DELETE":
      return { ...state, goals: removeById(state.goals, action.payload.id) };

    // --- Flashcards / decks ---
    case "DECK_ADD":
      return { ...state, decks: [...state.decks, action.payload] };
    case "DECK_UPDATE":
      return { ...state, decks: replaceById(state.decks, action.payload.id, action.payload) };
    case "DECK_DELETE":
      return {
        ...state,
        decks: removeById(state.decks, action.payload.id),
        flashcards: state.flashcards.filter((c) => c.deckId !== action.payload.id),
      };
    case "FLASHCARD_ADD":
      return { ...state, flashcards: [...state.flashcards, action.payload] };
    case "FLASHCARD_UPDATE":
      return { ...state, flashcards: replaceById(state.flashcards, action.payload.id, action.payload) };
    case "FLASHCARD_DELETE":
      return { ...state, flashcards: removeById(state.flashcards, action.payload.id) };
    case "FLASHCARD_MARK": {
      const card = state.flashcards.find((c) => c.id === action.payload.id);
      if (!card) return state;
      const isCorrect = action.payload.result === "richtig";
      return {
        ...state,
        flashcards: replaceById(state.flashcards, card.id, {
          correctCount: card.correctCount + (isCorrect ? 1 : 0),
          wrongCount: card.wrongCount + (isCorrect ? 0 : 1),
          lastResult: action.payload.result,
        }),
      };
    }

    // --- Notes ---
    case "NOTE_ADD":
      return { ...state, notes: [...state.notes, action.payload] };
    case "NOTE_UPDATE":
      return {
        ...state,
        notes: replaceById(state.notes, action.payload.id, {
          ...action.payload,
          updatedAt: new Date().toISOString(),
        }),
      };
    case "NOTE_DELETE":
      return { ...state, notes: removeById(state.notes, action.payload.id) };

    // --- Documents ---
    case "DOCUMENT_ADD":
      return { ...state, documents: [...state.documents, action.payload] };
    case "DOCUMENT_DELETE":
      return { ...state, documents: removeById(state.documents, action.payload.id) };

    // --- Settings ---
    case "SETTINGS_UPDATE":
      return { ...state, settings: { ...state.settings, ...action.payload } };
    case "NOTIFICATIONS_UPDATE":
      return {
        ...state,
        settings: {
          ...state.settings,
          notifications: { ...state.settings.notifications, ...action.payload },
        },
      };

    // --- Data management ---
    case "DATA_IMPORT":
      return action.payload;
    case "DATA_RESET":
      return action.payload;

    default:
      return state;
  }
}
