"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import {
  AlertTriangle,
  CalendarClock,
  CheckCircle2,
  Loader2,
  Lock,
  MessageCircle,
  RotateCcw,
  Send,
} from "lucide-react";
import { submitInquiry } from "@/app/actions";
import { INDUSTRIES, PRIORITIES, SERVICE_TYPES, whatsappLink, type Priority } from "@/lib/constants";
import { inquirySchema, validate, type FieldErrors, type InquiryFormValues } from "@/lib/validation";
import { cn } from "@/lib/utils";
import { useUI } from "./UIProvider";
import { Field, SelectShell, describedBy, fieldClass } from "./ui/Field";
import { TextField } from "./ui/TextField";
import { TerminalDots } from "./ui/TerminalDots";

type Key = keyof InquiryFormValues;

const EMPTY: InquiryFormValues = {
  name: "",
  email: "",
  company: "",
  phone: "",
  serviceType: "",
  industry: "",
  priority: "medium",
  title: "",
  description: "",
};

const FIELD_ORDER: Key[] = [
  "name",
  "email",
  "company",
  "phone",
  "serviceType",
  "industry",
  "priority",
  "title",
  "description",
];

// Static class names so Tailwind can see them at build time.
const PRIORITY_STYLES: Record<Priority, { dot: string; active: string; text: string }> = {
  low: {
    dot: "bg-severity-low",
    active: "border-severity-low/70 bg-severity-low/10",
    text: "text-severity-low",
  },
  medium: {
    dot: "bg-severity-medium",
    active: "border-severity-medium/70 bg-severity-medium/10",
    text: "text-severity-medium",
  },
  high: {
    dot: "bg-severity-high",
    active: "border-severity-high/70 bg-severity-high/10",
    text: "text-severity-high",
  },
  critical: {
    dot: "bg-severity-critical",
    active: "border-severity-critical/70 bg-severity-critical/10",
    text: "text-severity-critical",
  },
};

type SubmitResult = { reference: string; demo?: boolean; email: string; priority: Priority; service: string };

