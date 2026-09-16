import { Download, Trash2, FileText } from "lucide-react";
import { Card } from "../../components/common/Card.jsx";
import { subjectName } from "../../data/selectors.js";
import { useAppData } from "../../context/AppDataContext.jsx";
import { formatGermanDate } from "../../utils/date.js";

function formatSize(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function DocumentCard({ document, onDownload, onDelete }) {
  const { state } = useAppData();

  return (
    <Card className="document-card">
      <FileText size={22} className="document-card__icon" />
      <div className="document-card__body">
        <strong>{document.name}</strong>
        <span className="muted">
          {formatSize(document.sizeBytes)} · {formatGermanDate(document.createdAt.slice(0, 10), { short: true })}
        </span>
        {document.subjectId && <span className="muted">{subjectName(state, document.subjectId)}</span>}
      </div>
      <div className="document-card__actions">
        <button className="icon-button icon-button--sm" onClick={() => onDownload(document)}>
          <Download size={15} />
        </button>
        <button className="icon-button icon-button--sm" onClick={() => onDelete(document)}>
          <Trash2 size={15} />
        </button>
      </div>
    </Card>
  );
}
