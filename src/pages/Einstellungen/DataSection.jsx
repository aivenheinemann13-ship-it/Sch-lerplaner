import { useRef, useState } from "react";
import { Download, Upload, Trash2 } from "lucide-react";
import { Card } from "../../components/common/Card.jsx";
import { Button } from "../../components/common/Button.jsx";
import { ConfirmDialog } from "../../components/common/ConfirmDialog.jsx";
import { useAppData } from "../../context/AppDataContext.jsx";
import { useToast } from "../../context/ToastContext.jsx";
import {
  buildExportPayload,
  downloadJson,
  parseImportPayload,
  restoreFilesFromImport,
} from "../../data/exportImport.js";
import { emptyState, defaultSettings } from "../../data/schema.js";

export function DataSection() {
  const { state, actions } = useAppData();
  const { addToast } = useToast();
  const fileInputRef = useRef(null);
  const [includeFiles, setIncludeFiles] = useState(false);
  const [resetConfirmOpen, setResetConfirmOpen] = useState(false);
  const [busy, setBusy] = useState(false);

  const handleExport = async () => {
    setBusy(true);
    try {
      const payload = await buildExportPayload(state, { includeFiles });
      downloadJson(payload);
      addToast("Export erfolgreich heruntergeladen ✅", { type: "success" });
    } catch (err) {
      addToast("Export fehlgeschlagen.", { type: "error" });
      console.error(err);
    } finally {
      setBusy(false);
    }
  };

  const handleImportFile = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    setBusy(true);
    try {
      const text = await file.text();
      const result = parseImportPayload(text);
      if (!result.ok) {
        addToast(result.error, { type: "error", duration: 5000 });
        return;
      }
      await restoreFilesFromImport(result.files);
      actions.importData(result.data);
      addToast("Daten erfolgreich importiert ✅", { type: "success" });
    } catch (err) {
      addToast("Import fehlgeschlagen: ungültige Datei.", { type: "error" });
      console.error(err);
    } finally {
      setBusy(false);
    }
  };

  const handleResetConfirmed = () => {
    actions.resetData({ ...emptyState(), settings: defaultSettings() });
    addToast("Alle Daten wurden gelöscht.", { type: "info" });
    setResetConfirmOpen(false);
  };

  return (
    <Card>
      <h3 className="section-title">Daten</h3>

      <div className="settings-row">
        <div>
          <strong>Daten exportieren</strong>
          <p className="muted">Erstellt eine JSON-Sicherungsdatei deines gesamten Schülerplaners.</p>
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={includeFiles}
              onChange={(e) => setIncludeFiles(e.target.checked)}
            />
            Dateien aus „Dokumente“ einschließen (größere Datei)
          </label>
        </div>
        <Button variant="primary" icon={Download} onClick={handleExport} disabled={busy}>
          Exportieren
        </Button>
      </div>

      <div className="settings-row">
        <div>
          <strong>Daten importieren</strong>
          <p className="muted">Stelle deine Daten aus einer zuvor exportierten Datei wieder her.</p>
        </div>
        <Button variant="ghost" icon={Upload} onClick={() => fileInputRef.current?.click()} disabled={busy}>
          Importieren
        </Button>
        <input ref={fileInputRef} type="file" accept="application/json" hidden onChange={handleImportFile} />
      </div>

      <div className="settings-row">
        <div>
          <strong>Alle Daten löschen</strong>
          <p className="muted">Setzt den Schülerplaner vollständig zurück. Dies kann nicht rückgängig gemacht werden.</p>
        </div>
        <Button variant="danger" icon={Trash2} onClick={() => setResetConfirmOpen(true)}>
          Alles löschen
        </Button>
      </div>

      <ConfirmDialog
        open={resetConfirmOpen}
        title="Alle Daten löschen"
        message="Möchtest du wirklich ALLE Daten unwiderruflich löschen? Diese Aktion kann nicht rückgängig gemacht werden."
        onConfirm={handleResetConfirmed}
        onCancel={() => setResetConfirmOpen(false)}
      />
    </Card>
  );
}
