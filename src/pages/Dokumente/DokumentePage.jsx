import { useState } from "react";
import { FolderOpen } from "lucide-react";
import { PageHeader } from "../../components/common/Card.jsx";
import { EmptyState } from "../../components/common/EmptyState.jsx";
import { ConfirmDialog } from "../../components/common/ConfirmDialog.jsx";
import { Select } from "../../components/common/FormField.jsx";
import { useAppData } from "../../context/AppDataContext.jsx";
import { useToast } from "../../context/ToastContext.jsx";
import { putFile, getFile, deleteFile } from "../../data/db.js";
import { createId } from "../../utils/id.js";
import { DOCUMENT_CATEGORIES, DOCUMENT_CATEGORY_LABELS } from "../../data/schema.js";
import { UploadDropzone } from "./UploadDropzone.jsx";
import { DocumentCard } from "./DocumentCard.jsx";

const SIZE_WARNING_BYTES = 20 * 1024 * 1024;

export function DokumentePage() {
  const { state, actions } = useAppData();
  const { addToast } = useToast();
  const [category, setCategory] = useState("arbeitsblaetter");
  const [subjectFilter, setSubjectFilter] = useState("");
  const [toDelete, setToDelete] = useState(null);

  const totalBytes = state.documents.reduce((acc, d) => acc + d.sizeBytes, 0);

  const handleFiles = async (fileList) => {
    for (const file of Array.from(fileList)) {
      if (file.size > SIZE_WARNING_BYTES) {
        addToast(`„${file.name}“ ist größer als 20 MB – wird trotzdem gespeichert.`, {
          type: "warning",
          duration: 5000,
        });
      }
      const fileRef = createId();
      try {
        await putFile(fileRef, file);
        actions.addDocument({
          name: file.name,
          category,
          subjectId: subjectFilter || null,
          sizeBytes: file.size,
          mimeType: file.type,
          fileRef,
        });
        addToast(`„${file.name}“ hochgeladen ✅`, { type: "success" });
      } catch (err) {
        addToast(`Upload von „${file.name}“ fehlgeschlagen.`, { type: "error" });
        console.error(err);
      }
    }
  };

  const handleDownload = async (doc) => {
    try {
      const blob = await getFile(doc.fileRef);
      if (!blob) {
        addToast("Datei konnte nicht gefunden werden.", { type: "error" });
        return;
      }
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = doc.name;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch (err) {
      addToast("Datei konnte nicht geladen werden.", { type: "error" });
      console.error(err);
    }
  };

  const handleDeleteConfirmed = async () => {
    try {
      await deleteFile(toDelete.fileRef);
    } catch (err) {
      console.warn(err);
    }
    actions.deleteDocument(toDelete.id);
    addToast("Dokument gelöscht", { type: "info" });
    setToDelete(null);
  };

  const docsForCategory = state.documents.filter((d) => d.category === category);

  return (
    <div>
      <PageHeader
        title="Dokumente"
        subtitle={`${state.documents.length} Dateien · ${(totalBytes / (1024 * 1024)).toFixed(1)} MB gesamt`}
      />

      <div className="calendar-toolbar">
        <div className="segmented">
          {DOCUMENT_CATEGORIES.map((c) => (
            <button
              key={c}
              className={category === c ? "segmented__btn segmented__btn--active" : "segmented__btn"}
              onClick={() => setCategory(c)}
            >
              {DOCUMENT_CATEGORY_LABELS[c]}
            </button>
          ))}
        </div>
        <Select value={subjectFilter} onChange={(e) => setSubjectFilter(e.target.value)}>
          <option value="">Kein Fach (für Upload)</option>
          {state.subjects.map((s) => (
            <option key={s.id} value={s.id}>
              {s.name}
            </option>
          ))}
        </Select>
      </div>

      <UploadDropzone onFiles={handleFiles} />

      {docsForCategory.length === 0 ? (
        <EmptyState
          icon={<FolderOpen size={32} />}
          title="Keine Dokumente in dieser Kategorie"
          message="Lade eine Datei hoch, um zu beginnen."
        />
      ) : (
        <div className="document-grid">
          {docsForCategory.map((d) => (
            <DocumentCard key={d.id} document={d} onDownload={handleDownload} onDelete={setToDelete} />
          ))}
        </div>
      )}

      <ConfirmDialog
        open={!!toDelete}
        title="Dokument löschen"
        message={`Möchtest du „${toDelete?.name}“ wirklich löschen?`}
        onConfirm={handleDeleteConfirmed}
        onCancel={() => setToDelete(null)}
      />
    </div>
  );
}
