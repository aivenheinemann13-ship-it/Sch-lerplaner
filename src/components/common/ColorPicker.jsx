import { useState, useRef, useEffect } from "react";
import { SUBJECT_COLORS } from "../../data/schema.js";
import { Check } from "lucide-react";

export function ColorPicker({ value, onChange }) {
  const [showCustom, setShowCustom] = useState(false);
  const [customColor, setCustomColor] = useState(value);
  const [hue, setHue] = useState(0);
  const [saturation, setSaturation] = useState(100);
  const [lightness, setLightness] = useState(50);
  const canvasRef = useRef(null);

  // Update customColor when hue/sat/light changes
  useEffect(() => {
    const hex = hslToHex(hue, saturation, lightness);
    setCustomColor(hex);
    onChange(hex);
  }, [hue, saturation, lightness]);

  // Parse initial color to get HSL values
  useEffect(() => {
    if (showCustom && /^#[0-9A-F]{6}$/i.test(value)) {
      const rgb = hexToRgb(value);
      const [h, s, l] = rgbToHsl(rgb[0], rgb[1], rgb[2]);
      setHue(h);
      setSaturation(s);
      setLightness(l);
    }
  }, [showCustom]);

  const pickHueFromCanvas = (x, y) => {
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
      const newHue = (angle + 360) % 360;
      setHue(newHue);
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

    pickHueFromCanvas(x, y);
  };

  const drawColorWheel = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = Math.min(centerX, centerY) - 8;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw hue wheel (constant saturation and lightness)
    const imageData = ctx.createImageData(canvas.width, canvas.height);
    const data = imageData.data;

    for (let y = 0; y < canvas.height; y++) {
      for (let x = 0; x < canvas.width; x++) {
        const dx = x - centerX;
        const dy = y - centerY;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance <= radius) {
          const angle = Math.atan2(dy, dx) * (180 / Math.PI) + 90;
          const wheelHue = (angle + 360) % 360;

          // Use current saturation and lightness from sliders
          const [r, g, b] = hslToRgb(wheelHue, saturation, lightness);

          const idx = (y * canvas.width + x) * 4;
          data[idx] = r;
          data[idx + 1] = g;
          data[idx + 2] = b;
          data[idx + 3] = 255;
        }
      }
    }

    ctx.putImageData(imageData, 0, 0);

    // Draw center indicator for current hue
    const hueRad = (hue - 90) * (Math.PI / 180);
    const indicatorX = centerX + Math.cos(hueRad) * (radius * 0.85);
    const indicatorY = centerY + Math.sin(hueRad) * (radius * 0.85);

    ctx.strokeStyle = "rgba(255,255,255,0.9)";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(indicatorX, indicatorY, 7, 0, Math.PI * 2);
    ctx.stroke();

    ctx.strokeStyle = "rgba(0,0,0,0.5)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(indicatorX, indicatorY, 7, 0, Math.PI * 2);
    ctx.stroke();

    // Draw circle border
    ctx.strokeStyle = "rgba(255,255,255,0.3)";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
    ctx.stroke();
  };

  useEffect(() => {
    if (showCustom) {
      setTimeout(drawColorWheel, 0);
    }
  }, [showCustom, hue, saturation, lightness]);

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
            width={220}
            height={220}
            onMouseDown={handleCanvasInteraction}
            onMouseMove={handleCanvasInteraction}
            onTouchStart={handleCanvasInteraction}
            onTouchMove={handleCanvasInteraction}
            className="color-picker__wheel"
            title="Tippe oder wische um Farbton zu wählen"
          />

          <div className="color-picker__sliders">
            <div className="color-picker__slider-group">
              <label>Sättigung</label>
              <input
                type="range"
                min="0"
                max="100"
                value={saturation}
                onChange={(e) => setSaturation(Number(e.target.value))}
                className="color-picker__slider"
                style={{
                  background: `linear-gradient(to right, hsl(${hue}, 0%, ${lightness}%), hsl(${hue}, 100%, ${lightness}%))`
                }}
              />
              <span>{Math.round(saturation)}%</span>
            </div>

            <div className="color-picker__slider-group">
              <label>Helligkeit</label>
              <input
                type="range"
                min="0"
                max="100"
                value={lightness}
                onChange={(e) => setLightness(Number(e.target.value))}
                className="color-picker__slider"
                style={{
                  background: `linear-gradient(to right, hsl(${hue}, ${saturation}%, 0%), hsl(${hue}, ${saturation}%, 50%), hsl(${hue}, ${saturation}%, 100%))`
                }}
              />
              <span>{Math.round(lightness)}%</span>
            </div>
          </div>

          <div className="color-picker__input-group">
            <label>Hex:</label>
            <input
              type="text"
              value={customColor}
              onChange={(e) => {
                const hex = e.target.value;
                if (/^#[0-9A-F]{6}$/i.test(hex)) {
                  const rgb = hexToRgb(hex);
                  const [h, s, l] = rgbToHsl(rgb[0], rgb[1], rgb[2]);
                  setHue(h);
                  setSaturation(s);
                  setLightness(l);
                }
              }}
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

function hexToRgb(hex) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? [parseInt(result[1], 16), parseInt(result[2], 16), parseInt(result[3], 16)]
    : [0, 0, 0];
}

function rgbToHsl(r, g, b) {
  r /= 255;
  g /= 255;
  b /= 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0,
    s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

    switch (max) {
      case r:
        h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
        break;
      case g:
        h = ((b - r) / d + 2) / 6;
        break;
      case b:
        h = ((r - g) / d + 4) / 6;
        break;
    }
  }

  return [Math.round(h * 360), Math.round(s * 100), Math.round(l * 100)];
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
