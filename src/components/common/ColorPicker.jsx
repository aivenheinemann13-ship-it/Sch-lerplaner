import { SUBJECT_COLORS } from "../../data/schema.js";
import { Check } from "lucide-react";

export function ColorPicker({ value, onChange }) {
  return (
    <div className="color-picker">
      {SUBJECT_COLORS.map((color) => (
        <button
          key={color}
          type="button"
          className="color-swatch"
          style={{ background: color }}
          aria-label={color}
          onClick={() => onChange(color)}
        >
          {value === color && <Check size={14} color="#fff" strokeWidth={3} />}
        </button>
      ))}
    </div>
  );
}
