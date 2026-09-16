import { useState, useRef, useEffect } from "react";
import { SUBJECT_COLORS } from "../../data/schema.js";
import { Check } from "lucide-react";

export function ColorPicker({ value, onChange }) {
  const [showCustom, setShowCustom] = useState(false);
  const [customColor, setCustomColor] = useState(value);
  const canvasRef = useRef(null);

  const pickColor = (x, y) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = Math.min(centerX, centerY) - 8;

    const dx = x - centerX;
    const dy = y - centerY;
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance <= radius) {
      const angle = Math.atan2(dy, dx) * (180 / Math.PI) + 90;
      const hue = (angle + 360) % 360;

      const lightness = (distance / radius) * 25;
      const saturation = 100;

      const hex = hslToHex(hue, saturation, 50 + lightness);
      setCustomColor(hex);
      onChange(hex);
    }
  };

  const handleCanvasInteraction = (e) => {
    if (e.touches) e.preventDefault();

    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();

    let x, y;
    if (e.touches) {
      x = e.touches[0].clientX - rect.left;
      y = e.touches[0].clientY - rect.top;
    } else {
      if (e.type === "mousemove" && e.buttons === 0) return;
      x = e.clientX - rect.left;
      y = e.clientY - rect.top;
    }

    pickColor(x, y);
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

    const imageData = ctx.createImageData(canvas.width, canvas.height);
    const data = imageData.data;

    for (let y = 0; y < canvas.height; y++) {
      for (let x = 0; x < canvas.width; x++) {
        const dx = x - centerX;
        const dy = y - centerY;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance <= radius) {
          const angle = Math.atan2(dy, dx) * (180 / Math.PI) + 90;
          const hue = (angle + 360) % 360;
          const lightness = 50 + (distance / radius) * 25;

          const [r, g, b] = hslToRgb(hue, 100, lightness);

          const idx = (y * canvas.width + x) * 4;
          data[idx] = r;
          data[idx + 1] = g;
          data[idx + 2] = b;
          data[idx + 3] = 255;
        }
      }
    }

    ctx.putImageData(imageData, 0, 0);

    ctx.strokeStyle = "rgba(255,255,255,0.2)";
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
            onMouseDown={handleCanvasInteraction}
            onMouseMove={handleCanvasInteraction}
            onTouchStart={handleCanvasInteraction}
            onTouchMove={handleCanvasInteraction}
            className="color-picker__wheel"
            title="Tippe oder wische um eine Farbe zu wählen"
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

function hslToRgb(h, s, l) {
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

  return [
    Math.round((r + m) * 255),
    Math.round((g + m) * 255),
    Math.round((b + m) * 255),
  ];
}

function hslToHex(h, s, l) {
  const [r, g, b] = hslToRgb(h, s, l);
  const toHex = (n) => {
    const hex = n.toString(16);
    return hex.length === 1 ? "0" + hex : hex;
  };

  return `#${toHex(r)}${toHex(g)}${toHex(b)}`.toUpperCase();
}
