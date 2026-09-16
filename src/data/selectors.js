import {
  todayISO,
  mondayFirstWeekday,
  timeToMinutes,
  addDays,
  toISODate,
  isPastISO,
} from "../utils/date.js";
import { average } from "../utils/grades.js";

export function getSubjectById(state, id) {
  return state.subjects.find((s) => s.id === id) || null;
}

export function subjectName(state, id) {
  const subject = getSubjectById(state, id);
  return subject ? subject.name : "Kein Fach";
}

export function subjectColor(state, id) {
  const subject = getSubjectById(state, id);
  return subject ? subject.color : "#6b7280";
}

export function getActiveTimetable(state) {
  return state.timetables.find((t) => t.isActive) || state.timetables[0] || null;
}

export function getLessonsForTimetable(state, timetableId) {
  return state.lessons
    .filter((l) => l.timetableId === timetableId)
    .sort((a, b) => a.day - b.day || timeToMinutes(a.startTime) - timeToMinutes(b.startTime));
}

export function getBreaksForTimetable(state, timetableId) {
  return state.breaks.filter((b) => b.timetableId === timetableId);
}

export function getLessonsForDay(state, timetableId, day) {
  return getLessonsForTimetable(state, timetableId).filter((l) => l.day === day);
}

// "Next lesson": soonest lesson today with startTime >= now, else the first
// lesson of the next school day (Mon-Fri), skipping weekends.
export function getNextLesson(state, now = new Date()) {
  const timetable = getActiveTimetable(state);
  if (!timetable) return null;
  const lessons = getLessonsForTimetable(state, timetable.id);
  if (!lessons.length) return null;
  const today = mondayFirstWeekday(now);
  const currentMinutes = now.getHours() * 60 + now.getMinutes();

  if (today <= 4) {
    const todaysUpcoming = lessons
      .filter((l) => l.day === today && timeToMinutes(l.startTime) >= currentMinutes)
      .sort((a, b) => timeToMinutes(a.startTime) - timeToMinutes(b.startTime));
    if (todaysUpcoming.length) return { lesson: todaysUpcoming[0], daysAhead: 0 };
  }

  for (let ahead = 1; ahead <= 7; ahead++) {
    const futureDay = addDays(now, ahead);
    const weekday = mondayFirstWeekday(futureDay);
    if (weekday > 4) continue;
    const dayLessons = lessons
      .filter((l) => l.day === weekday)
      .sort((a, b) => timeToMinutes(a.startTime) - timeToMinutes(b.startTime));
    if (dayLessons.length) return { lesson: dayLessons[0], daysAhead: ahead };
  }
  return null;
}

export function getCurrentLesson(state, now = new Date()) {
  const timetable = getActiveTimetable(state);
  if (!timetable) return null;
  const today = mondayFirstWeekday(now);
  if (today > 4) return null;
  const mins = now.getHours() * 60 + now.getMinutes();
  return (
    getLessonsForDay(state, timetable.id, today).find(
      (l) => timeToMinutes(l.startTime) <= mins && mins < timeToMinutes(l.endTime)
    ) || null
  );
}

export function getTodayLessons(state, now = new Date()) {
  const timetable = getActiveTimetable(state);
  if (!timetable) return [];
  const today = mondayFirstWeekday(now);
  if (today > 4) return [];
  return getLessonsForDay(state, timetable.id, today);
}

// --- Homework ---
export function getHomeworkDueOn(state, iso) {
  return state.homework.filter((h) => h.dueDate === iso);
}

export function getOpenHomework(state) {
  return state.homework.filter((h) => h.status !== "erledigt");
}

export function getOverdueHomework(state, iso = todayISO()) {
  return state.homework.filter((h) => h.status !== "erledigt" && isPastISO(h.dueDate) && h.dueDate < iso);
}

export function getCompletedHomework(state) {
  return state.homework.filter((h) => h.status === "erledigt");
}

// --- Tests ---
export function getUpcomingTests(state, iso = todayISO()) {
  return state.tests
    .filter((t) => t.date >= iso)
    .sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time));
}

export function getTestsOn(state, iso) {
  return state.tests.filter((t) => t.date === iso);
}

// --- Grades ---
export function getGradesForSubject(state, subjectId) {
  return state.grades.filter((g) => g.subjectId === subjectId);
}

export function getSubjectAverage(state, subjectId) {
  const values = getGradesForSubject(state, subjectId).map((g) => g.value);
  return average(values);
}

