import { useState } from "react";
import { Plus, FlaskConical } from "lucide-react";
import { PageHeader } from "../../components/common/Card.jsx";
import { Button } from "../../components/common/Button.jsx";
import { EmptyState } from "../../components/common/EmptyState.jsx";
import { ConfirmDialog } from "../../components/common/ConfirmDialog.jsx";
import { useAppData } from "../../context/AppDataContext.jsx";
import { useToast } from "../../context/ToastContext.jsx";
import { getUpcomingTests } from "../../data/selectors.js";
import { todayISO } from "../../utils/date.js";
import { TestForm } from "./TestForm.jsx";
import { TestItem } from "./TestItem.jsx";
import { GradeForm } from "../Noten/GradeForm.jsx";

export function TestsPage() {
  const { state, actions } = useAppData();
  const { addToast } = useToast();
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [toDelete, setToDelete] = useState(null);
  const [gradeTarget, setGradeTarget] = useState(null);

  const openNew = () => {
    setEditing(null);
    setFormOpen(true);
  };

  const handleSave = (values) => {
    if (values.id) {
      actions.updateTest(values.id, values);
      addToast("Test aktualisiert ✅", { type: "success" });
    } else {
      actions.addTest(values);
      addToast("Neuer Test hinzugefügt 🧪", { type: "success" });
    }
    setFormOpen(false);
  };

  const handleDeleteConfirmed = () => {
    actions.deleteTest(toDelete.id);
    addToast("Test gelöscht", { type: "info" });
    setToDelete(null);
  };

  const handleSaveGrade = (values) => {
    actions.addGrade({ ...values, testId: gradeTarget.id });
    addToast("Note eingetragen 📊", { type: "success" });
    setGradeTarget(null);
  };

  const upcoming = getUpcomingTests(state);
  const past = state.tests
    .filter((t) => t.date < todayISO())
    .sort((a, b) => b.date.localeCompare(a.date));

  return (
    <div>
      <PageHeader
        title="Klassenarbeiten & Tests"
        subtitle={`${upcoming.length} bevorstehend`}
        actions={
          <Button variant="primary" icon={Plus} onClick={openNew}>
            Neuer Test
          </Button>
        }
      />

      {state.tests.length === 0 ? (
        <EmptyState
          icon={<FlaskConical size={32} />}
          title="Keine Tests geplant"
          message="Trage deine nächste Klassenarbeit ein."
          action={
            <Button variant="primary" icon={Plus} onClick={openNew}>
              Neuer Test
            </Button>
          }
        />
      ) : (
        <>
          <section className="hw-section">
            <h3 className="section-title">Bevorstehend</h3>
            {upcoming.length === 0 ? (
              <p className="muted">Keine bevorstehenden Tests.</p>
            ) : (
              <div className="test-list">
                {upcoming.map((t) => (
                  <TestItem
                    key={t.id}
                    test={t}
                    onEdit={(test) => {
                      setEditing(test);
                      setFormOpen(true);
                    }}
                    onDelete={setToDelete}
                    onEnterGrade={setGradeTarget}
                  />
                ))}
              </div>
            )}
          </section>

          {past.length > 0 && (
            <section className="hw-section">
              <h3 className="section-title">Vergangen</h3>
              <div className="test-list">
                {past.map((t) => (
                  <TestItem
                    key={t.id}
                    test={t}
                    onEdit={(test) => {
                      setEditing(test);
                      setFormOpen(true);
                    }}
                    onDelete={setToDelete}
                    onEnterGrade={setGradeTarget}
                  />
                ))}
              </div>
            </section>
          )}
        </>
      )}

      {formOpen && (
        <TestForm
          key={editing?.id || "new"}
          open={formOpen}
          onClose={() => setFormOpen(false)}
          onSave={handleSave}
          initialValues={editing}
          subjects={state.subjects}
        />
      )}

      {gradeTarget && (
        <GradeForm
          open={!!gradeTarget}
          onClose={() => setGradeTarget(null)}
          onSave={handleSaveGrade}
          subjects={state.subjects}
          fixed={{ subjectId: gradeTarget.subjectId, testId: gradeTarget.id }}
        />
      )}

      <ConfirmDialog
        open={!!toDelete}
        title="Test löschen"
        message={`Möchtest du den Test „${toDelete?.topic}“ wirklich löschen?`}
        onConfirm={handleDeleteConfirmed}
        onCancel={() => setToDelete(null)}
      />
    </div>
  );
}
