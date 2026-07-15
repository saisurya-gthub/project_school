import { AlertTriangle, CheckCircle2, XCircle, Info } from "lucide-react";
import Modal from "@/components/Modal";
import Button from "@/components/Button";

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: "danger" | "warning" | "success" | "info";
  isLoading?: boolean;
}

export default function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  variant = "danger",
  isLoading = false,
}: ConfirmModalProps) {
  const icons = {
    danger: <XCircle className="h-6 w-6 text-red-500" />,
    warning: <AlertTriangle className="h-6 w-6 text-yellow-500" />,
    success: <CheckCircle2 className="h-6 w-6 text-green-500" />,
    info: <Info className="h-6 w-6 text-blue-500" />,
  };

  const buttonVariants = {
    danger: "danger" as const,
    warning: "primary" as const,
    success: "primary" as const,
    info: "primary" as const,
  };

  const bgColors = {
    danger: "bg-red-50",
    warning: "bg-yellow-50",
    success: "bg-green-50",
    info: "bg-blue-50",
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="sm">
      <div className="text-center">
        <div className={`mx-auto w-14 h-14 rounded-full ${bgColors[variant]} flex items-center justify-center mb-4`}>
          {icons[variant]}
        </div>
        <h3 className="text-lg font-semibold text-surface-900 mb-2">{title}</h3>
        <p className="text-sm text-surface-500 mb-6">{message}</p>
        <div className="flex items-center justify-center gap-3">
          <Button variant="outline" onClick={onClose} disabled={isLoading}>
            {cancelText}
          </Button>
          <Button variant={buttonVariants[variant]} onClick={onConfirm} isLoading={isLoading}>
            {confirmText}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
