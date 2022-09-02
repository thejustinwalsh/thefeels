import { useState } from "react";
import { createPortal } from "react-dom";

type Props = {
  children?: React.ReactNode;
  selector?: string;
};

export default function Portal({ selector, children }: Props) {
  const [el] = useState<Element | null>(() =>
    document.querySelector(selector || "#__portal")
  );
  return el ? createPortal(children, el) : null;
}
