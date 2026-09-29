"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

type DialogProps = {
  open: boolean;
  onClose: () => void;
  labelledBy: string;
  className?: string;
  children: React.ReactNode;
};

/**
 * Thin wrapper around the native <dialog> element: focus trapping, Escape to
 * close and the top-layer backdrop come from the browser for free.
 */
export function Dialog({ open, onClose, labelledBy, className, children }: DialogProps) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  // Lock page scroll behind the dialog (iOS ignores overflow on body alone).
  useEffect(() => {
    if (!open) return;
    const root = document.documentElement;
    const previous = root.style.overflow;
    root.style.overflow = "hidden";
    return () => {
      root.style.overflow = previous;
    };
  }, [open]);

  return (
    <dialog
      ref={ref}
      aria-labelledby={labelledBy}
      onClose={onClose}
      onClick={(event) => {
        // Only the backdrop area reports the <dialog> itself as the target.
        if (event.target === ref.current) onClose();
      }}
      className={cn(
        // Callers set position, margin and max sizes (no tailwind-merge here).
        "border-0 bg-transparent p-0 text-fg",
        "backdrop:bg-ink-deep/80 backdrop:backdrop-blur-sm",
        className,
      )}
    >
      {open ? children : null}
    </dialog>
  );
}
