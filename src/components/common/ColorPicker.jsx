import { useState } from "react";
import { Wheel } from "@uiw/react-color";
import { SUBJECT_COLORS } from "../../data/schema.js";
import { Check } from "lucide-react";

export function ColorPicker({ value, onChange }) {
  const [showCustom, setShowCustom] = useState(false);
  const [customColor, setCustomColor] = useState(value);

  return (
    <div className="color-picker">
      <div className="color-picker__presets">
        {SUBJECT_COLORS.map((color) => (
          <button
            key={color}
            type="button"
            className="color-swatch"
            style={{ background: color }}
            aria-label={color}
            onClick={() => {
              onChange(color);
              setShowCustom(false);
            }}
          >
            {value === color && <Check size={14} color="#fff" strokeWidth={3} />}
          </button>
        ))}
        <button
          type="button"
          className="color-swatch color-swatch--custom"
          onClick={() => setShowCustom(!showCustom)}
          title="Eigene Farbe wählen"
        >
          +
        </button>
      </div>

      {showCustom && (
        <div className="color-picker__custom">
          <h3 className="color-picker__title">EIGENE FARBE</h3>

          <div className="color-picker__wheel-container">
            <Wheel
              color={customColor}
              onChange={(color) => {
                setCustomColor(color.hex);
                onChange(color.hex);
              }}
              width={240}
              height={240}
            />
          </div>

          <div className="color-picker__info">
            <div
              className="color-picker__preview"
              style={{ background: customColor }}
            />
            <span className="color-picker__hex">{customColor}</span>
          </div>

          <div className="color-picker__buttons">
            <button
              type="button"
              className="color-picker__button color-picker__button--cancel"
              onClick={() => setShowCustom(false)}
            >
              ABBRECHEN
            </button>
            <button
              type="button"
              className="color-picker__button color-picker__button--accept"
              onClick={() => setShowCustom(false)}
            >
              ÜBERNEHMEN
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
