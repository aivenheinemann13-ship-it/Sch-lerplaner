import { useState } from "react";
import { Plus, BookOpen } from "lucide-react";
import { PageHeader } from "../../components/common/Card.jsx";
import { Button } from "../../components/common/Button.jsx";
import { EmptyState } from "../../components/common/EmptyState.jsx";
import { ConfirmDialog } from "../../components/common/ConfirmDialog.jsx";
import { SubjectForm } from "./SubjectForm.jsx";
import { SubjectCard } from "./SubjectCard.jsx";
import { useAppData } from "../../context/AppDataContext.jsx";
import { useToast } from "../../context/ToastContext.jsx";
import { useRouter } from "../../router/Router.jsx";
import { ROUTES } from "../../router/routes.js";

export function FaecherPage() {
  const { state, actions } = useAppData();
  const { addToast } = useToast();
  const { navigate } = useRouter();
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [toDelete, setToDelete] = useState(null);

  const openNew = () => {
    setEditing(null);
    setFormOpen(true);
  };
  const openEdit = (subject) => {
    setEditing(subject);
    setFormOpen(true);
  };

  const handleSave = (values) => {
    if (values.id) {
      actions.updateSubject(values.id, values);
      addToast("Fach aktualisiert ✅", { type: "success" });
    } else {
      actions.addSubject(values);
      addToast("Fach hinzugefügt ✅", { type: "success" });
    }
    setFormOpen(false);
  };

  const handleDeleteConfirmed = () => {
    actions.deleteSubject(toDelete.id);
    addToast("Fach gelöscht", { type: "info" });
    setToDelete(null);
  };

  return (
    <div>
      <PageHeader
        title="Fächer"
        subtitle={`${state.subjects.length} Fach${state.subjects.length === 1 ? "" : "fächer"}`}
        actions={
          <Button variant="primary" icon={Plus} onClick={openNew}>
            Fach hinzufügen
          </Button>
        }
      />

      {state.subjects.length === 0 ? (
        <EmptyState
          icon={<BookOpen size={32} />}
          title="Noch keine Fächer"
          message="Füge dein erstes Fach hinzu, um loszulegen."
          action={
            <Button variant="primary" icon={Plus} onClick={openNew}>
              Fach hinzufügen
            </Button>
          }
        />
      ) : (
        <div className="subject-grid">
          {state.subjects.map((subject) => (
            <SubjectCard
              key={subject.id}
              subject={subject}
              onOpen={(s) => navigate(ROUTES.FACH_DETAIL, { subjectId: s.id })}
              onEdit={openEdit}
              onDelete={setToDelete}
            />
          ))}
        </div>
      )}

      {formOpen && (
        <SubjectForm
          key={editing?.id || "new"}
          open={formOpen}
          onClose={() => setFormOpen(false)}
          onSave={handleSave}
          initialValues={editing}
          existingSubjects={state.subjects}
        />
      )}

      <ConfirmDialog
        open={!!toDelete}
        title="Fach löschen"
        message={`Möchtest du „${toDelete?.name}“ wirklich löschen? Verknüpfte Hausaufgaben, Noten und Notizen bleiben erhalten, zeigen aber „Kein Fach“ an.`}
        onConfirm={handleDeleteConfirmed}
        onCancel={() => setToDelete(null)}
      />
    </div>
  );
}
