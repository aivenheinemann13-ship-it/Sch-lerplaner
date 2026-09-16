import { emptyState, SCHEMA_VERSION } from "./schema.js";
import { buildSeedState } from "./seed.js";

const STORAGE_KEY = "schuelerplaner:v1";

// Merge loaded data over the default shape so any field added in a later
// version doesn't crash on an older saved state.
function mergeWithDefaults(loaded) {
  const defaults = emptyState();
  if (!loaded || typeof loaded !== "object") return defaults;
  const merged = { ...defaults, ...loaded };
  merged.settings = { ...defaults.settings, ...(loaded.settings || {}) };
  merged.settings.notifications = {
    ...defaults.settings.notifications,
    ...((loaded.settings || {}).notifications || {}),
  };
  merged.meta = { ...defaults.meta, ...(loaded.meta || {}) };
  for (const key of Object.keys(defaults)) {
    if (Array.isArray(defaults[key]) && !Array.isArray(merged[key])) {
      merged[key] = [];
    }
  }
  return merged;
}

export function loadState() {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return buildSeedState();
    }
    const parsed = JSON.parse(raw);
    if (!parsed || parsed.meta?.schemaVersion !== SCHEMA_VERSION) {
      return buildSeedState();
    }
    return mergeWithDefaults(parsed);
  } catch (err) {
    console.warn("Konnte gespeicherten Zustand nicht laden, verwende Standarddaten.", err);
    return buildSeedState();
  }
}

export function saveState(state) {
  try {
    const toSave = { ...state, meta: { ...state.meta, schemaVersion: SCHEMA_VERSION } };
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
    return { ok: true };
  } catch (err) {
    console.error("Speichern fehlgeschlagen.", err);
    return { ok: false, error: err };
  }
}

export function clearAllData() {
  window.localStorage.removeItem(STORAGE_KEY);
}

export const STORAGE_KEY_NAME = STORAGE_KEY;
