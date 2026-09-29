"use client";

import { CalendarClock } from "lucide-react";
import type { ServiceType } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { useUI } from "./UIProvider";

type BookCallButtonProps = {
  /** Booking is the secondary path, so it never uses the primary button style. */
  variant?: "ghost" | "link";
  service?: ServiceType;
  className?: string;
  children?: React.ReactNode;
};

export function BookCallButton({ variant = "ghost", service, className, children }: BookCallButtonProps) {
  const { openBooking } = useUI();
  return (
    <button
      type="button"
      onClick={() => openBooking(service)}
      className={cn(
        variant === "ghost"
          ? "btn-ghost"
          : "inline-flex min-h-11 items-center gap-2 text-sm font-medium text-fg-muted underline-offset-4 transition hover:text-cyber hover:underline",
        className,
      )}
    >
      <CalendarClock className="size-4" aria-hidden="true" />
      {children ?? "Book a 30-min call"}
    </button>
  );
}
