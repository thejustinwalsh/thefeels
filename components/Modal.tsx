import { useCallback } from "react";
import Portal from "./util/Portal";

type Props = {
  children?: React.ReactNode;
  isOpen: boolean;
  onClose?: () => void;
};

export default function Modal({ children, isOpen, onClose }: Props) {
  const handleClose = useCallback(() => onClose?.(), [onClose]);

  if (!isOpen) return null;

  return (
    <Portal>
      <div className="modal modal-open">
        <div className="modal-box relative w-11/12 max-w-5xl shadow-2xl">
          <label
            className="btn btn-sm btn-circle absolute right-2 top-2"
            onClick={handleClose}
          >
            ✕
          </label>
          {children}
        </div>
      </div>
    </Portal>
  );
}
