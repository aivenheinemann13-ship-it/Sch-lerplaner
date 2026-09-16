export function FormField({ label, error, children, hint }) {
  return (
    <label className="form-field">
      {label && <span className="form-field__label">{label}</span>}
      {children}
      {hint && !error && <span className="form-field__hint">{hint}</span>}
      {error && <span className="form-field__error">{error}</span>}
    </label>
  );
}

export function Input(props) {
  return <input className="input" {...props} />;
}

export function Textarea(props) {
  return <textarea className="input input--textarea" {...props} />;
}

export function Select({ children, ...rest }) {
  return (
    <select className="input" {...rest}>
      {children}
    </select>
  );
}
