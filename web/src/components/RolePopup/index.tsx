"use client";

import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/src/components/UI/Button";

interface RolePopupProps {
  walletAddress: string;
  adminAddress: string;
  isOpen: boolean;
  onClose: () => void;
}

export const RolePopup: React.FC<RolePopupProps> = ({
  walletAddress,
  adminAddress,
  isOpen,
  onClose,
}) => {
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    // reset error each time opened
    setError(null);

    // lock background scroll
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);

    // focus first interactive element
    requestAnimationFrame(() => {
      const first = dialogRef.current?.querySelector<HTMLElement>(
        "button, [href], input, select, textarea, [tabindex]:not([tabindex='-1'])"
      );
      first?.focus();
    });

    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const isAdmin =
    (walletAddress ?? "").toLowerCase() === (adminAddress ?? "").toLowerCase();

  const goAdmin = () => {
    if (!isAdmin) {
      setError("This wallet is not authorized as admin.");
      return;
    }
    router.push("/admin");
  };

  const goUser = () => {
    router.push("/user");
  };

  const onBackdropMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    // only close if user clicked the backdrop, not the modal content
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 grid place-items-center p-4"
      onMouseDown={onBackdropMouseDown}
    >
      {/* Backdrop: 50% opacity + blur */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        aria-hidden="true"
      />

      {/* Modal */}
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="role-popup-title"
        className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl ring-1 ring-black/10"
      >
        {/* Close button */}
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute right-3 top-3 rounded-full p-2 text-zinc-500 hover:bg-zinc-100 hover:text-zinc-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          ✕
        </button>

        <h2
          id="role-popup-title"
          className="text-xl font-semibold text-zinc-900"
        >
          Choose your role
        </h2>
        <p className="mt-1 text-sm text-zinc-500">
          Admin access requires the authorized wallet.
        </p>

        {error && (
          <div className="mt-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
            {error}
          </div>
        )}

        <div className="mt-6 grid gap-3">
          <Button
            type="button"
            size="lg"
            onClick={goAdmin}
            className="w-full bg-blue-600 text-black hover:bg-blue-700"
          >
            Continue as Admin
          </Button>

          <Button
            type="button"
            size="lg"
            onClick={goUser}
            className="w-full bg-zinc-100 text-zinc-900 hover:bg-zinc-200"
          >
            Continue as User
          </Button>

          <button
            type="button"
            onClick={onClose}
            className="mt-1 text-sm text-zinc-500 hover:text-zinc-700"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};