export function getOverallAverage(state) {
  const values = state.grades.map((g) => g.value);
  return average(values);
}

export function getGradeStats(state, subjectId = null) {
  const grades = subjectId ? getGradesForSubject(state, subjectId) : state.grades;
  const values = grades.map((g) => g.value);
  if (!values.length) {
    return { count: 0, average: null, best: null, worst: null };
  }
  return {
    count: values.length,
    average: average(values),
    best: Math.min(...values),
    worst: Math.max(...values),
  };
}

export function getAllSubjectAverages(state) {
  return state.subjects.map((s) => ({
    subject: s,
    average: getSubjectAverage(state, s.id),
  }));
}

// --- Calendar / reminders ---
export function getEventsForDate(state, iso) {
  return state.events.filter((e) => e.date === iso);
}

export function getUpcomingReminders(state, iso = todayISO(), limit = 5) {
  return state.reminders
    .filter((r) => r.date >= iso)
    .sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time))
    .slice(0, limit);
}

// --- Study time ---
export function getTotalStudyMinutes(state) {
  return state.studySessions.reduce((acc, s) => acc + (s.actualMinutes || 0), 0);
}

export function getStudyMinutesBySubject(state) {
  return state.subjects.map((s) => ({
    subject: s,
    minutes: state.studySessions
      .filter((session) => session.subjectId === s.id)
      .reduce((acc, session) => acc + (session.actualMinutes || 0), 0),
  }));
}

export function getStudyMinutesToday(state, iso = todayISO()) {
  return state.studySessions
    .filter((s) => (s.startedAt || "").slice(0, 10) === iso)
    .reduce((acc, s) => acc + (s.actualMinutes || 0), 0);
}

// --- Today agenda (used by Dashboard + Heute page) ---
export function getTodayAgenda(state, now = new Date()) {
  const iso = toISODate(now);
  return {
    lessons: getTodayLessons(state, now),
    homework: getHomeworkDueOn(state, iso),
    tests: getTestsOn(state, iso),
    events: getEventsForDate(state, iso),
    reminders: state.reminders.filter((r) => r.date === iso),
  };
}

// --- Global search ---
export function searchAll(state, query) {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  const results = [];

  for (const s of state.subjects) {
    if (s.name.toLowerCase().includes(q) || s.abbreviation.toLowerCase().includes(q)) {
      results.push({ type: "Fach", id: s.id, title: s.name, route: "faecher", subtitle: s.teacher });
    }
  }
  for (const h of state.homework) {
    if (h.task.toLowerCase().includes(q) || subjectName(state, h.subjectId).toLowerCase().includes(q)) {
      results.push({
        type: "Hausaufgabe",
        id: h.id,
        title: h.task,
        route: "hausaufgaben",
        subtitle: subjectName(state, h.subjectId),
      });
    }
  }
  for (const t of state.tests) {
    if (t.topic.toLowerCase().includes(q) || subjectName(state, t.subjectId).toLowerCase().includes(q)) {
      results.push({
        type: "Test",
        id: t.id,
        title: t.topic,
        route: "tests",
        subtitle: subjectName(state, t.subjectId),
      });
    }
  }
  for (const e of state.events) {
    if (e.title.toLowerCase().includes(q)) {
      results.push({ type: "Termin", id: e.id, title: e.title, route: "kalender", subtitle: e.date });
    }
  }
  for (const n of state.notes) {
    if (n.title.toLowerCase().includes(q) || n.text.toLowerCase().includes(q)) {
      results.push({
        type: "Notiz",
        id: n.id,
        title: n.title,
        route: "notizen",
        subtitle: subjectName(state, n.subjectId),
      });
    }
  }
  for (const g of state.goals) {
    if (g.title.toLowerCase().includes(q)) {
      results.push({ type: "Ziel", id: g.id, title: g.title, route: "ziele", subtitle: `${g.progress}%` });
    }
  }
  for (const l of state.lessons) {
    if (subjectName(state, l.subjectId).toLowerCase().includes(q)) {
      results.push({
        type: "Stunde",
        id: l.id,
        title: subjectName(state, l.subjectId),
        route: "stundenplan",
        subtitle: `${l.startTime}–${l.endTime}`,
      });
    }
  }
  for (const g of state.grades) {
    if (subjectName(state, g.subjectId).toLowerCase().includes(q)) {
      results.push({
        type: "Note",
        id: g.id,
        title: `${subjectName(state, g.subjectId)}: ${g.value}`,
        route: "noten",
        subtitle: g.type,
      });
    }
  }
  return results;
}
