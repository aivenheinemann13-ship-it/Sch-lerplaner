import { useEffect, useState } from "react";
import { Plus, NotebookPen } from "lucide-react";
import { PageHeader } from "../../components/common/Card.jsx";
import { Button } from "../../components/common/Button.jsx";
import { EmptyState } from "../../components/common/EmptyState.jsx";
import { ConfirmDialog } from "../../components/common/ConfirmDialog.jsx";
import { useAppData } from "../../context/AppDataContext.jsx";
import { useToast } from "../../context/ToastContext.jsx";
import { useRouter } from "../../router/Router.jsx";
import { HomeworkForm } from "./HomeworkForm.jsx";
import { HomeworkItem } from "./HomeworkItem.jsx";

export function HausaufgabenPage() {
  const { state, actions } = useAppData();
  const { addToast } = useToast();
  const { params, navigate, route } = useRouter();
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [toDelete, setToDelete] = useState(null);

  useEffect(() => {
    if (params.openNew) {
      setEditing(null);
      setFormOpen(true);
      navigate(route, {});
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.openNew]);

  const openNew = () => {
    setEditing(null);
    setFormOpen(true);
  };

  const handleSave = (values) => {
    if (values.id) {
      actions.updateHomework(values.id, values);
      addToast("Hausaufgabe aktualisiert ✅", { type: "success" });
    } else {
      actions.addHomework(values);
      addToast("Neue Aufgabe hinzugefügt 📝", { type: "success" });
    }
    setFormOpen(false);
  };

  const handleToggleDone = (homework) => {
    const next = homework.status === "erledigt" ? "offen" : "erledigt";
    actions.setHomeworkStatus(homework.id, next);
    if (next === "erledigt") addToast("Hausaufgabe erledigt ✅", { type: "success" });
  };

  const handleDeleteConfirmed = () => {
    actions.deleteHomework(toDelete.id);
    addToast("Hausaufgabe gelöscht", { type: "info" });
    setToDelete(null);
  };

  const open = state.homework.filter((h) => h.status !== "erledigt");
  const done = state.homework.filter((h) => h.status === "erledigt");
  const sortByDue = (list) => [...list].sort((a, b) => a.dueDate.localeCompare(b.dueDate));

  return (
    <div>
      <PageHeader
        title="Hausaufgaben"
        subtitle={`${open.length} offen · ${done.length} erledigt`}
        actions={
          <Button variant="primary" icon={Plus} onClick={openNew}>
            Neue Hausaufgabe
          </Button>
        }
      />

      {state.homework.length === 0 ? (
        <EmptyState
          icon={<NotebookPen size={32} />}
          title="Keine Hausaufgaben"
          message="Füge deine erste Hausaufgabe hinzu."
          action={
            <Button variant="primary" icon={Plus} onClick={openNew}>
              Neue Hausaufgabe
            </Button>
          }
        />
      ) : (
        <>
          <section className="hw-section">
            <h3 className="section-title">Offen</h3>
            {open.length === 0 ? (
              <p className="muted">Keine offenen Aufgaben – gut gemacht! 🎉</p>
            ) : (
              <div className="homework-list">
                {sortByDue(open).map((h) => (
                  <HomeworkItem
                    key={h.id}
                    homework={h}
                    onEdit={(hw) => {
                      setEditing(hw);
                      setFormOpen(true);
                    }}
                    onDelete={setToDelete}
                    onToggleDone={handleToggleDone}
                  />
                ))}
              </div>
            )}
          </section>

          {done.length > 0 && (
            <section className="hw-section">
              <h3 className="section-title">Erledigt</h3>
              <div className="homework-list">
                {sortByDue(done).map((h) => (
                  <HomeworkItem
                    key={h.id}
                    homework={h}
                    onEdit={(hw) => {
                      setEditing(hw);
                      setFormOpen(true);
                    }}
                    onDelete={setToDelete}
                    onToggleDone={handleToggleDone}
                  />
                ))}
              </div>
            </section>
          )}
        </>
      )}

      {formOpen && (
        <HomeworkForm
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
        title="Hausaufgabe löschen"
        message={`Möchtest du „${toDelete?.task}“ wirklich löschen?`}
        onConfirm={handleDeleteConfirmed}
        onCancel={() => setToDelete(null)}
      />
    </div>
  );
}
