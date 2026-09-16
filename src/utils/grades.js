// German 1-6 grading scale helpers. 1 = Sehr gut ... 6 = Ungenügend.

export const GRADE_LABELS = {
  1: "Sehr gut",
  2: "Gut",
  3: "Befriedigend",
  4: "Ausreichend",
  5: "Mangelhaft",
  6: "Ungenügend",
};

export function isValidGrade(value) {
  const n = Number(value);
  return Number.isFinite(n) && n >= 1 && n <= 6;
}

export function gradeLabel(value) {
  const rounded = Math.round(value);
  return GRADE_LABELS[rounded] || "";
}

export function average(values) {
  if (!values.length) return null;
  const sum = values.reduce((acc, v) => acc + v, 0);
  return sum / values.length;
}

export function weightedAverage(grades) {
  if (!grades.length) return null;
  const totalWeight = grades.reduce((acc, g) => acc + (g.weight || 1), 0);
  if (totalWeight === 0) return null;
  const sum = grades.reduce((acc, g) => acc + g.value * (g.weight || 1), 0);
  return sum / totalWeight;
}

export function formatGrade(value) {
  if (value === null || value === undefined) return "–";
  return value.toFixed(1).replace(".", ",");
}

export function gradeColor(value) {
  if (value <= 1.5) return "var(--success)";
  if (value <= 2.5) return "var(--accent)";
  if (value <= 3.5) return "var(--warning)";
  return "var(--danger)";
}
