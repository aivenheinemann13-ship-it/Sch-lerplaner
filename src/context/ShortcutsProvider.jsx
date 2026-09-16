import { useGlobalKeydown } from "../hooks/useKeyboardShortcut.js";
import { useSearch } from "./SearchContext.jsx";
import { useRouter } from "../router/Router.jsx";
import { useToast } from "./ToastContext.jsx";
import { useAppData } from "./AppDataContext.jsx";
import { saveState } from "../data/storage.js";
import { ROUTES } from "../router/routes.js";

function isTypingTarget(el) {
  if (!el) return false;
  const tag = el.tagName;
  return tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT" || el.isContentEditable;
}

export function ShortcutsProvider({ children }) {
  const { openSearch, closeSearch, isOpen } = useSearch();
  const { navigate } = useRouter();
  const { addToast } = useToast();
  const { state } = useAppData();

  useGlobalKeydown((e) => {
    const ctrlOrCmd = e.ctrlKey || e.metaKey;

    if (ctrlOrCmd && e.key.toLowerCase() === "k") {
      e.preventDefault();
      openSearch();
      return;
    }

    if (ctrlOrCmd && e.key.toLowerCase() === "n") {
      if (isTypingTarget(document.activeElement)) return;
      e.preventDefault();
      navigate(ROUTES.HAUSAUFGABEN, { openNew: true });
      return;
    }

    if (ctrlOrCmd && e.key.toLowerCase() === "s") {
      e.preventDefault();
      const result = saveState(state);
      addToast(result.ok ? "Gespeichert ✅" : "Speichern fehlgeschlagen", {
        type: result.ok ? "success" : "error",
      });
      return;
    }

    if (e.key === "Escape" && isOpen) {
      closeSearch();
    }
  }, [openSearch, closeSearch, isOpen, navigate, addToast, state]);

  return children;
}
