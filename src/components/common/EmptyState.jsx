export function EmptyState({ icon, title, message, action }) {
  return (
    <div className="empty-state fp-fade">
      {icon && <div className="empty-state__icon">{icon}</div>}
      <h3 className="empty-state__title">{title}</h3>
      {message && <p className="empty-state__message">{message}</p>}
      {action}
    </div>
  );
}
