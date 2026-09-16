import { useState } from "react";
import { Hue, Saturation } from "@uiw/react-color";
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
            <Saturation
              hsba={hexToHsba(customColor)}
              onChange={(newHsba) => {
                const newColor = hsbaToHex(newHsba);
                setCustomColor(newColor);
                onChange(newColor);
              }}
              style={{
                width: "100%",
                height: "180px",
                borderRadius: "8px",
                marginBottom: "12px"
              }}
            />
            <Hue
              hue={hexToHsba(customColor).h}
              onChange={(newHue) => {
                const hsba = hexToHsba(customColor);
                hsba.h = newHue;
                const newColor = hsbaToHex(hsba);
                setCustomColor(newColor);
                onChange(newColor);
              }}
              style={{
                width: "100%",
                height: "24px",
                borderRadius: "8px"
              }}
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

function hexToHsba(hex) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) return { h: 0, s: 0, b: 100, a: 1 };

  const [r, g, b] = [
    parseInt(result[1], 16) / 255,
    parseInt(result[2], 16) / 255,
    parseInt(result[3], 16) / 255
  ];

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const brightness = max;
  const delta = max - min;
  const saturation = max === 0 ? 0 : delta / max;

  let hue = 0;
  if (delta !== 0) {
    if (max === r) hue = ((g - b) / delta) % 6;
    else if (max === g) hue = (b - r) / delta + 2;
    else hue = (r - g) / delta + 4;
    hue *= 60;
    if (hue < 0) hue += 360;
  }

  return {
    h: hue,
    s: saturation * 100,
    b: brightness * 100,
    a: 1
  };
}

function hsbaToHex(hsba) {
  const h = hsba.h;
  const s = hsba.s / 100;
  const b = hsba.b / 100;

  const c = b * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = b - c;

  let r, g, bl;
  if (h < 60) [r, g, bl] = [c, x, 0];
  else if (h < 120) [r, g, bl] = [x, c, 0];
  else if (h < 180) [r, g, bl] = [0, c, x];
  else if (h < 240) [r, g, bl] = [0, x, c];
  else if (h < 300) [r, g, bl] = [x, 0, c];
  else [r, g, bl] = [c, 0, x];

  const toHex = (n) => {
    const hex = Math.round((n + m) * 255).toString(16);
    return hex.length === 1 ? "0" + hex : hex;
  };

  return `#${toHex(r)}${toHex(g)}${toHex(bl)}`.toUpperCase();
}