export function InquiryForm() {
  const { onServiceRequested, openBooking } = useUI();
  const [values, setValues] = useState<InquiryFormValues>(EMPTY);
  const [website, setWebsite] = useState(""); // honeypot
  const [touched, setTouched] = useState<Partial<Record<Key, boolean>>>({});
  const [submitted, setSubmitted] = useState(false);
  const [serverFieldErrors, setServerFieldErrors] = useState<Partial<Record<string, string>>>({});
  const [serverError, setServerError] = useState<string | null>(null);
  const [result, setResult] = useState<SubmitResult | null>(null);
  const [highlightService, setHighlightService] = useState(false);
  const [isPending, startTransition] = useTransition();
  const successHeading = useRef<HTMLHeadingElement>(null);

  // Service cards elsewhere on the page can pre-fill the service type.
  useEffect(
    () =>
      onServiceRequested((service) => {
        setResult(null);
        setValues((prev) => ({ ...prev, serviceType: service }));
        setTouched((prev) => ({ ...prev, serviceType: true }));
        setHighlightService(true);
        window.setTimeout(() => setHighlightService(false), 1800);
      }),
    [onServiceRequested],
  );

  useEffect(() => {
    if (result) successHeading.current?.focus();
  }, [result]);

  const errors: FieldErrors<InquiryFormValues> = { ...validate(inquirySchema, values), ...serverFieldErrors };
  const errorFor = (key: Key) => (touched[key] || submitted ? errors[key] : undefined);
  const isValid = (key: Key) => Boolean(touched[key] && values[key] && !errors[key]);
  const blur = (key: Key) => () => setTouched((prev) => ({ ...prev, [key]: true }));

  function update(key: Key, value: string) {
    setValues((prev) => ({ ...prev, [key]: value }));
    if (serverFieldErrors[key]) {
      setServerFieldErrors((prev) => {
        const next = { ...prev };
        delete next[key];
        return next;
      });
    }
  }

  function reset() {
    setValues(EMPTY);
    setTouched({});
    setSubmitted(false);
    setServerFieldErrors({});
    setServerError(null);
    setResult(null);
  }

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setSubmitted(true);
    const firstInvalid = FIELD_ORDER.find((key) => errors[key]);
    if (firstInvalid) {
      document.getElementById(`inquiry-${firstInvalid}`)?.focus();
      return;
    }

    setServerError(null);
    startTransition(async () => {
      const res = await submitInquiry({ ...values, website });
      if (res.ok) {
        setResult({
          reference: res.data.reference,
          demo: res.demo,
          email: values.email.trim(),
          priority: values.priority as Priority,
          service: values.serviceType,
        });
        return;
      }
      if (res.fieldErrors) setServerFieldErrors(res.fieldErrors);
      setServerError(res.error);
    });
  }

  const priority = (values.priority || "medium") as Priority;
  const descriptionLength = values.description.trim().length;

  return (
    <div className="panel overflow-hidden">
      {/* Terminal title bar */}
      <div className="flex items-center justify-between gap-3 border-b border-edge bg-ink/60 px-4 py-3">
        <div className="flex min-w-0 items-center gap-3">
          <TerminalDots />
          <span className="truncate font-mono text-xs text-fg-muted">~/hb-tech/new-request.sh</span>
        </div>
        <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-cyber/30 bg-cyber/10 px-2.5 py-1 font-mono text-[10px] uppercase tracking-wider text-cyber">
          <span className="relative flex size-1.5">
            <span className="absolute inline-flex size-full animate-ping rounded-full bg-cyber opacity-75" />
            <span className="relative inline-flex size-1.5 rounded-full bg-cyber" />
          </span>
          Queue open
        </span>
      </div>

      <div className="p-5 sm:p-8">
        {result ? (
          <div className="py-6 text-center sm:py-10">
            <div className="mx-auto grid size-16 place-items-center rounded-full bg-cyber/15 ring-1 ring-cyber/40">
              <CheckCircle2 className="size-8 text-cyber" aria-hidden="true" />
            </div>
            <h3 ref={successHeading} tabIndex={-1} className="mt-5 text-2xl font-semibold text-fg outline-none">
              Request received
            </h3>
            <p className="mx-auto mt-2 max-w-md text-sm text-fg-muted">
              Thanks, your request is in the queue. We&apos;ll reply to{" "}
              <span className="text-fg">{result.email}</span>.
            </p>

            <div className="mx-auto mt-6 max-w-md overflow-x-auto rounded-lg border border-edge bg-ink/80 px-4 py-3 text-left font-mono text-xs leading-relaxed">
              <p className="text-fg-muted">
                <span className="text-cyber">$</span> hb status --ref {result.reference}
              </p>
              <p className="text-fg">
                <span className="text-cyber">✓</span> queued · priority:{" "}
                <span className={PRIORITY_STYLES[result.priority].text}>{result.priority}</span>
              </p>
              <p className="text-fg-muted">
                <span className="text-cyber">→</span> service: {result.service}
              </p>
            </div>

            {result.demo && (
              <p className="mx-auto mt-3 max-w-md text-xs text-severity-medium">
                Demo mode: Supabase isn&apos;t configured, so this request was not saved.
              </p>
            )}

            <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
              <button type="button" onClick={reset} className="btn-ghost">
                <RotateCcw className="size-4" aria-hidden="true" />
                Submit another request
              </button>
              <button type="button" onClick={() => openBooking()} className="btn-primary">
                <CalendarClock className="size-4" aria-hidden="true" />
                Book a discovery call
              </button>
            </div>
          </div>
        ) : (
          <>
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-md border border-cyber/40 bg-cyber/10 px-2 py-0.5 font-mono text-[11px] font-semibold uppercase tracking-wider text-cyber">
                Option A
              </span>
              <span className="font-mono text-[11px] uppercase tracking-wider text-fg-subtle">
                Service &amp; inquiry form
              </span>
            </div>
            <h3 className="mt-3 text-2xl font-semibold tracking-tight text-fg">Tell us what you need</h3>
            <p className="mt-1.5 text-sm text-fg-muted">
              Every request is triaged by priority, so critical incidents jump the queue.
            </p>

            {/* Live command preview */}
            <pre
              aria-hidden="true"
              className="mt-5 overflow-x-auto rounded-lg border border-edge bg-ink/80 p-3.5 font-mono text-[11px] leading-relaxed text-fg-muted sm:text-xs"
            >
              <span className="text-cyber">$</span> hb request \{"\n"}
              {"    "}--service=<span className="text-fg">&quot;{values.serviceType || "<service>"}&quot;</span> \{"\n"}
              {"    "}--sector=<span className="text-fg">&quot;{values.industry || "<sector>"}&quot;</span> \{"\n"}
              {"    "}--priority=<span className={PRIORITY_STYLES[priority].text}>{priority}</span>
              <span className="ml-0.5 inline-block h-3.5 w-1.5 translate-y-0.5 animate-blink bg-cyber" />
            </pre>

            <form noValidate onSubmit={handleSubmit} className="relative mt-6 space-y-7">
              <fieldset className="space-y-4">
                <legend className="mb-4 font-mono text-xs uppercase tracking-wider text-fg-subtle">
                  <span className="text-cyber">01</span> · Contact details
                </legend>
                <div className="grid gap-4 sm:grid-cols-2">
                  <TextField
                    id="inquiry-name"
                    label="Name"
                    required
                    autoComplete="name"
                    placeholder="Jane Doe"
                    value={values.name}
                    error={errorFor("name")}
                    valid={isValid("name")}
                    onChange={(v) => update("name", v)}
                    onBlur={blur("name")}
                  />
                  <TextField
                    id="inquiry-email"
                    label="Email"
                    type="email"
                    required
                    autoComplete="email"
                    inputMode="email"
                    placeholder="jane@company.com"
                    value={values.email}
                    error={errorFor("email")}
                    valid={isValid("email")}
                    onChange={(v) => update("email", v)}
                    onBlur={blur("email")}
                  />
                  <TextField
                    id="inquiry-company"
                    label="Company"
                    autoComplete="organization"
                    placeholder="Company or organisation"
                    value={values.company}
                    error={errorFor("company")}
                    valid={isValid("company")}
                    onChange={(v) => update("company", v)}
                    onBlur={blur("company")}
                  />
                  <TextField
                    id="inquiry-phone"
                    label="Phone"
                    type="tel"
                    autoComplete="tel"
                    inputMode="tel"
                    placeholder="+1 555 012 3456"
                    value={values.phone}
                    error={errorFor("phone")}
                    valid={isValid("phone")}
                    onChange={(v) => update("phone", v)}
                    onBlur={blur("phone")}
                  />
                </div>
              </fieldset>

              <fieldset className="space-y-4">
                <legend className="mb-4 font-mono text-xs uppercase tracking-wider text-fg-subtle">
                  <span className="text-cyber">02</span> · Service request
                </legend>
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field id="inquiry-serviceType" label="Service type" required error={errorFor("serviceType")}>
                    <SelectShell>
                      <select
                        id="inquiry-serviceType"
                        value={values.serviceType}
                        onChange={(e) => {
                          update("serviceType", e.target.value);
                          setTouched((prev) => ({ ...prev, serviceType: true }));
                        }}
                        onBlur={blur("serviceType")}
                        className={fieldClass(
                          { error: errorFor("serviceType"), valid: isValid("serviceType") },
                          cn(
                            "appearance-none pr-10",
                            !values.serviceType && "text-fg-subtle",
                            highlightService && "ring-2 ring-cyber/60",
                          ),
                        )}
                        {...describedBy("inquiry-serviceType", errorFor("serviceType"))}
                      >
                        <option value="" disabled>
                          Select a service
                        </option>
                        {SERVICE_TYPES.map((s) => (
                          <option key={s} value={s}>
                            {s}
                          </option>
                        ))}
                      </select>
                    </SelectShell>
                  </Field>

                  <Field id="inquiry-industry" label="Industry / Sector" required error={errorFor("industry")}>
                    <SelectShell>
                      <select
                        id="inquiry-industry"
                        value={values.industry}
                        onChange={(e) => {
                          update("industry", e.target.value);
                          setTouched((prev) => ({ ...prev, industry: true }));
                        }}
                        onBlur={blur("industry")}
                        className={fieldClass(
                          { error: errorFor("industry"), valid: isValid("industry") },
                          cn("appearance-none pr-10", !values.industry && "text-fg-subtle"),
                        )}
                        {...describedBy("inquiry-industry", errorFor("industry"))}
                      >
                        <option value="" disabled>
                          Select your sector
                        </option>
                        {INDUSTRIES.map((i) => (
                          <option key={i} value={i}>
                            {i}
                          </option>
                        ))}
                      </select>
                    </SelectShell>
                  </Field>
                </div>
              </fieldset>

              <fieldset>
                <legend className="mb-4 font-mono text-xs uppercase tracking-wider text-fg-subtle">
                  <span className="text-cyber">03</span> · Severity / Priority
                </legend>
                <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
                  {PRIORITIES.map((p, i) => {
                    const selected = values.priority === p.value;
                    return (
                      <label
                        key={p.value}
                        className={cn(
                          "relative flex min-h-[4.25rem] cursor-pointer flex-col justify-center gap-1 rounded-xl border px-3.5 py-3 transition",
                          "has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-cyber/60",
                          selected
                            ? PRIORITY_STYLES[p.value].active
                            : "border-edge bg-ink/50 hover:border-edge-strong",
                        )}
                      >
                        <input
                          type="radio"
                          id={i === 0 ? "inquiry-priority" : undefined}
                          name="priority"
                          value={p.value}
                          checked={selected}
                          onChange={() => update("priority", p.value)}
                          className="sr-only"
                        />
                        <span className="flex items-center gap-2 text-sm font-semibold text-fg">
                          <span className={cn("size-2 rounded-full", PRIORITY_STYLES[p.value].dot)} />
                          {p.label}
                        </span>
                        <span className="text-xs text-fg-muted">{p.hint}</span>
                      </label>
                    );
                  })}
                </div>
                {values.priority === "critical" && (
                  <p className="mt-3 flex items-start gap-2 rounded-lg border border-severity-critical/30 bg-severity-critical/10 px-3.5 py-2.5 text-xs text-fg">
                    <AlertTriangle className="mt-px size-4 shrink-0 text-severity-critical" aria-hidden="true" />
                    <span>
                      Active incident? Submit this form, then{" "}
                      <a
                        href={whatsappLink("URGENT: I've just submitted a critical request on your website.")}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-semibold text-cyber underline-offset-2 hover:underline"
                      >
                        ping us on WhatsApp
                      </a>{" "}
                      for the fastest response.
                    </span>
                  </p>
                )}
              </fieldset>

              <fieldset className="space-y-4">
                <legend className="mb-4 font-mono text-xs uppercase tracking-wider text-fg-subtle">
                  <span className="text-cyber">04</span> · Details
                </legend>
                <TextField
                  id="inquiry-title"
                  label="Title"
                  required
                  placeholder="e.g. Security audit before our banking app launch"
                  maxLength={160}
                  value={values.title}
                  error={errorFor("title")}
                  valid={isValid("title")}
                  onChange={(v) => update("title", v)}
                  onBlur={blur("title")}
                />
                <Field
                  id="inquiry-description"
                  label="Detailed description"
                  required
                  error={errorFor("description")}
                  hint={
                    <span className="flex justify-between gap-3">
                      <span>Goals, timeline, budget range, current systems.</span>
                      <span className={cn("font-mono", descriptionLength < 20 && "text-fg-subtle")}>
                        {descriptionLength}/5000
                      </span>
                    </span>
                  }
                >
                  <textarea
                    id="inquiry-description"
                    rows={6}
                    maxLength={5000}
                    value={values.description}
                    onChange={(e) => update("description", e.target.value)}
                    onBlur={blur("description")}
                    placeholder="Describe the problem you're solving, what success looks like, and any deadlines…"
                    className={fieldClass(
                      { error: errorFor("description"), valid: isValid("description") },
                      "min-h-36 resize-y leading-relaxed",
                    )}
                    {...describedBy("inquiry-description", errorFor("description"), true)}
                  />
                </Field>
              </fieldset>

              {/* Honeypot: hidden from people, irresistible to bots. */}
              <div className="absolute -left-[9999px] h-px w-px overflow-hidden" aria-hidden="true">
                <label htmlFor="inquiry-website">Website</label>
                <input
                  id="inquiry-website"
                  tabIndex={-1}
                  autoComplete="off"
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                />
              </div>

              {serverError && (
                <div
                  role="alert"
                  className="flex items-start gap-2 rounded-lg border border-severity-critical/40 bg-severity-critical/10 px-3.5 py-3 text-sm text-fg"
                >
                  <AlertTriangle className="mt-0.5 size-4 shrink-0 text-severity-critical" aria-hidden="true" />
                  {serverError}
                </div>
              )}

              <div className="flex flex-col-reverse gap-4 border-t border-edge pt-6 sm:flex-row sm:items-center sm:justify-between">
                <p className="flex items-center gap-2 text-xs text-fg-subtle">
                  <Lock className="size-3.5 text-cyber" aria-hidden="true" />
                  Sent over HTTPS and stored privately.
                </p>
                <div className="flex flex-col gap-3 sm:flex-row">
                  <a
                    href={whatsappLink()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-ghost sm:hidden"
                  >
                    <MessageCircle className="size-4" aria-hidden="true" />
                    Ask on WhatsApp instead
                  </a>
                  <button type="submit" disabled={isPending} className="btn-primary w-full sm:w-auto">
                    {isPending ? (
                      <>
                        <Loader2 className="size-4 animate-spin" aria-hidden="true" />
                        Transmitting…
                      </>
                    ) : (
                      <>
                        <Send className="size-4" aria-hidden="true" />
                        Submit request
                      </>
                    )}
                  </button>
                </div>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
