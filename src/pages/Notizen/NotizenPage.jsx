import { useMemo, useState } from "react";
import { Plus, StickyNote, Search } from "lucide-react";
import { PageHeader } from "../../components/common/Card.jsx";
import { Button } from "../../components/common/Button.jsx";
import { EmptyState } from "../../components/common/EmptyState.jsx";
import { ConfirmDialog } from "../../components/common/ConfirmDialog.jsx";
import { useAppData } from "../../context/AppDataContext.jsx";
import { useToast } from "../../context/ToastContext.jsx";
import { NoteForm } from "./NoteForm.jsx";
import { NoteCard } from "./NoteCard.jsx";

export function NotizenPage() {
  const { state, actions } = useAppData();
  const { addToast } = useToast();
  const [query, setQuery] = useState("");
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [toDelete, setToDelete] = useState(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return state.notes;
    return state.notes.filter(
      (n) => n.title.toLowerCase().includes(q) || n.text.toLowerCase().includes(q)
    );
  }, [state.notes, query]);

  const handleSave = (values) => {
    if (values.id) {
      actions.updateNote(values.id, values);
      addToast("Notiz aktualisiert ✅", { type: "success" });
    } else {
      actions.addNote(values);
      addToast("Notiz gespeichert ✅", { type: "success" });
    }
    setFormOpen(false);
  };

  return (
    <div>
      <PageHeader
        title="Notizen"
        subtitle={`${state.notes.length} Notizen`}
        actions={
          <Button
            variant="primary"
            icon={Plus}
            onClick={() => {
              setEditing(null);
              setFormOpen(true);
            }}
          >
            Neue Notiz
          </Button>
        }
      />

      <div className="search-input-wrap">
        <Search size={16} />
        <input
          className="input"
          placeholder="Notizen durchsuchen…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      {state.notes.length === 0 ? (
        <EmptyState icon={<StickyNote size={32} />} title="Noch keine Notizen" message="Erstelle deine erste Notiz." />
      ) : filtered.length === 0 ? (
        <p className="muted">Keine Notizen gefunden für „{query}“.</p>
      ) : (
        <div className="note-grid">
          {filtered.map((n) => (
            <NoteCard
              key={n.id}
              note={n}
              onEdit={(note) => {
                setEditing(note);
                setFormOpen(true);
              }}
              onDelete={setToDelete}
            />
          ))}
        </div>
      )}

      {formOpen && (
        <NoteForm
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
        title="Notiz löschen"
        message={`Möchtest du „${toDelete?.title}“ wirklich löschen?`}
        onConfirm={() => {
          actions.deleteNote(toDelete.id);
          addToast("Notiz gelöscht", { type: "info" });
          setToDelete(null);
        }}
        onCancel={() => setToDelete(null)}
      />
    </div>
  );
}
