import { Moon, Sun } from "lucide-react";
import { Card } from "../../components/common/Card.jsx";
import { useTheme } from "../../context/ThemeContext.jsx";
import { ACCENT_COLORS } from "../../data/schema.js";

const ACCENT_LABELS = { blau: "Blau", violett: "Violett", gruen: "Grün", rot: "Rot", orange: "Orange" };
const ACCENT_HEX = { blau: "#3b82f6", violett: "#8b5cf6", gruen: "#22c55e", rot: "#ef4444", orange: "#f97316" };

export function AppearanceSection() {
  const { darkMode, toggleDarkMode, accentColor, setAccentColor, animationsEnabled, toggleAnimations } = useTheme();

  return (
    <Card>
      <h3 className="section-title">Darstellung</h3>

      <div className="settings-row">
        <div>
          <strong>Darstellungsmodus</strong>
          <p className="muted">Zwischen hellem und dunklem Design wechseln.</p>
        </div>
        <button className="toggle-switch" onClick={toggleDarkMode} data-on={darkMode}>
          {darkMode ? <Moon size={14} /> : <Sun size={14} />}
        </button>
      </div>

      <div className="settings-row">
        <div>
          <strong>Akzentfarbe</strong>
          <p className="muted">Wähle deine Lieblingsfarbe für die App.</p>
        </div>
        <div className="accent-picker">
          {ACCENT_COLORS.map((color) => (
            <button
              key={color}
              className={`accent-swatch ${accentColor === color ? "accent-swatch--active" : ""}`}
              style={{ background: ACCENT_HEX[color] }}
              onClick={() => setAccentColor(color)}
              aria-label={ACCENT_LABELS[color]}
            />
          ))}
        </div>
      </div>

      <div className="settings-row">
        <div>
          <strong>Animationen</strong>
          <p className="muted">Übergänge und Animationen ein-/ausschalten.</p>
        </div>
        <button className="toggle-switch" onClick={toggleAnimations} data-on={animationsEnabled} />
      </div>
    </Card>
  );
}
