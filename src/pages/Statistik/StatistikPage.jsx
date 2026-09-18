import { PageHeader, Card } from "../../components/common/Card.jsx";
import { EmptyState } from "../../components/common/EmptyState.jsx";
import { useAppData } from "../../context/AppDataContext.jsx";
import {
  getAllSubjectAverages,
  getStudyMinutesBySubject,
  getOpenHomework,
  getCompletedHomework,
} from "../../data/selectors.js";
import { BarChart } from "../../components/charts/BarChart.jsx";
import { DonutChart } from "../../components/charts/DonutChart.jsx";
import { LineChart } from "../../components/charts/LineChart.jsx";
import { formatGrade } from "../../utils/grades.js";
import { formatGermanDate } from "../../utils/date.js";

export function StatistikPage() {
  const { state } = useAppData();

  const subjectAverages = getAllSubjectAverages(state).filter((s) => s.average !== null);
  const studyMinutes = getStudyMinutesBySubject(state).filter((s) => s.minutes > 0);
  const openHomework = getOpenHomework(state);
  const completedHomework = getCompletedHomework(state);
  const testsBySubject = state.subjects
    .map((s) => ({ subject: s, count: state.tests.filter((t) => t.subjectId === s.id).length }))
    .filter((s) => s.count > 0);

  const gradesByDate = [...state.grades].sort((a, b) => a.date.localeCompare(b.date));
  const gradeTrendSeries = [
    {
      label: "Notenverlauf",
      color: "var(--accent)",
      points: gradesByDate.map((g) => ({ x: g.date, y: g.value })),
    },
  ];

  const hasAnyData = state.grades.length > 0 || state.studySessions.length > 0 || state.homework.length > 0;

  if (!hasAnyData) {
    return (
      <div>
        <PageHeader title="Statistik" />
        <EmptyState title="Noch keine Daten" message="Sammle Noten, Lernzeit und Hausaufgaben, um Statistiken zu sehen." />
      </div>
    );
  }

  return (
    <div>
      <PageHeader title="Statistik" subtitle="Dein Schuljahr im Überblick" />

      <div className="stats-grid">
        <Card>
          <h3 className="section-title">Notendurchschnitt pro Fach</h3>
          {subjectAverages.length === 0 ? (
            <p className="muted">Noch keine Noten.</p>
          ) : (
            <BarChart
              data={subjectAverages
                .sort((a, b) => a.average - b.average)
                .map((s) => ({ label: s.subject.abbreviation || s.subject.name, value: s.average, color: s.subject.color }))}
              yMin={1}
              yMax={6}
              invertY
              valueFormatter={formatGrade}
            />
          )}
        </Card>

        <Card>
          <h3 className="section-title">Notenverlauf</h3>
          {gradesByDate.length < 2 ? (
            <p className="muted">Mindestens zwei Noten nötig für den Verlauf.</p>
          ) : (
            <LineChart series={gradeTrendSeries} yMin={1} yMax={6} invertY xFormatter={(iso) => formatGermanDate(iso, { short: true })} />
          )}
        </Card>

        <Card>
          <h3 className="section-title">Lernzeit pro Fach (Minuten)</h3>
          {studyMinutes.length === 0 ? (
            <p className="muted">Noch keine Lernzeit erfasst.</p>
          ) : (
            <BarChart
              data={studyMinutes.map((s) => ({ label: s.subject.abbreviation || s.subject.name, value: s.minutes, color: s.subject.color }))}
              yMin={0}
              yMax={Math.max(...studyMinutes.map((s) => s.minutes), 60)}
              valueFormatter={(v) => `${Math.round(v)}`}
            />
          )}
        </Card>

        <Card>
          <h3 className="section-title">Hausaufgaben erledigt / offen</h3>
          <div className="donut-wrap">
            <DonutChart
              segments={[
                { label: "Erledigt", value: completedHomework.length, color: "var(--success)" },
                { label: "Offen", value: openHomework.length, color: "var(--warning)" },
              ]}
              centerLabel={completedHomework.length + openHomework.length}
              centerSubLabel="Aufgaben"
            />
            <div className="donut-legend">
              <span><i style={{ background: "var(--success)" }} /> Erledigt ({completedHomework.length})</span>
              <span><i style={{ background: "var(--warning)" }} /> Offen ({openHomework.length})</span>
            </div>
          </div>
        </Card>

        <Card>
          <h3 className="section-title">Anzahl der Tests pro Fach</h3>
          {testsBySubject.length === 0 ? (
            <p className="muted">Noch keine Tests erfasst.</p>
          ) : (
            <BarChart
              data={testsBySubject.map((s) => ({ label: s.subject.abbreviation || s.subject.name, value: s.count, color: s.subject.color }))}
              yMin={0}
              yMax={Math.max(...testsBySubject.map((s) => s.count), 5)}
              valueFormatter={(v) => `${Math.round(v)}`}
            />
          )}
        </Card>
      </div>
    </div>
  );
}
