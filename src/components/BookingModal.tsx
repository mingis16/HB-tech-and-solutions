"use client";

import { useEffect, useMemo, useRef, useState, useTransition } from "react";
import Link from "next/link";
import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  CalendarCheck,
  CalendarClock,
  CalendarPlus,
  Globe,
  Loader2,
  X,
} from "lucide-react";
import { createBooking, getBookedSlots } from "@/app/actions";
import { track } from "@/lib/analytics";
import {
  BOOKING,
  TIME_SLOTS,
  formatDateParts,
  formatSlot,
  getBookableDates,
  googleCalendarUrl,
  slotEnd,
  timeZoneLabel,
  zonedTimeToDate,
} from "@/lib/booking";
import { SERVICE_TYPES, SITE, type ServiceType } from "@/lib/constants";
import { bookingSchema, validate, type BookingFormValues, type FieldErrors } from "@/lib/validation";
import { cn } from "@/lib/utils";
import { Dialog } from "./ui/Dialog";
import { Field, SelectShell, describedBy, fieldClass } from "./ui/Field";
import { TextField } from "./ui/TextField";
import { TURNSTILE_ENABLED, Turnstile } from "./Turnstile";

type Step = "slot" | "details" | "done";
type DetailKey = "name" | "email" | "phone" | "company" | "serviceType" | "notes";
const DETAIL_KEYS: DetailKey[] = ["name", "email", "phone", "company", "serviceType", "notes"];

const STEPS: { id: Step; label: string }[] = [
  { id: "slot", label: "Pick a slot" },
  { id: "details", label: "Your details" },
  { id: "done", label: "Confirmed" },
];

type BookingModalProps = {
  open: boolean;
  initialService?: ServiceType;
  onClose: () => void;
};

export function BookingModal({ open, initialService, onClose }: BookingModalProps) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      labelledBy="booking-title"
      className={cn(
        // Mobile: bottom sheet. sm+: centred modal.
        "fixed inset-x-0 bottom-0 top-auto m-0 w-full max-w-none max-h-[92dvh] open:animate-sheet-up",
        "sm:inset-0 sm:m-auto sm:h-fit sm:max-h-[88vh] sm:max-w-2xl sm:open:animate-pop-in",
      )}
    >
      <BookingFlow initialService={initialService} onClose={onClose} />
    </Dialog>
  );
}

