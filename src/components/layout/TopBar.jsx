import { Search, Moon, Sun, Menu } from "lucide-react";
import { useSearch } from "../../context/SearchContext.jsx";
import { useTheme } from "../../context/ThemeContext.jsx";
import { NAV_ITEMS } from "../../router/routes.js";
import { useRouter } from "../../router/Router.jsx";

export function TopBar({ onOpenMobileMenu }) {
  const { openSearch } = useSearch();
  const { darkMode, toggleDarkMode } = useTheme();
  const { route } = useRouter();
  const current = NAV_ITEMS.find((i) => i.route === route);

  return (
    <header className="top-bar">
      <button className="icon-button top-bar__menu" onClick={onOpenMobileMenu} aria-label="Menü">
        <Menu size={20} />
      </button>
      <h2 className="top-bar__title">{current?.label || ""}</h2>
      <div className="top-bar__actions">
        <button className="search-trigger" onClick={openSearch}>
          <Search size={16} />
          <span>Suche…</span>
          <kbd>Strg K</kbd>
        </button>
        <button className="icon-button" onClick={toggleDarkMode} aria-label="Darstellung umschalten">
          {darkMode ? <Sun size={19} /> : <Moon size={19} />}
        </button>
      </div>
    </header>
  );
}
