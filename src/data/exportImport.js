import { SCHEMA_VERSION, emptyState } from "./schema.js";
import { getFile, putFile } from "./db.js";

function blobToBase64(blob) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

function base64ToBlob(dataUrl) {
  return fetch(dataUrl).then((res) => res.blob());
}

export async function buildExportPayload(state, { includeFiles = false } = {}) {
  const payload = {
    exportedAt: new Date().toISOString(),
    schemaVersion: SCHEMA_VERSION,
    app: "Schülerplaner",
    data: state,
  };

  if (includeFiles) {
    const files = {};
    for (const doc of state.documents) {
      if (!doc.fileRef) continue;
      try {
        const blob = await getFile(doc.fileRef);
        if (blob) files[doc.fileRef] = await blobToBase64(blob);
      } catch (err) {
        console.warn("Datei konnte nicht exportiert werden:", doc.name, err);
      }
    }
    payload.files = files;
  }

  return payload;
}

export function downloadJson(payload, filename = "schuelerplaner-export.json") {
  const json = JSON.stringify(payload, null, 2);
  const blob = new Blob([json], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

const REQUIRED_ARRAY_KEYS = [
  "subjects", "timetables", "lessons", "breaks", "homework", "reminders",
  "events", "tests", "grades", "studySessions", "goals", "decks",
  "flashcards", "notes", "documents",
];

export function parseImportPayload(rawText) {
  let parsed;
  try {
    parsed = JSON.parse(rawText);
  } catch {
    return { ok: false, error: "Die Datei ist kein gültiges JSON. Import abgebrochen." };
  }

  const data = parsed?.data && typeof parsed.data === "object" ? parsed.data : parsed;
  if (!data || typeof data !== "object") {
    return { ok: false, error: "Die Datei enthält keine gültigen Schülerplaner-Daten." };
  }

  const defaults = emptyState();
  const merged = { ...defaults, ...data };
  for (const key of REQUIRED_ARRAY_KEYS) {
    if (!Array.isArray(merged[key])) merged[key] = [];
  }
  merged.settings = { ...defaults.settings, ...(data.settings || {}) };
  merged.settings.notifications = {
    ...defaults.settings.notifications,
    ...((data.settings || {}).notifications || {}),
  };
  merged.meta = { schemaVersion: SCHEMA_VERSION };

  return { ok: true, data: merged, files: parsed?.files || null };
}

export async function restoreFilesFromImport(files) {
  if (!files) return;
  for (const [fileRef, dataUrl] of Object.entries(files)) {
    try {
      const blob = await base64ToBlob(dataUrl);
      await putFile(fileRef, blob);
    } catch (err) {
      console.warn("Datei konnte nicht wiederhergestellt werden:", fileRef, err);
    }
  }
}
