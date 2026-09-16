import { useState } from "react";
import { ArrowLeft, Plus, Pencil, Trash2, Layers } from "lucide-react";
import { PageHeader, Card } from "../../components/common/Card.jsx";
import { Button } from "../../components/common/Button.jsx";
import { EmptyState } from "../../components/common/EmptyState.jsx";
import { ConfirmDialog } from "../../components/common/ConfirmDialog.jsx";
import { useAppData } from "../../context/AppDataContext.jsx";
import { useToast } from "../../context/ToastContext.jsx";
import { DeckList } from "./DeckList.jsx";
import { DeckForm, FlashcardForm } from "./FlashcardForm.jsx";
import { StudyMode } from "./StudyMode.jsx";

export function KarteikartenPage() {
  const { state, actions } = useAppData();
  const { addToast } = useToast();
  const [view, setView] = useState("decks"); // decks | cards | study
  const [selectedDeckId, setSelectedDeckId] = useState(null);
  const [deckFormOpen, setDeckFormOpen] = useState(false);
  const [editingDeck, setEditingDeck] = useState(null);
  const [deckToDelete, setDeckToDelete] = useState(null);
  const [cardFormOpen, setCardFormOpen] = useState(false);
  const [editingCard, setEditingCard] = useState(null);
  const [cardToDelete, setCardToDelete] = useState(null);

  const selectedDeck = state.decks.find((d) => d.id === selectedDeckId);
  const deckCards = state.flashcards.filter((c) => c.deckId === selectedDeckId);

  const handleSaveDeck = (values) => {
    if (values.id) {
      actions.updateDeck(values.id, values);
      addToast("Deck aktualisiert ✅", { type: "success" });
    } else {
      actions.addDeck(values);
      addToast("Deck erstellt ✅", { type: "success" });
    }
    setDeckFormOpen(false);
  };

  const handleSaveCard = (values) => {
    if (values.id) {
      actions.updateFlashcard(values.id, values);
      addToast("Karte aktualisiert ✅", { type: "success" });
    } else {
      actions.addFlashcard({ ...values, deckId: selectedDeckId });
      addToast("Karte erstellt ✅", { type: "success" });
    }
    setCardFormOpen(false);
  };

  if (view === "study" && selectedDeck) {
    return (
      <div>
        <PageHeader title={`Lernen: ${selectedDeck.name}`} />
        <StudyMode deck={selectedDeck} cards={deckCards} onExit={() => setView("cards")} />
      </div>
    );
  }

  if (view === "cards" && selectedDeck) {
    return (
      <div>
        <button className="back-link" onClick={() => setView("decks")}>
          <ArrowLeft size={16} /> Zurück zu Decks
        </button>
        <PageHeader
          title={selectedDeck.name}
          subtitle={`${deckCards.length} Karten`}
          actions={
            <Button
              variant="primary"
              icon={Plus}
              onClick={() => {
                setEditingCard(null);
                setCardFormOpen(true);
              }}
            >
              Karte hinzufügen
            </Button>
          }
        />
        {deckCards.length === 0 ? (
          <EmptyState title="Noch keine Karten" message="Füge deine erste Karteikarte hinzu." />
        ) : (
          <div className="card-list">
            {deckCards.map((c) => (
              <Card key={c.id} className="flashcard-row">
                <div>
                  <p>
                    <strong>Vorne:</strong> {c.front}
                  </p>
                  <p className="muted">
                    <strong>Hinten:</strong> {c.back}
                  </p>
                  <p className="muted">
                    ✅ {c.correctCount} · ❌ {c.wrongCount}
                  </p>
                </div>
                <div className="subject-card__actions">
                  <button
                    className="icon-button icon-button--sm"
                    onClick={() => {
                      setEditingCard(c);
                      setCardFormOpen(true);
                    }}
                  >
                    <Pencil size={14} />
                  </button>
                  <button className="icon-button icon-button--sm" onClick={() => setCardToDelete(c)}>
                    <Trash2 size={14} />
                  </button>
                </div>
              </Card>
            ))}
          </div>
        )}

        {cardFormOpen && (
          <FlashcardForm
            key={editingCard?.id || "new"}
            open={cardFormOpen}
            onClose={() => setCardFormOpen(false)}
            onSave={handleSaveCard}
            initialValues={editingCard}
          />
        )}
        <ConfirmDialog
          open={!!cardToDelete}
          title="Karte löschen"
          message="Möchtest du diese Karteikarte wirklich löschen?"
          onConfirm={() => {
            actions.deleteFlashcard(cardToDelete.id);
            addToast("Karte gelöscht", { type: "info" });
            setCardToDelete(null);
          }}
          onCancel={() => setCardToDelete(null)}
        />
      </div>
    );
  }

  return (
    <div>
      <PageHeader title="Karteikarten" subtitle={`${state.decks.length} Decks`} />

      {state.decks.length === 0 ? (
        <EmptyState
          icon={<Layers size={32} />}
          title="Noch keine Decks"
          message="Erstelle dein erstes Karteikarten-Deck."
          action={
            <Button
              variant="primary"
              icon={Plus}
              onClick={() => {
                setEditingDeck(null);
                setDeckFormOpen(true);
              }}
            >
              Deck erstellen
            </Button>
          }
        />
      ) : (
        <DeckList
          decks={state.decks}
          onOpen={(d) => {
            setSelectedDeckId(d.id);
            setView("cards");
          }}
          onStudy={(d) => {
            setSelectedDeckId(d.id);
            setView("study");
          }}
          onEdit={(d) => {
            setEditingDeck(d);
            setDeckFormOpen(true);
          }}
          onDelete={setDeckToDelete}
          onNew={() => {
            setEditingDeck(null);
            setDeckFormOpen(true);
          }}
        />
      )}

      {deckFormOpen && (
        <DeckForm
          key={editingDeck?.id || "new"}
          open={deckFormOpen}
          onClose={() => setDeckFormOpen(false)}
          onSave={handleSaveDeck}
          initialValues={editingDeck}
          subjects={state.subjects}
        />
      )}

      <ConfirmDialog
        open={!!deckToDelete}
        title="Deck löschen"
        message={`Möchtest du „${deckToDelete?.name}“ und alle enthaltenen Karten wirklich löschen?`}
        onConfirm={() => {
          actions.deleteDeck(deckToDelete.id);
          addToast("Deck gelöscht", { type: "info" });
          setDeckToDelete(null);
        }}
        onCancel={() => setDeckToDelete(null)}
      />
    </div>
  );
}
