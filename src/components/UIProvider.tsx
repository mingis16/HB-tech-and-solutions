"use client";

import { createContext, useCallback, useContext, useMemo, useRef, useState } from "react";
import type { ServiceType } from "@/lib/constants";
import { BookingModal } from "./BookingModal";

type ServiceListener = (service: ServiceType) => void;

type UIContextValue = {
  openBooking: (service?: ServiceType) => void;
  /** Pre-fills the inquiry form with a service and scrolls to it. */
  requestService: (service: ServiceType) => void;
  /** Lets the inquiry form subscribe to requestService calls. */
  onServiceRequested: (listener: ServiceListener) => () => void;
};

const UIContext = createContext<UIContextValue | null>(null);

export function useUI() {
  const ctx = useContext(UIContext);
  if (!ctx) throw new Error("useUI must be used inside <UIProvider>");
  return ctx;
}

export function UIProvider({ children }: { children: React.ReactNode }) {
  const [booking, setBooking] = useState<{ open: boolean; service?: ServiceType; session: number }>({
    open: false,
    session: 0,
  });
  const listeners = useRef(new Set<ServiceListener>());

  const openBooking = useCallback((service?: ServiceType) => {
    setBooking((prev) => ({ open: true, service, session: prev.session + 1 }));
  }, []);

  const closeBooking = useCallback(() => {
    setBooking((prev) => (prev.open ? { ...prev, open: false } : prev));
  }, []);

  const requestService = useCallback((service: ServiceType) => {
    listeners.current.forEach((listener) => listener(service));
    document.getElementById("inquiry")?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  const onServiceRequested = useCallback((listener: ServiceListener) => {
    listeners.current.add(listener);
    return () => {
      listeners.current.delete(listener);
    };
  }, []);

  const value = useMemo(
    () => ({ openBooking, requestService, onServiceRequested }),
    [openBooking, requestService, onServiceRequested],
  );

  return (
    <UIContext.Provider value={value}>
      {children}
      <BookingModal
        key={booking.session}
        open={booking.open}
        initialService={booking.service}
        onClose={closeBooking}
      />
    </UIContext.Provider>
  );
}
