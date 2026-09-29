export type ActionFailureCode =
  | "validation"
  | "slot_taken"
  | "unavailable"
  | "server"
  | "too_fast"
  | "captcha"
  | "rate_limited"
  | "limit";

export type ActionResult<T> =
  | { ok: true; data: T; demo?: boolean }
  | {
      ok: false;
      error: string;
      fieldErrors?: Partial<Record<string, string>>;
      code?: ActionFailureCode;
    };

/** Anti-spam signals sent alongside every form submission. */
export type SubmitMeta = {
  /** Milliseconds between the form appearing and being submitted. */
  elapsedMs: number;
  /** Cloudflare Turnstile token, when the widget is enabled. */
  turnstileToken?: string;
};