function BookingFlow({ initialService, onClose }: { initialService?: ServiceType; onClose: () => void }) {
  const timeZone = SITE.timeZone;
  const [dates] = useState(() => getBookableDates(timeZone));
  const [date, setDate] = useState(dates[0]);
  const [slot, setSlot] = useState("");
  const [bookedByDate, setBookedByDate] = useState<Record<string, string[]>>({});
  const [step, setStep] = useState<Step>("slot");
  const [details, setDetails] = useState<Record<DetailKey, string>>({
    name: "",
    email: "",
    phone: "",
    company: "",
    serviceType: initialService ?? "",
    notes: "",
  });
  const [website, setWebsite] = useState(""); // honeypot
  const [touched, setTouched] = useState<Partial<Record<DetailKey, boolean>>>({});
  const [submitted, setSubmitted] = useState(false);
  const [serverFieldErrors, setServerFieldErrors] = useState<Partial<Record<string, string>>>({});
  const [serverError, setServerError] = useState<string | null>(null);
  const [result, setResult] = useState<{ reference: string; demo?: boolean } | null>(null);
  const [isPending, startTransition] = useTransition();
  const [turnstileToken, setTurnstileToken] = useState("");
  const [turnstileKey, setTurnstileKey] = useState(0);
  // When the booking flow opened; instant submissions are treated as bots.
  const startedAt = useRef(0);
  const errorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    startedAt.current = Date.now();
  }, []);

  // The error banner sits at the top of the scrolling body while the visitor
  // is down by the buttons, so bring it into view whenever it changes.
  useEffect(() => {
    if (serverError) errorRef.current?.scrollIntoView({ block: "nearest", behavior: "smooth" });
  }, [serverError]);

  const booked = bookedByDate[date];
  const loadingSlots = booked === undefined;
  const tzLabel = useMemo(() => timeZoneLabel(timeZone), [timeZone]);

  // Load availability for the selected date (cached per date).
  useEffect(() => {
    if (bookedByDate[date]) return;
    let cancelled = false;
    getBookedSlots(date)
      .catch(() => [] as string[])
      .then((slots) => {
        if (!cancelled) setBookedByDate((prev) => ({ ...prev, [date]: slots }));
      });
    return () => {
      cancelled = true;
    };
  }, [date, bookedByDate]);

  const values: BookingFormValues = { ...details, date, slot };
  const errors: FieldErrors<BookingFormValues> = { ...validate(bookingSchema, values), ...serverFieldErrors };
  const errorFor = (key: DetailKey) => (touched[key] || submitted ? errors[key] : undefined);

  const dateParts = formatDateParts(date);
  const visitorTime = useMemo(() => {
    if (!slot) return null;
    const visitorZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const start = zonedTimeToDate(date, slot, timeZone);
    const fmt = (tz: string) =>
      new Intl.DateTimeFormat("en-US", { timeZone: tz, weekday: "short", hour: "numeric", minute: "2-digit" }).format(
        start,
      );
    return fmt(visitorZone) === fmt(timeZone) ? null : `${fmt(visitorZone)} your time`;
  }, [date, slot, timeZone]);

  function update(key: DetailKey, value: string) {
    setDetails((prev) => ({ ...prev, [key]: value }));
    if (serverFieldErrors[key]) {
      setServerFieldErrors((prev) => {
        const next = { ...prev };
        delete next[key];
        return next;
      });
    }
  }

  function pickDate(next: string) {
    setDate(next);
    setSlot("");
  }

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setSubmitted(true);
    const firstInvalid = DETAIL_KEYS.find((key) => errors[key]);
    if (firstInvalid) {
      document.getElementById(`booking-${firstInvalid}`)?.focus();
      return;
    }

    if (TURNSTILE_ENABLED && !turnstileToken) {
      setServerError("Please complete the security check below.");
      return;
    }

    setServerError(null);
    startTransition(async () => {
      const res = await createBooking(
        { ...values, website },
        { elapsedMs: Date.now() - startedAt.current, turnstileToken },
      );
      // Tokens are single-use.
      setTurnstileToken("");
      setTurnstileKey((k) => k + 1);
      if (res.ok) {
        track("book_call", { service: details.serviceType || "general" });
        setResult({ reference: res.data.reference, demo: res.demo });
        setStep("done");
        return;
      }
      if (res.code === "slot_taken" || res.fieldErrors?.date || res.fieldErrors?.slot) {
        if (res.code === "slot_taken") {
          setBookedByDate((prev) => ({ ...prev, [date]: [...(prev[date] ?? []), slot] }));
        }
        setSlot("");
        setStep("slot");
      } else if (res.fieldErrors) {
        setServerFieldErrors(res.fieldErrors);
      }
      setServerError(res.error);
    });
  }

  const stepIndex = STEPS.findIndex((s) => s.id === step);

  return (
    <div className="flex max-h-[92dvh] flex-col overflow-hidden rounded-t-2xl border border-edge bg-surface shadow-panel sm:max-h-[88vh] sm:rounded-2xl">
      {/* Grab handle (mobile) */}
      <div className="mx-auto mt-2.5 h-1 w-10 shrink-0 rounded-full bg-edge-strong sm:hidden" aria-hidden="true" />

      {/* Header */}
      <div className="flex shrink-0 items-start justify-between gap-4 border-b border-edge px-5 pb-4 pt-3 sm:px-6 sm:pt-5">
        <div>
          <p className="font-mono text-xs text-cyber">&gt;_ schedule --duration={BOOKING.durationMinutes}m</p>
          <h2 id="booking-title" className="mt-1 text-lg font-semibold text-fg sm:text-xl">
            Book a discovery call
          </h2>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="grid size-10 place-items-center rounded-lg text-fg-muted transition hover:bg-surface-hover hover:text-fg"
          aria-label="Close booking"
        >
          <X className="size-5" />
        </button>
      </div>

      {/* Progress */}
      <ol className="flex shrink-0 items-center gap-2 border-b border-edge px-5 py-3 font-mono text-[11px] uppercase tracking-wider sm:px-6">
        {STEPS.map((s, i) => (
          <li key={s.id} className="flex items-center gap-2">
            <span
              className={cn(
                "grid size-5 place-items-center rounded-full border text-[10px]",
                i < stepIndex && "border-cyber bg-cyber text-ink-deep",
                i === stepIndex && "border-cyber text-cyber",
                i > stepIndex && "border-edge-strong text-fg-subtle",
              )}
            >
              {i + 1}
            </span>
            <span className={cn(i === stepIndex ? "text-fg" : "text-fg-subtle", i !== stepIndex && "hidden sm:inline")}>
              {s.label}
            </span>
            {i < STEPS.length - 1 && <span className="h-px w-4 bg-edge-strong sm:w-8" aria-hidden="true" />}
          </li>
        ))}
      </ol>

      {/* Body */}
      <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-5 py-5 sm:px-6">
        {serverError && step !== "done" && (
          <div
            ref={errorRef}
            role="alert"
            className="mb-4 flex items-start gap-2 rounded-lg border border-severity-critical/40 bg-severity-critical/10 px-3.5 py-3 text-sm text-fg"
          >
            <AlertTriangle className="mt-0.5 size-4 shrink-0 text-severity-critical" aria-hidden="true" />
            {serverError}
          </div>
        )}

        {step === "slot" && (
          <div className="space-y-6">
            <section aria-labelledby="booking-date-label">
              <h3 id="booking-date-label" className="mb-3 text-sm font-medium text-fg">
                Choose a date
              </h3>
              <div className="-mx-5 flex snap-x scroll-px-5 gap-2 overflow-x-auto px-5 pb-2 sm:mx-0 sm:grid sm:grid-cols-5 sm:overflow-visible sm:px-0 sm:pb-0">
                {dates.map((d) => {
                  const parts = formatDateParts(d);
                  const selected = d === date;
                  return (
                    <button
                      key={d}
                      type="button"
                      onClick={() => pickDate(d)}
                      aria-pressed={selected}
                      aria-label={parts.long}
                      className={cn(
                        "w-[4.75rem] shrink-0 snap-start rounded-xl border px-2 py-2.5 text-center transition sm:w-auto",
                        selected
                          ? "border-cyber bg-cyber/10 text-fg shadow-glow-sm"
                          : "border-edge bg-ink/50 text-fg-muted hover:border-edge-strong hover:text-fg",
                      )}
                    >
                      <span className="block font-mono text-[11px] uppercase tracking-wider">{parts.weekday}</span>
                      <span className={cn("block text-xl font-semibold", selected && "text-cyber")}>{parts.day}</span>
                      <span className="block text-[11px]">{parts.month}</span>
                    </button>
                  );
                })}
              </div>
            </section>

            <section aria-labelledby="booking-slot-label">
              <div className="mb-3 flex flex-wrap items-baseline justify-between gap-2">
                <h3 id="booking-slot-label" className="text-sm font-medium text-fg">
                  Choose a time <span className="font-normal text-fg-muted">· {dateParts.long}</span>
                </h3>
                <span className="inline-flex items-center gap-1 font-mono text-[11px] text-fg-subtle">
                  <Globe className="size-3" aria-hidden="true" /> {tzLabel}
                </span>
              </div>

              <div className="grid grid-cols-3 gap-2 sm:grid-cols-4" aria-busy={loadingSlots}>
                {loadingSlots
                  ? TIME_SLOTS.map((s) => (
                      <div key={s} className="h-11 animate-pulse rounded-lg border border-edge bg-surface-raised" />
                    ))
                  : TIME_SLOTS.map((s) => {
                      const taken = booked.includes(s);
                      const selected = s === slot;
                      return (
                        <button
                          key={s}
                          type="button"
                          disabled={taken}
                          onClick={() => {
                            setSlot(s);
                            setServerError(null);
                          }}
                          aria-pressed={selected}
                          aria-label={`${formatSlot(s)}${taken ? " (unavailable)" : ""}`}
                          className={cn(
                            "min-h-11 rounded-lg border px-2 font-mono text-sm transition",
                            taken && "cursor-not-allowed border-edge/60 text-fg-subtle/60 line-through",
                            !taken && !selected && "border-edge bg-ink/50 text-fg hover:border-cyber/60",
                            selected && "border-cyber bg-cyber text-ink-deep font-semibold",
                          )}
                        >
                          {formatSlot(s)}
                        </button>
                      );
                    })}
              </div>
              {!loadingSlots && booked.length >= TIME_SLOTS.length && (
                <p className="mt-3 text-sm text-fg-muted">This day is fully booked. Try another date.</p>
              )}
              {visitorTime && (
                <p className="mt-3 text-xs text-fg-muted">
                  {formatSlot(slot)} {tzLabel} is <span className="text-fg">{visitorTime}</span>.
                </p>
              )}
            </section>
          </div>
        )}

        {step === "details" && (
          <form id="booking-form" noValidate onSubmit={handleSubmit} className="space-y-5">
            <div className="flex items-center justify-between gap-3 rounded-xl border border-cyber/30 bg-cyber/5 px-4 py-3">
              <div className="flex items-center gap-3">
                <CalendarClock className="size-5 shrink-0 text-cyber" aria-hidden="true" />
                <div className="text-sm">
                  <p className="font-medium text-fg">{dateParts.long}</p>
                  <p className="font-mono text-xs text-fg-muted">
                    {formatSlot(slot)} to {formatSlot(slotEnd(slot))} {tzLabel}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setStep("slot")}
                className="shrink-0 text-xs font-medium text-cyber hover:underline"
              >
                Change
              </button>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <TextField
                id="booking-name"
                label="Full name"
                required
                autoComplete="name"
                value={details.name}
                error={errorFor("name")}
                valid={touched.name && !errors.name}
                onChange={(v) => update("name", v)}
                onBlur={() => setTouched((t) => ({ ...t, name: true }))}
              />
              <TextField
                id="booking-email"
                label="Email"
                type="email"
                required
                autoComplete="email"
                inputMode="email"
                value={details.email}
                error={errorFor("email")}
                valid={touched.email && !errors.email}
                onChange={(v) => update("email", v)}
                onBlur={() => setTouched((t) => ({ ...t, email: true }))}
              />
              <TextField
                id="booking-phone"
                label="Phone / WhatsApp"
                type="tel"
                autoComplete="tel"
                inputMode="tel"
                value={details.phone}
                error={errorFor("phone")}
                valid={touched.phone && !!details.phone && !errors.phone}
                onChange={(v) => update("phone", v)}
                onBlur={() => setTouched((t) => ({ ...t, phone: true }))}
              />
              <TextField
                id="booking-company"
                label="Company"
                autoComplete="organization"
                value={details.company}
                error={errorFor("company")}
                onChange={(v) => update("company", v)}
                onBlur={() => setTouched((t) => ({ ...t, company: true }))}
              />
              <Field id="booking-serviceType" label="Topic" className="sm:col-span-2">
                <SelectShell>
                  <select
                    id="booking-serviceType"
                    value={details.serviceType}
                    onChange={(e) => update("serviceType", e.target.value)}
                    className={fieldClass({}, "appearance-none pr-10")}
                  >
                    <option value="">General discovery / not sure yet</option>
                    {SERVICE_TYPES.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </SelectShell>
              </Field>
              <Field
                id="booking-notes"
                label="What should we cover?"
                error={errorFor("notes")}
                hint={`${details.notes.length}/1000`}
                className="sm:col-span-2"
              >
                <textarea
                  id="booking-notes"
                  rows={3}
                  value={details.notes}
                  onChange={(e) => update("notes", e.target.value)}
                  onBlur={() => setTouched((t) => ({ ...t, notes: true }))}
                  placeholder="Goals, deadlines, current setup…"
                  className={fieldClass({ error: errorFor("notes") }, "resize-y")}
                  {...describedBy("booking-notes", errorFor("notes"), true)}
                />
              </Field>
            </div>

            {TURNSTILE_ENABLED && (
              <Turnstile key={turnstileKey} action="booking" onToken={setTurnstileToken} />
            )}

            <p className="text-xs leading-relaxed text-fg-subtle">
              By booking you agree to our{" "}
              <Link href="/terms" target="_blank" className="text-fg-muted underline underline-offset-2 hover:text-cyber">
                Terms
              </Link>{" "}
              and{" "}
              <Link href="/privacy" target="_blank" className="text-fg-muted underline underline-offset-2 hover:text-cyber">
                Privacy Policy
              </Link>
              .
            </p>

            {/* Honeypot: hidden from people, irresistible to bots. */}
            <div className="absolute -left-[9999px] h-px w-px overflow-hidden" aria-hidden="true">
              <label htmlFor="booking-website">Website</label>
              <input
                id="booking-website"
                tabIndex={-1}
                autoComplete="off"
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
              />
            </div>
          </form>
        )}

        {step === "done" && result && (
          <div className="py-4 text-center">
            <div className="mx-auto grid size-14 place-items-center rounded-full bg-cyber/15 text-cyber ring-1 ring-cyber/40">
              <CalendarCheck className="size-7" aria-hidden="true" />
            </div>
            <h3 className="mt-4 text-xl font-semibold text-fg">You&apos;re booked in</h3>
            <p className="mx-auto mt-2 max-w-md text-sm text-fg-muted">
              {BOOKING.durationMinutes}-minute discovery call on{" "}
              <span className="text-fg">{dateParts.long}</span> at{" "}
              <span className="text-fg">
                {formatSlot(slot)} {tzLabel}
              </span>
              . We&apos;ll email <span className="text-fg">{details.email}</span> to confirm and share the meeting link.
            </p>

            <div className="mx-auto mt-5 max-w-md rounded-lg border border-edge bg-ink/70 px-4 py-3 text-left font-mono text-xs leading-relaxed">
              <p className="text-fg-muted">
                <span className="text-cyber">$</span> booking status --ref {result.reference}
              </p>
              <p className="text-fg">
                <span className="text-cyber">✓</span> slot reserved · status: pending confirmation
              </p>
            </div>

            {result.demo && (
              <p className="mx-auto mt-3 max-w-md text-xs text-severity-medium">
                Demo mode: Supabase isn&apos;t configured, so this booking was not saved.
              </p>
            )}

            <a
              href={googleCalendarUrl({
                date,
                slot,
                timeZone,
                title: "Discovery call with HB Tech Solutions",
                details: `Reference: ${result.reference}`,
              })}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-ghost mt-5"
            >
              <CalendarPlus className="size-4" aria-hidden="true" />
              Add to Google Calendar
            </a>
          </div>
        )}
      </div>

      {/* Footer actions */}
      <div className="flex shrink-0 items-center justify-between gap-3 border-t border-edge bg-surface px-5 py-4 pb-[max(1rem,env(safe-area-inset-bottom))] sm:px-6">
        {step === "slot" && (
          <>
            <button type="button" onClick={onClose} className="btn-ghost">
              Cancel
            </button>
            <button type="button" disabled={!slot} onClick={() => setStep("details")} className="btn-primary">
              Continue
              <ArrowRight className="size-4" aria-hidden="true" />
            </button>
          </>
        )}
        {step === "details" && (
          <>
            <button type="button" onClick={() => setStep("slot")} className="btn-ghost" disabled={isPending}>
              <ArrowLeft className="size-4" aria-hidden="true" />
              Back
            </button>
            <button type="submit" form="booking-form" className="btn-primary" disabled={isPending}>
              {isPending ? (
                <>
                  <Loader2 className="size-4 animate-spin" aria-hidden="true" />
                  Booking…
                </>
              ) : (
                "Confirm booking"
              )}
            </button>
          </>
        )}
        {step === "done" && (
          <button type="button" onClick={onClose} className="btn-primary w-full sm:ml-auto sm:w-auto">
            Done
          </button>
        )}
      </div>
    </div>
  );
}
