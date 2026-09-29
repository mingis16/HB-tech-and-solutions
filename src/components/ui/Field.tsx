import { AlertCircle, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

type FieldProps = {
  id: string;
  label: string;
  required?: boolean;
  error?: string;
  hint?: React.ReactNode;
  className?: string;
  children: React.ReactNode;
};

export function Field({ id, label, required, error, hint, className, children }: FieldProps) {
  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      <label htmlFor={id} className="flex items-center gap-1 text-sm font-medium text-fg">
        {label}
        {required ? (
          <span className="text-cyber" aria-hidden="true">
            *
          </span>
        ) : (
          <span className="font-normal text-fg-subtle">(optional)</span>
        )}
      </label>
      {children}
      {error ? (
        <p id={`${id}-error`} className="flex items-center gap-1.5 text-xs text-severity-critical">
          <AlertCircle className="size-3.5 shrink-0" aria-hidden="true" />
          {error}
        </p>
      ) : hint ? (
        <p id={`${id}-hint`} className="text-xs text-fg-subtle">
          {hint}
        </p>
      ) : null}
    </div>
  );
}

/** Class list for a text input / textarea / select in a given validation state. */
export function fieldClass(state: { error?: string; valid?: boolean }, extra?: string) {
  return cn("field", state.error ? "field-invalid" : state.valid && "field-valid", extra);
}

/** aria props that tie an input to its error or hint text. */
export function describedBy(id: string, error?: string, hasHint?: boolean) {
  return {
    "aria-invalid": error ? true : undefined,
    "aria-describedby": error ? `${id}-error` : hasHint ? `${id}-hint` : undefined,
  } as const;
}

/** Native select (best touch behaviour on mobile) with a custom chevron. */
export function SelectShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative">
      {children}
      <ChevronDown
        className="pointer-events-none absolute right-3.5 top-1/2 size-4 -translate-y-1/2 text-fg-muted"
        aria-hidden="true"
      />
    </div>
  );
}
