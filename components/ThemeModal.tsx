import { useEffect, useLayoutEffect } from "react";
import Modal from "./Modal";
import ThemeList from "./ThemeList";

type Props = {
  isOpen: boolean;
  onClose?: () => void;
};

export default function ThemeModal({ isOpen, onClose }: Props) {
  return (
    <Modal wide isOpen={isOpen} onClose={onClose}>
      <h1 className="font-bold text-2xl pb-8">Theme</h1>
      <div className="rounded-box grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
        <ThemeList />
      </div>
    </Modal>
  );
}
