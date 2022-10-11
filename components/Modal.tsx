import { useCallback } from "react";
import Portal from "./util/Portal";

type Props = {
  children?: React.ReactNode;
  wide?: boolean;
  isOpen: boolean;
  onClose?: () => void;
};

export default function Modal({ children, wide, isOpen, onClose }: Props) {
  const handleClose = useCallback(() => onClose?.(), [onClose]);

  if (!isOpen) return null;

  return (
    <Portal>
      <div className="modal modal-open">
        <div
          className={`modal-box relative shadow-2xl ${
            wide ? "w-11/12 max-w-5xl" : ""
          }`}
        >
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
