import { useMemo, useState } from "react";
import { RotateCcw, Check, X, ArrowLeft } from "lucide-react";
import { Card } from "../../components/common/Card.jsx";
import { Button } from "../../components/common/Button.jsx";
import { useAppData } from "../../context/AppDataContext.jsx";

function shuffle(array) {
  const copy = [...array];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export function StudyMode({ deck, cards, onExit }) {
  const { actions } = useAppData();
  const [order] = useState(() => shuffle(cards));
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [results, setResults] = useState({ richtig: 0, falsch: 0 });
  const [finished, setFinished] = useState(false);

  const current = order[index];

  const mark = (result) => {
    actions.markFlashcard(current.id, result);
    setResults((r) => ({ ...r, [result]: r[result] + 1 }));
    if (index + 1 >= order.length) {
      setFinished(true);
    } else {
      setIndex((i) => i + 1);
      setFlipped(false);
    }
  };

  if (cards.length === 0) {
    return (
      <Card>
        <p className="muted">Dieses Deck hat noch keine Karten.</p>
        <Button variant="ghost" icon={ArrowLeft} onClick={onExit}>
          Zurück
        </Button>
      </Card>
    );
  }

  if (finished) {
    return (
      <Card className="study-mode-summary">
        <h3>Fertig! 🎉</h3>
        <p>
          ✅ {results.richtig} richtig · ❌ {results.falsch} falsch
        </p>
        <Button variant="primary" onClick={onExit}>
          Zurück zum Deck
        </Button>
      </Card>
    );
  }

  return (
    <div className="study-mode">
      <div className="study-mode__toolbar">
        <Button variant="ghost" icon={ArrowLeft} onClick={onExit}>
          Beenden
        </Button>
        <span className="muted">
          {index + 1} / {order.length}
        </span>
      </div>

      <button className="flashcard fp-pop" onClick={() => setFlipped((f) => !f)}>
        <div className="flashcard__face">
          <span className="flashcard__hint muted">{flipped ? "Antwort" : "Frage"}</span>
          <p className="flashcard__text">{flipped ? current.back : current.front}</p>
          <span className="flashcard__flip-hint muted">Zum Umdrehen klicken</span>
        </div>
      </button>

      <div className="study-mode__actions">
        <Button variant="danger" icon={X} onClick={() => mark("falsch")} disabled={!flipped}>
          Falsch
        </Button>
        <Button variant="ghost" icon={RotateCcw} onClick={() => setFlipped((f) => !f)}>
          Umdrehen
        </Button>
        <Button variant="primary" icon={Check} onClick={() => mark("richtig")} disabled={!flipped}>
          Richtig
        </Button>
      </div>
    </div>
  );
}
