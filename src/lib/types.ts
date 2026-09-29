export type ActionResult<T> =
  | { ok: true; data: T; demo?: boolean }
  | {
      ok: false;
      error: string;
      fieldErrors?: Partial<Record<string, string>>;
      code?: "validation" | "slot_taken" | "unavailable" | "server";
    };
