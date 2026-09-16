import { createContext, useContext, useEffect, useMemo, useReducer, useRef } from "react";
import { reducer } from "../data/reducer.js";
import { loadState, saveState } from "../data/storage.js";
import { useDebouncedEffect } from "../hooks/useDebounced.js";
import {
  createSubject,
  createTimetable,
  createLesson,
  createBreak,
  createHomework,
  createReminder,
  createEvent,
  createTest,
  createGrade,
  createStudySession,
  createGoal,
  createDeck,
  createFlashcard,
  createNote,
  createDocument,
} from "../data/schema.js";

const AppDataContext = createContext(null);

export function AppDataProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, undefined, loadState);

  useDebouncedEffect(state, (latest) => saveState(latest), 400);

  // Guarantee a save on tab close / reload / navigation-away even if the
  // debounce window (400ms) hasn't elapsed yet since the last change.
  const stateRef = useRef(state);
  stateRef.current = state;
  useEffect(() => {
    const flush = () => saveState(stateRef.current);
    const onVisibilityChange = () => {
      if (document.visibilityState === "hidden") flush();
    };
    window.addEventListener("beforeunload", flush);
    window.addEventListener("pagehide", flush);
    document.addEventListener("visibilitychange", onVisibilityChange);
    return () => {
      window.removeEventListener("beforeunload", flush);
      window.removeEventListener("pagehide", flush);
      document.removeEventListener("visibilitychange", onVisibilityChange);
    };
  }, []);

  const actions = useMemo(
    () => ({
      // Subjects
      addSubject: (fields) => dispatch({ type: "SUBJECT_ADD", payload: createSubject(fields) }),
      updateSubject: (id, fields) => dispatch({ type: "SUBJECT_UPDATE", payload: { id, ...fields } }),
      deleteSubject: (id) => dispatch({ type: "SUBJECT_DELETE", payload: { id } }),

      // Timetables
      addTimetable: (fields) => dispatch({ type: "TIMETABLE_ADD", payload: createTimetable(fields) }),
      updateTimetable: (id, fields) => dispatch({ type: "TIMETABLE_UPDATE", payload: { id, ...fields } }),
      deleteTimetable: (id) => dispatch({ type: "TIMETABLE_DELETE", payload: { id } }),
      setActiveTimetable: (id) => dispatch({ type: "TIMETABLE_SET_ACTIVE", payload: { id } }),

      // Lessons / breaks
      addLesson: (fields) => dispatch({ type: "LESSON_ADD", payload: createLesson(fields) }),
      updateLesson: (id, fields) => dispatch({ type: "LESSON_UPDATE", payload: { id, ...fields } }),
      deleteLesson: (id) => dispatch({ type: "LESSON_DELETE", payload: { id } }),
      addBreak: (fields) => dispatch({ type: "BREAK_ADD", payload: createBreak(fields) }),
      updateBreak: (id, fields) => dispatch({ type: "BREAK_UPDATE", payload: { id, ...fields } }),
      deleteBreak: (id) => dispatch({ type: "BREAK_DELETE", payload: { id } }),

      // Homework
      addHomework: (fields) => dispatch({ type: "HOMEWORK_ADD", payload: createHomework(fields) }),
      updateHomework: (id, fields) => dispatch({ type: "HOMEWORK_UPDATE", payload: { id, ...fields } }),
      deleteHomework: (id) => dispatch({ type: "HOMEWORK_DELETE", payload: { id } }),
      setHomeworkStatus: (id, status) => dispatch({ type: "HOMEWORK_SET_STATUS", payload: { id, status } }),

      // Reminders
      addReminder: (fields) => dispatch({ type: "REMINDER_ADD", payload: createReminder(fields) }),
      updateReminder: (id, fields) => dispatch({ type: "REMINDER_UPDATE", payload: { id, ...fields } }),
      deleteReminder: (id) => dispatch({ type: "REMINDER_DELETE", payload: { id } }),

      // Calendar events
      addEvent: (fields) => dispatch({ type: "EVENT_ADD", payload: createEvent(fields) }),
      updateEvent: (id, fields) => dispatch({ type: "EVENT_UPDATE", payload: { id, ...fields } }),
      deleteEvent: (id) => dispatch({ type: "EVENT_DELETE", payload: { id } }),

      // Tests
      addTest: (fields) => dispatch({ type: "TEST_ADD", payload: createTest(fields) }),
      updateTest: (id, fields) => dispatch({ type: "TEST_UPDATE", payload: { id, ...fields } }),
      deleteTest: (id) => dispatch({ type: "TEST_DELETE", payload: { id } }),

      // Grades
      addGrade: (fields) => dispatch({ type: "GRADE_ADD", payload: createGrade(fields) }),
      updateGrade: (id, fields) => dispatch({ type: "GRADE_UPDATE", payload: { id, ...fields } }),
      deleteGrade: (id) => dispatch({ type: "GRADE_DELETE", payload: { id } }),

      // Study sessions
      addStudySession: (fields) =>
        dispatch({ type: "STUDY_SESSION_ADD", payload: createStudySession(fields) }),
      updateStudySession: (id, fields) =>
        dispatch({ type: "STUDY_SESSION_UPDATE", payload: { id, ...fields } }),
      deleteStudySession: (id) => dispatch({ type: "STUDY_SESSION_DELETE", payload: { id } }),

      // Goals
      addGoal: (fields) => dispatch({ type: "GOAL_ADD", payload: createGoal(fields) }),
      updateGoal: (id, fields) => dispatch({ type: "GOAL_UPDATE", payload: { id, ...fields } }),
      deleteGoal: (id) => dispatch({ type: "GOAL_DELETE", payload: { id } }),

      // Flashcards
      addDeck: (fields) => dispatch({ type: "DECK_ADD", payload: createDeck(fields) }),
      updateDeck: (id, fields) => dispatch({ type: "DECK_UPDATE", payload: { id, ...fields } }),
      deleteDeck: (id) => dispatch({ type: "DECK_DELETE", payload: { id } }),
      addFlashcard: (fields) => dispatch({ type: "FLASHCARD_ADD", payload: createFlashcard(fields) }),
      updateFlashcard: (id, fields) => dispatch({ type: "FLASHCARD_UPDATE", payload: { id, ...fields } }),
      deleteFlashcard: (id) => dispatch({ type: "FLASHCARD_DELETE", payload: { id } }),
      markFlashcard: (id, result) => dispatch({ type: "FLASHCARD_MARK", payload: { id, result } }),

      // Notes
      addNote: (fields) => dispatch({ type: "NOTE_ADD", payload: createNote(fields) }),
      updateNote: (id, fields) => dispatch({ type: "NOTE_UPDATE", payload: { id, ...fields } }),
      deleteNote: (id) => dispatch({ type: "NOTE_DELETE", payload: { id } }),

      // Documents
      addDocument: (fields) => dispatch({ type: "DOCUMENT_ADD", payload: createDocument(fields) }),
      deleteDocument: (id) => dispatch({ type: "DOCUMENT_DELETE", payload: { id } }),

      // Settings
      updateSettings: (fields) => dispatch({ type: "SETTINGS_UPDATE", payload: fields }),
      updateNotifications: (fields) => dispatch({ type: "NOTIFICATIONS_UPDATE", payload: fields }),

      // Data management
      importData: (data) => dispatch({ type: "DATA_IMPORT", payload: data }),
      resetData: (data) => dispatch({ type: "DATA_RESET", payload: data }),
    }),
    [dispatch]
  );

  const value = useMemo(() => ({ state, actions, dispatch }), [state, actions]);

  return <AppDataContext.Provider value={value}>{children}</AppDataContext.Provider>;
}

export function useAppData() {
  const ctx = useContext(AppDataContext);
  if (!ctx) throw new Error("useAppData muss innerhalb von AppDataProvider verwendet werden.");
  return ctx;
}
