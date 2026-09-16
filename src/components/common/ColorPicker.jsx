import { useState, useRef, useEffect } from "react";
import { SUBJECT_COLORS } from "../../data/schema.js";
import { Check } from "lucide-react";

export function ColorPicker({ value, onChange }) {
  const [showCustom, setShowCustom] = useState(false);
  const [customColor, setCustomColor] = useState(value);
  const canvasRef = useRef(null);

  const handleCanvasClick = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = Math.min(centerX, centerY) - 8;

    const dx = x - centerX;
    const dy = y - centerY;
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance <= radius) {
      const angle = Math.atan2(dy, dx) * (180 / Math.PI) + 90;
      const hue = (angle + 360) % 360;

      const lightness = distance / radius;
      const saturation = 100;

      const hex = hslToHex(hue, saturation, 50 + lightness * 25);
      setCustomColor(hex);
      onChange(hex);
    }
  };

  const handleHexInput = (e) => {
    const hex = e.target.value;
    if (/^#[0-9A-F]{6}$/i.test(hex)) {
      setCustomColor(hex);
      onChange(hex);
    }
  };

  const drawColorWheel = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = Math.min(centerX, centerY) - 8;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let angle = 0; angle < 360; angle += 2) {
      for (let r = 0; r < radius; r += 2) {
        const rad = ((angle - 90) * Math.PI) / 180;
        const x = centerX + r * Math.cos(rad);
        const y = centerY + r * Math.sin(rad);

        const lightness = 50 + (r / radius) * 25;
        const color = `hsl(${angle}, 100%, ${lightness}%)`;

        ctx.fillStyle = color;
        ctx.fillRect(x, y, 2, 2);
      }
    }

    ctx.strokeStyle = "rgba(255,255,255,0.3)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
    ctx.stroke();
  };

  useEffect(() => {
    if (showCustom) {
      setTimeout(drawColorWheel, 0);
    }
  }, [showCustom]);

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
          <canvas
            ref={canvasRef}
            width={200}
            height={200}
            onClick={handleCanvasClick}
            className="color-picker__wheel"
            title="Klick auf das Farbrad um eine Farbe zu wählen"
          />
          <div className="color-picker__input-group">
            <label>Hex:</label>
            <input
              type="text"
              value={customColor}
              onChange={handleHexInput}
              placeholder="#RRGGBB"
              maxLength={7}
            />
            <div
              className="color-picker__preview"
              style={{ background: customColor }}
            />
          </div>
        </div>
      )}
    </div>
  );
}

function hslToHex(h, s, l) {
  const c = ((100 - Math.abs(2 * l - 100)) * s) / 100;
  const x = (c * (1 - Math.abs(((h / 60) % 2) - 1)));
  const m = l / 100 - c / 2;

  let r, g, b;
  if (h < 60) [r, g, b] = [c, x, 0];
  else if (h < 120) [r, g, b] = [x, c, 0];
  else if (h < 180) [r, g, b] = [0, c, x];
  else if (h < 240) [r, g, b] = [0, x, c];
  else if (h < 300) [r, g, b] = [x, 0, c];
  else [r, g, b] = [c, 0, x];

  const toHex = (n) => {
    const hex = Math.round((n + m) * 255).toString(16);
    return hex.length === 1 ? "0" + hex : hex;
  };

  return `#${toHex(r)}${toHex(g)}${toHex(b)}`.toUpperCase();
}
