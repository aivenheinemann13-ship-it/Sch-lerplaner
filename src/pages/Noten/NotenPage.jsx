import { useState } from "react";
import { Plus, BarChart3 } from "lucide-react";
import { PageHeader, Card } from "../../components/common/Card.jsx";
import { Button } from "../../components/common/Button.jsx";
import { EmptyState } from "../../components/common/EmptyState.jsx";
import { ConfirmDialog } from "../../components/common/ConfirmDialog.jsx";
import { useAppData } from "../../context/AppDataContext.jsx";
import { useToast } from "../../context/ToastContext.jsx";
import { getOverallAverage, getAllSubjectAverages, getGradeStats } from "../../data/selectors.js";
import { formatGrade } from "../../utils/grades.js";
import { GradeForm } from "./GradeForm.jsx";
import { GradeTable } from "./GradeTable.jsx";

export function NotenPage() {
  const { state, actions } = useAppData();
  const { addToast } = useToast();
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [toDelete, setToDelete] = useState(null);

  const overallStats = getGradeStats(state);
  const subjectAverages = getAllSubjectAverages(state).filter((s) => s.average !== null);

  const handleSave = (values) => {
    if (values.id) {
      actions.updateGrade(values.id, values);
      addToast("Note aktualisiert ✅", { type: "success" });
    } else {
      actions.addGrade(values);
      addToast("Note gespeichert 📊", { type: "success" });
    }
    setFormOpen(false);
  };

  const handleDeleteConfirmed = () => {
    actions.deleteGrade(toDelete.id);
    addToast("Note gelöscht", { type: "info" });
    setToDelete(null);
  };

  return (
    <div>
      <PageHeader
        title="Noten"
        subtitle="Notenübersicht und Durchschnitte"
        actions={
          <Button
            variant="primary"
            icon={Plus}
            onClick={() => {
              setEditing(null);
              setFormOpen(true);
            }}
          >
            Note eintragen
          </Button>
        }
      />

      {state.grades.length === 0 ? (
        <EmptyState
          icon={<BarChart3 size={32} />}
          title="Noch keine Noten"
          message="Trage deine erste Note ein."
        />
      ) : (
        <>
          <div className="fach-detail-grid">
            <Card className="stat-card">
              <span className="stat-card__label">Gesamtdurchschnitt</span>
              <span className="stat-card__value">
                {overallStats.average ? formatGrade(overallStats.average) : "–"}
              </span>
            </Card>
            <Card className="stat-card">
              <span className="stat-card__label">Anzahl Noten</span>
              <span className="stat-card__value">{overallStats.count}</span>
            </Card>
            <Card className="stat-card">
              <span className="stat-card__label">Beste Note</span>
              <span className="stat-card__value">
                {overallStats.best ? formatGrade(overallStats.best) : "–"}
              </span>
            </Card>
            <Card className="stat-card">
              <span className="stat-card__label">Schlechteste Note</span>
              <span className="stat-card__value">
                {overallStats.worst ? formatGrade(overallStats.worst) : "–"}
              </span>
            </Card>
          </div>

          <Card className="fach-detail-columns__single">
            <h3 className="section-title">Durchschnitt pro Fach</h3>
            <div className="subject-average-list">
              {subjectAverages.map(({ subject, average }) => (
                <div key={subject.id} className="subject-average-row">
                  <span className="subject-tag" style={{ background: subject.color }}>
                    {subject.name}
                  </span>
                  <strong>{formatGrade(average)}</strong>
                </div>
              ))}
            </div>
          </Card>

          <Card>
            <h3 className="section-title">Alle Noten</h3>
            <GradeTable
              grades={state.grades}
              onEdit={(g) => {
                setEditing(g);
                setFormOpen(true);
              }}
              onDelete={setToDelete}
            />
          </Card>
        </>
      )}

      {formOpen && (
        <GradeForm
          key={editing?.id || "new"}
          open={formOpen}
          onClose={() => setFormOpen(false)}
          onSave={handleSave}
          initialValues={editing}
          subjects={state.subjects}
        />
      )}

      <ConfirmDialog
        open={!!toDelete}
        title="Note löschen"
        message="Möchtest du diese Note wirklich löschen?"
        onConfirm={handleDeleteConfirmed}
        onCancel={() => setToDelete(null)}
      />
    </div>
  );
}
