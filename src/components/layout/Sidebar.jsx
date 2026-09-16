import { NAV_ITEMS } from "../../router/routes.js";
import { useRouter } from "../../router/Router.jsx";
import { Icon } from "../common/Icon.jsx";
import { GraduationCap } from "lucide-react";

export function Sidebar({ onNavigate }) {
  const { route, navigate } = useRouter();

  const handleClick = (target) => {
    navigate(target);
    onNavigate?.();
  };

  return (
    <aside className="sidebar">
      <div className="sidebar__brand">
        <GraduationCap size={22} />
        <span>Schülerplaner</span>
      </div>
      <nav className="sidebar__nav">
        {NAV_ITEMS.map((item) => (
          <button
            key={item.route}
            className={`sidebar__link ${route === item.route ? "sidebar__link--active" : ""}`}
            onClick={() => handleClick(item.route)}
          >
            <Icon name={item.icon} size={19} />
            <span>{item.label}</span>
          </button>
        ))}
      </nav>
    </aside>
  );
}
