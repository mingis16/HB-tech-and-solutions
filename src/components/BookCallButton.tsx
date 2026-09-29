"use client";

import { CalendarClock } from "lucide-react";
import type { ServiceType } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { useUI } from "./UIProvider";

type BookCallButtonProps = {
  variant?: "primary" | "ghost";
  service?: ServiceType;
  className?: string;
  children?: React.ReactNode;
};

export function BookCallButton({ variant = "primary", service, className, children }: BookCallButtonProps) {
  const { openBooking } = useUI();
  return (
    <button
      type="button"
      onClick={() => openBooking(service)}
      className={cn(variant === "primary" ? "btn-primary" : "btn-ghost", className)}
    >
      <CalendarClock className="size-4" aria-hidden="true" />
      {children ?? "Book a 30-min call"}
    </button>
  );
}
