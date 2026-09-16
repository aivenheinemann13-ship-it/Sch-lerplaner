import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { PageHeader } from "../../components/common/Card.jsx";
import { Button } from "../../components/common/Button.jsx";
import { Select } from "../../components/common/FormField.jsx";
import { ConfirmDialog } from "../../components/common/ConfirmDialog.jsx";
import { EmptyState } from "../../components/common/EmptyState.jsx";
import { useAppData } from "../../context/AppDataContext.jsx";
import { useToast } from "../../context/ToastContext.jsx";
import { getActiveTimetable, getLessonsForTimetable, getBreaksForTimetable } from "../../data/selectors.js";
import { TimetableGrid } from "./TimetableGrid.jsx";
import { LessonForm } from "./LessonForm.jsx";

export function StundenplanPage() {
  const { state, actions } = useAppData();
  const { addToast } = useToast();
  const [formOpen, setFormOpen] = useState(false);
  const [editingLesson, setEditingLesson] = useState(null);
  const [editingBreak, setEditingBreak] = useState(null);
  const [entryType, setEntryType] = useState("lesson");
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [newTimetableMode, setNewTimetableMode] = useState(false);
  const [newTimetableName, setNewTimetableName] = useState("");

  const activeTimetable = getActiveTimetable(state);

  if (state.subjects.length === 0) {
    return (
      <EmptyState
        title="Zuerst Fächer anlegen"
        message="Lege mindestens ein Fach an, bevor du den Stundenplan füllst."
      />
    );
  }

  if (!activeTimetable) {
    return (
      <EmptyState
        title="Kein Stundenplan vorhanden"
        message="Erstelle deinen ersten Stundenplan."
        action={
          <Button
            variant="primary"
            icon={Plus}
            onClick={() => {
              actions.addTimetable({ name: "Mein Stundenplan", isActive: true });
            }}
          >
            Stundenplan erstellen
          </Button>
        }
      />
    );
  }

  const lessons = getLessonsForTimetable(state, activeTimetable.id);
  const breaks = getBreaksForTimetable(state, activeTimetable.id);

  const openNewLesson = () => {
    setEditingLesson(null);
    setEditingBreak(null);
    setEntryType("lesson");
    setFormOpen(true);
  };

  const handleSaveEntry = (type, values) => {
    if (type === "lesson") {
      if (editingLesson) {
        actions.updateLesson(editingLesson.id, values);
        addToast("Stunde aktualisiert ✅", { type: "success" });
      } else {
        actions.addLesson({ ...values, timetableId: activeTimetable.id });
        addToast("Stunde hinzugefügt ✅", { type: "success" });
      }
    } else {
      if (editingBreak) {
        actions.updateBreak(editingBreak.id, values);
        addToast("Pause aktualisiert ✅", { type: "success" });
      } else {
        actions.addBreak({ ...values, timetableId: activeTimetable.id });
        addToast("Pause hinzugefügt ✅", { type: "success" });
      }
    }
    setFormOpen(false);
  };

  const handleDeleteConfirmed = () => {
    if (deleteTarget.kind === "lesson") actions.deleteLesson(deleteTarget.id);
    else actions.deleteBreak(deleteTarget.id);
    addToast("Eintrag gelöscht", { type: "info" });
    setDeleteTarget(null);
  };

  const handleCreateTimetable = () => {
    if (!newTimetableName.trim()) return;
    actions.addTimetable({ name: newTimetableName.trim(), isActive: true });
    setNewTimetableName("");
    setNewTimetableMode(false);
    addToast("Neuer Stundenplan erstellt ✅", { type: "success" });
  };

  return (
    <div>
      <PageHeader
        title="Stundenplan"
        subtitle="Montag bis Freitag"
        actions={
          <>
            <Select
              value={activeTimetable.id}
              onChange={(e) => actions.setActiveTimetable(e.target.value)}
            >
              {state.timetables.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name}
                </option>
              ))}
            </Select>
            <Button variant="ghost" icon={Plus} onClick={() => setNewTimetableMode(true)}>
              Neuer Plan
            </Button>
            {state.timetables.length > 1 && (
              <Button
                variant="ghost"
                icon={Trash2}
                onClick={() => actions.deleteTimetable(activeTimetable.id)}
              >
                Plan löschen
              </Button>
            )}
            <Button variant="primary" icon={Plus} onClick={openNewLesson}>
              Eintrag hinzufügen
            </Button>
          </>
        }
      />

      {newTimetableMode && (
        <div className="inline-form">
          <input
            className="input"
            autoFocus
            placeholder="Name des Stundenplans"
            value={newTimetableName}
            onChange={(e) => setNewTimetableName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleCreateTimetable()}
          />
          <Button variant="primary" onClick={handleCreateTimetable}>
            Erstellen
          </Button>
          <Button variant="ghost" onClick={() => setNewTimetableMode(false)}>
            Abbrechen
          </Button>
        </div>
      )}

      <TimetableGrid
        lessons={lessons}
        breaks={breaks}
        onEditLesson={(l) => {
          setEditingLesson(l);
          setEditingBreak(null);
          setEntryType("lesson");
          setFormOpen(true);
        }}
        onDeleteLesson={(l) => setDeleteTarget({ ...l, kind: "lesson" })}
        onEditBreak={(b) => {
          setEditingBreak(b);
          setEditingLesson(null);
          setEntryType("break");
          setFormOpen(true);
        }}
        onDeleteBreak={(b) => setDeleteTarget({ ...b, kind: "break" })}
      />

      {formOpen && (
        <LessonForm
          key={editingLesson?.id || editingBreak?.id || "new"}
          open={formOpen}
          onClose={() => setFormOpen(false)}
          onSave={handleSaveEntry}
          initialValues={editingLesson || editingBreak}
          subjects={state.subjects}
          entryType={entryType}
        />
      )}

      <ConfirmDialog
        open={!!deleteTarget}
        title="Eintrag löschen"
        message="Möchtest du diesen Eintrag wirklich löschen?"
        onConfirm={handleDeleteConfirmed}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
