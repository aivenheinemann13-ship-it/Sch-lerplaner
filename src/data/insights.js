import { todayISO, addDays, toISODate, formatGermanDate } from "../utils/date.js";
import {
  getTestsOn,
  getHomeworkDueOn,
  getOverdueHomework,
  subjectName,
} from "./selectors.js";

// Rule-based "intelligent overview". Recomputed on every render from current
// state — cheap given the small data volume of a single student's planner.
// Each insight: { id, icon, severity: 'info'|'warning'|'success', text, route }
export function getInsights(state, now = new Date()) {
  const insights = [];
  const iso = todayISO();
  const tomorrowIso = toISODate(addDays(now, 1));
  const notif = state.settings.notifications;

  if (notif.tests) {
    for (const test of getTestsOn(state, tomorrowIso)) {
      insights.push({
        id: `test-tomorrow-${test.id}`,
        icon: "AlertTriangle",
        severity: "warning",
        text: `⚠️ Du hast morgen einen ${subjectName(state, test.subjectId)}-Test!`,
        route: "tests",
      });
    }
    for (const test of getTestsOn(state, iso)) {
      insights.push({
        id: `test-today-${test.id}`,
        icon: "AlertTriangle",
        severity: "warning",
        text: `🧪 Heute: ${subjectName(state, test.subjectId)}-Test (${test.topic || "ohne Thema"})`,
        route: "tests",
      });
    }
  }

  if (notif.homework) {
    const dueToday = getHomeworkDueOn(state, iso).filter((h) => h.status !== "erledigt");
    if (dueToday.length > 0) {
      insights.push({
        id: "hw-due-today",
        icon: "BookOpen",
        severity: "info",
        text: `📚 Du hast heute ${dueToday.length} Aufgabe${dueToday.length === 1 ? "" : "n"} zu erledigen.`,
        route: "hausaufgaben",
      });
    }
    const overdue = getOverdueHomework(state, iso);
    if (overdue.length > 0) {
      insights.push({
        id: "hw-overdue",
        icon: "Clock",
        severity: "warning",
        text: `🔴 ${overdue.length} Aufgabe${overdue.length === 1 ? " ist" : "n sind"} überfällig.`,
        route: "hausaufgaben",
      });
    }
  }

  if (notif.reminders) {
    const remindersToday = state.reminders.filter((r) => r.date === iso);
    if (remindersToday.length > 0) {
      insights.push({
        id: "reminders-today",
        icon: "Bell",
        severity: "info",
        text: `🔔 ${remindersToday.length} Erinnerung${remindersToday.length === 1 ? "" : "en"} für heute.`,
        route: "kalender",
      });
    }
  }

  if (notif.appointments) {
    const eventsToday = state.events.filter((e) => e.date === iso);
    if (eventsToday.length > 0) {
      insights.push({
        id: "events-today",
        icon: "Calendar",
        severity: "info",
        text: `🏫 ${eventsToday.length} Termin${eventsToday.length === 1 ? "" : "e"} heute.`,
        route: "kalender",
      });
    }
  }

  for (const goal of state.goals.filter((g) => g.progress >= 100 && !g.achievedAt)) {
    insights.push({
      id: `goal-${goal.id}`,
      icon: "Trophy",
      severity: "success",
      text: `🎉 Ziel erreicht: ${goal.title}`,
      route: "ziele",
    });
  }

  if (insights.length === 0) {
    insights.push({
      id: "all-clear",
      icon: "Sun",
      severity: "info",
      text: "☀️ Heute keine dringenden Aufgaben oder Tests – guter Tag!",
      route: null,
    });
  }

  return insights;
}

export function formatInsightDate(iso) {
  return formatGermanDate(iso, { weekday: true });
}
