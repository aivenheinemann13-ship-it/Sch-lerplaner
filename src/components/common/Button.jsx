export function Button({
  children,
  variant = "primary",
  size = "md",
  icon: Icon,
  type = "button",
  className = "",
  ...rest
}) {
  return (
    <button
      type={type}
      className={`btn btn--${variant} btn--${size} ${className}`.trim()}
      {...rest}
    >
      {Icon && <Icon size={16} />}
      {children}
    </button>
  );
}
