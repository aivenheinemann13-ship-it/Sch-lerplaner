const PRIORITY_META = {
  hoch: { label: "Hoch", dot: "🔴", tone: "danger" },
  mittel: { label: "Mittel", dot: "🟡", tone: "warning" },
  niedrig: { label: "Niedrig", dot: "🟢", tone: "success" },
};

const STATUS_META = {
  offen: { label: "Offen", tone: "muted" },
  in_bearbeitung: { label: "In Bearbeitung", tone: "info" },
  erledigt: { label: "Erledigt", tone: "success" },
  geplant: { label: "Geplant", tone: "info" },
  geschrieben: { label: "Geschrieben", tone: "warning" },
  bewertet: { label: "Bewertet", tone: "success" },
};

export function Badge({ children, tone = "muted", className = "" }) {
  return <span className={`badge badge--${tone} ${className}`.trim()}>{children}</span>;
}

export function PriorityBadge({ priority }) {
  const meta = PRIORITY_META[priority] || PRIORITY_META.mittel;
  return (
    <Badge tone={meta.tone}>
      {meta.dot} {meta.label}
    </Badge>
  );
}

export function StatusBadge({ status }) {
  const meta = STATUS_META[status] || { label: status, tone: "muted" };
  return <Badge tone={meta.tone}>{meta.label}</Badge>;
}
