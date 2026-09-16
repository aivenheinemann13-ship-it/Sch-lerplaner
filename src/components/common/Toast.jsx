import { CheckCircle2, Info, AlertTriangle, XCircle, X } from "lucide-react";
import { useToast } from "../../context/ToastContext.jsx";

const ICONS = {
  success: CheckCircle2,
  info: Info,
  warning: AlertTriangle,
  error: XCircle,
};

export function ToastContainer() {
  const { toasts, dismissToast } = useToast();
  if (!toasts.length) return null;

  return (
    <div className="toast-container">
      {toasts.map((toast) => {
        const Icon = ICONS[toast.type] || Info;
        return (
          <div key={toast.id} className={`toast toast--${toast.type} fp-toast`}>
            <Icon size={18} />
            <span className="toast__message">{toast.message}</span>
            <button className="icon-button icon-button--sm" onClick={() => dismissToast(toast.id)}>
              <X size={14} />
            </button>
          </div>
        );
      })}
    </div>
  );
}
