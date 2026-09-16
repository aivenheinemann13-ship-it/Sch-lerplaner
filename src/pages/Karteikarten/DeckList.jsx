import { Plus, Pencil, Trash2, Play, ChevronRight } from "lucide-react";
import { Card } from "../../components/common/Card.jsx";
import { Button } from "../../components/common/Button.jsx";
import { subjectName } from "../../data/selectors.js";
import { useAppData } from "../../context/AppDataContext.jsx";

export function DeckList({ decks, onOpen, onStudy, onEdit, onDelete, onNew }) {
  const { state } = useAppData();

  return (
    <div className="deck-grid">
      <button className="deck-card deck-card--new" onClick={onNew}>
        <Plus size={22} />
        <span>Neues Deck</span>
      </button>
      {decks.map((deck) => {
        const cardCount = state.flashcards.filter((c) => c.deckId === deck.id).length;
        return (
          <Card key={deck.id} className="deck-card">
            <div className="deck-card__header">
              <h4>{deck.name}</h4>
              <div className="subject-card__actions">
                <button className="icon-button icon-button--sm" onClick={() => onEdit(deck)}>
                  <Pencil size={14} />
                </button>
                <button className="icon-button icon-button--sm" onClick={() => onDelete(deck)}>
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
            <p className="muted">
              {deck.subjectId ? subjectName(state, deck.subjectId) : "Kein Fach"} · {cardCount} Karten
            </p>
            <div className="deck-card__actions">
              <Button variant="ghost" size="sm" icon={ChevronRight} onClick={() => onOpen(deck)}>
                Karten
              </Button>
              <Button variant="primary" size="sm" icon={Play} onClick={() => onStudy(deck)} disabled={cardCount === 0}>
                Lernen
              </Button>
            </div>
          </Card>
        );
      })}
    </div>
  );
}
