import { useMemo } from "react";
import { Search } from "lucide-react";
import { useSearch } from "../../context/SearchContext.jsx";
import { useAppData } from "../../context/AppDataContext.jsx";
import { useRouter } from "../../router/Router.jsx";
import { searchAll } from "../../data/selectors.js";
import { Modal } from "./Modal.jsx";

export function SearchModal() {
  const { isOpen, closeSearch, query, setQuery } = useSearch();
  const { state } = useAppData();
  const { navigate } = useRouter();

  const results = useMemo(() => searchAll(state, query), [state, query]);

  const goTo = (result) => {
    navigate(result.route, { highlightId: result.id });
    closeSearch();
  };

  return (
    <Modal open={isOpen} onClose={closeSearch} title="Suche" width={560}>
      <div className="search-modal">
        <div className="search-modal__input-wrap">
          <Search size={18} />
          <input
            autoFocus
            className="search-modal__input"
            placeholder="Suche nach Fächern, Hausaufgaben, Tests, Terminen, Notizen, Zielen…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        <div className="search-modal__results">
          {query.trim() === "" && <p className="search-modal__hint">Tippe, um zu suchen.</p>}
          {query.trim() !== "" && results.length === 0 && (
            <p className="search-modal__hint">Keine Ergebnisse für „{query}“.</p>
          )}
          {results.map((r) => (
            <button
              key={`${r.type}-${r.id}`}
              className="search-result"
              onClick={() => goTo(r)}
            >
              <span className="search-result__type">{r.type}</span>
              <span className="search-result__title">{r.title}</span>
              {r.subtitle && <span className="search-result__subtitle">{r.subtitle}</span>}
            </button>
          ))}
        </div>
      </div>
    </Modal>
  );
}
