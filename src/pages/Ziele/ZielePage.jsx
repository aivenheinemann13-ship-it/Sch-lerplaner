import { useState } from "react";
import { Plus, Target } from "lucide-react";
import { PageHeader } from "../../components/common/Card.jsx";
import { Button } from "../../components/common/Button.jsx";
import { EmptyState } from "../../components/common/EmptyState.jsx";
import { ConfirmDialog } from "../../components/common/ConfirmDialog.jsx";
import { useAppData } from "../../context/AppDataContext.jsx";
import { useToast } from "../../context/ToastContext.jsx";
import { GoalForm } from "./GoalForm.jsx";
import { GoalCard } from "./GoalCard.jsx";

export function ZielePage() {
  const { state, actions } = useAppData();
  const { addToast } = useToast();
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [toDelete, setToDelete] = useState(null);

  const handleSave = (values) => {
    const wasAchieved = editing?.progress >= 100;
    const nowAchieved = values.progress >= 100;
    const achievedAt = nowAchieved ? (wasAchieved ? editing.achievedAt : new Date().toISOString()) : null;

    if (values.id) {
      actions.updateGoal(values.id, { ...values, achievedAt });
      addToast("Ziel aktualisiert ✅", { type: "success" });
    } else {
      actions.addGoal({ ...values, achievedAt });
      addToast("Neues Ziel erstellt 🎯", { type: "success" });
    }
    if (nowAchieved && !wasAchieved) {
      addToast(`🎉 Ziel erreicht: ${values.title}`, { type: "success", duration: 5000 });
    }
    setFormOpen(false);
  };

  const handleDeleteConfirmed = () => {
    actions.deleteGoal(toDelete.id);
    addToast("Ziel gelöscht", { type: "info" });
    setToDelete(null);
  };

  const active = state.goals.filter((g) => g.progress < 100);
  const achieved = state.goals.filter((g) => g.progress >= 100);

  return (
    <div>
      <PageHeader
        title="Ziele"
        subtitle={`${active.length} aktiv · ${achieved.length} erreicht`}
        actions={
          <Button
            variant="primary"
            icon={Plus}
            onClick={() => {
              setEditing(null);
              setFormOpen(true);
            }}
          >
            Neues Ziel
          </Button>
        }
      />

      {state.goals.length === 0 ? (
        <EmptyState
          icon={<Target size={32} />}
          title="Noch keine Ziele"
          message="Setze dir dein erstes Lernziel."
        />
      ) : (
        <>
          <div className="goal-grid">
            {active.map((g) => (
              <GoalCard
                key={g.id}
                goal={g}
                onEdit={(goal) => {
                  setEditing(goal);
                  setFormOpen(true);
                }}
                onDelete={setToDelete}
              />
            ))}
          </div>
          {achieved.length > 0 && (
            <>
              <h3 className="section-title">Erreichte Ziele 🏆</h3>
              <div className="goal-grid">
                {achieved.map((g) => (
                  <GoalCard
                    key={g.id}
                    goal={g}
                    onEdit={(goal) => {
                      setEditing(goal);
                      setFormOpen(true);
                    }}
                    onDelete={setToDelete}
                  />
                ))}
              </div>
            </>
          )}
        </>
      )}

      {formOpen && (
        <GoalForm
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
        title="Ziel löschen"
        message={`Möchtest du „${toDelete?.title}“ wirklich löschen?`}
        onConfirm={handleDeleteConfirmed}
        onCancel={() => setToDelete(null)}
      />
    </div>
  );
}
