import { Modal } from "./Modal.jsx";
import { Button } from "./Button.jsx";

export function ConfirmDialog({ open, title, message, onConfirm, onCancel, danger = true }) {
  return (
    <Modal open={open} onClose={onCancel} title={title} width={400}>
      <p className="confirm-dialog__message">{message}</p>
      <div className="modal__footer">
        <Button variant="ghost" onClick={onCancel}>
          Abbrechen
        </Button>
        <Button variant={danger ? "danger" : "primary"} onClick={onConfirm}>
          Bestätigen
        </Button>
      </div>
    </Modal>
  );
}
