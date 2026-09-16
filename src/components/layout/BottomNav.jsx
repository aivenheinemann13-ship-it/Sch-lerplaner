import { NAV_ITEMS, MOBILE_NAV_ROUTES } from "../../router/routes.js";
import { useRouter } from "../../router/Router.jsx";
import { Icon } from "../common/Icon.jsx";

export function BottomNav() {
  const { route, navigate } = useRouter();
  const items = MOBILE_NAV_ROUTES.map((r) => NAV_ITEMS.find((item) => item.route === r)).filter(Boolean);

  return (
    <nav className="bottom-nav">
      {items.map((item) => (
        <button
          key={item.route}
          className={`bottom-nav__link ${route === item.route ? "bottom-nav__link--active" : ""}`}
          onClick={() => navigate(item.route)}
        >
          <Icon name={item.icon} size={20} />
          <span>{item.label}</span>
        </button>
      ))}
    </nav>
  );
}
