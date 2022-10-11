import { useCallback } from "react";
import { useMutation } from "@tanstack/react-query";
import { signOut } from "next-auth/react";
import Modal from "./Modal";

type Props = {
  isOpen: boolean;
  onClose?: () => void;
  name: string;
  email: string;
};

export default function ProfileModal({ isOpen, onClose, name, email }: Props) {
  const deleteUser = useMutation<unknown, unknown, {}>((user) => {
    return fetch("/api/user", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(user),
    });
  });

  const handleDeleteUser = useCallback(() => {
    deleteUser.mutate(
      {},
      {
        onSuccess: () => {
          signOut({ callbackUrl: "/" });
        },
      }
    );
  }, [deleteUser]);

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <h1 className="font-bold text-2xl pb-8">Profile</h1>
      <div className="form-control w-full max-w-xs">
        <label className="label">
          <span className="label-text">Name</span>
        </label>
        <input
          type="text"
          className="input input-bordered w-full max-w-xs"
          value={name}
          disabled
        />
      </div>
      <div className="form-control w-full max-w-xs">
        <label className="label">
          <span className="label-text">Email</span>
        </label>
        <input
          type="text"
          className="input input-bordered w-full max-w-xs"
          value={email}
          disabled
        />
      </div>
      <br />
      <div className="flex flex-column justify-center items-center">
        <i className="text-sm">
          Deleting your account is permanent, and we will immediately delete
          your data without any option for recovery.
        </i>
        <button className="btn btn-error" onClick={handleDeleteUser}>
          DELETE
        </button>
      </div>
    </Modal>
  );
}
