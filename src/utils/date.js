// Date/time helpers for the Schülerplaner app. All "date" values in the data
// model are ISO strings ("YYYY-MM-DD"), all "time" values are "HH:mm".
// Weekday indices used across the timetable are 0=Montag ... 4=Freitag.

export const WEEKDAYS_DE = ["Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag"];
export const WEEKDAYS_SHORT_DE = ["Mo", "Di", "Mi", "Do", "Fr", "Sa", "So"];
export const MONTHS_DE = [
  "Januar", "Februar", "März", "April", "Mai", "Juni",
  "Juli", "August", "September", "Oktober", "November", "Dezember",
];

export function pad2(n) {
  return String(n).padStart(2, "0");
}

export function toISODate(date) {
  return `${date.getFullYear()}-${pad2(date.getMonth() + 1)}-${pad2(date.getDate())}`;
}

export function todayISO() {
  return toISODate(new Date());
}

export function nowTimeStr() {
  const d = new Date();
  return `${pad2(d.getHours())}:${pad2(d.getMinutes())}`;
}

export function parseISODate(iso) {
  if (!iso) return null;
  const [y, m, d] = iso.split("-").map(Number);
  if (!y || !m || !d) return null;
  return new Date(y, m - 1, d);
}

export function startOfDay(date) {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

export function addDays(date, amount) {
  const d = new Date(date);
  d.setDate(d.getDate() + amount);
  return d;
}

export function addDaysISO(iso, amount) {
  const d = parseISODate(iso);
  if (!d) return iso;
  return toISODate(addDays(d, amount));
}

export function isSameDay(isoA, isoB) {
  return isoA === isoB;
}

export function isTodayISO(iso) {
  return iso === todayISO();
}

export function isTomorrowISO(iso) {
  return iso === toISODate(addDays(new Date(), 1));
}

export function isPastISO(iso) {
  if (!iso) return false;
  return iso < todayISO();
}

// Monday=0 ... Sunday=6, matching the Mon-Fri timetable convention.
export function mondayFirstWeekday(date) {
  const jsDay = date.getDay(); // 0=Sun..6=Sat
  return (jsDay + 6) % 7;
}

export function startOfWeek(date) {
  const d = startOfDay(date);
  return addDays(d, -mondayFirstWeekday(d));
}

export function daysUntilISO(iso) {
  const target = parseISODate(iso);
  if (!target) return null;
  const diffMs = startOfDay(target) - startOfDay(new Date());
  return Math.round(diffMs / 86400000);
}

export function formatGermanDate(iso, opts = {}) {
  const d = parseISODate(iso);
  if (!d) return "";
  const { weekday = false, short = false } = opts;
  const day = pad2(d.getDate());
  const month = short ? pad2(d.getMonth() + 1) : MONTHS_DE[d.getMonth()];
  const base = short ? `${day}.${month}.${d.getFullYear()}` : `${day}. ${month} ${d.getFullYear()}`;
  if (weekday) {
    const wIdx = mondayFirstWeekday(d);
    return `${WEEKDAYS_SHORT_DE[wIdx]}, ${base}`;
  }
  return base;
}

export function formatCountdown(iso) {
  const days = daysUntilISO(iso);
  if (days === null) return "";
  if (days < 0) return "vorbei";
  if (days === 0) return "Heute!";
  if (days === 1) return "Morgen!";
  return `Noch ${days} Tage`;
}

export function timeToMinutes(time) {
  if (!time) return 0;
  const [h, m] = time.split(":").map(Number);
  return h * 60 + m;
}

export function minutesToTime(mins) {
  const h = Math.floor(mins / 60) % 24;
  const m = mins % 60;
  return `${pad2(h)}:${pad2(m)}`;
}

export function nowMinutes() {
  const d = new Date();
  return d.getHours() * 60 + d.getMinutes();
}

export function greetingForNow(date = new Date()) {
  const h = date.getHours();
  if (h < 11) return "Guten Morgen";
  if (h < 17) return "Guten Tag";
  if (h < 22) return "Guten Abend";
  return "Gute Nacht";
}

// Builds a 6x7 month grid (array of ISO date strings, Monday-first),
// including leading/trailing days from adjacent months for a full grid.
export function getMonthMatrix(year, month) {
  const first = new Date(year, month, 1);
  const gridStart = startOfWeek(first);
  const days = [];
  for (let i = 0; i < 42; i++) {
    const d = addDays(gridStart, i);
    days.push({ iso: toISODate(d), inMonth: d.getMonth() === month, date: d });
  }
  return days;
}

export function formatDuration(minutes) {
  const h = Math.floor(minutes / 60);
  const m = Math.round(minutes % 60);
  if (h <= 0) return `${m} Min`;
  if (m === 0) return `${h} Std`;
  return `${h} Std ${m} Min`;
}
