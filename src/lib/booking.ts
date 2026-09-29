// Date/slot helpers shared by the booking modal (client) and server actions.
// Dates are plain "YYYY-MM-DD" strings and slots are "HH:MM" strings, both
// expressed in the business timezone, so nothing shifts across timezones.

export const BOOKING = {
  durationMinutes: 30,
  /** How many bookable working days to offer. */
  daysOffered: 10,
  /** 0 = Sunday ... 6 = Saturday */
  workingDays: [1, 2, 3, 4, 5],
  dayStart: "09:00",
  dayEnd: "17:00",
  /** Slots that are never offered (e.g. lunch). */
  blockedSlots: ["12:30", "13:00"],
} as const;

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

function toMinutes(hhmm: string) {
  const [h, m] = hhmm.split(":").map(Number);
  return h * 60 + m;
}

function fromMinutes(total: number) {
  const h = Math.floor(total / 60);
  const m = total % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}

export const TIME_SLOTS: readonly string[] = (() => {
  const slots: string[] = [];
  const blocked = new Set<string>(BOOKING.blockedSlots);
  for (
    let t = toMinutes(BOOKING.dayStart);
    t + BOOKING.durationMinutes <= toMinutes(BOOKING.dayEnd);
    t += BOOKING.durationMinutes
  ) {
    const slot = fromMinutes(t);
    if (!blocked.has(slot)) slots.push(slot);
  }
  return slots;
})();

export function slotEnd(slot: string) {
  return fromMinutes(toMinutes(slot) + BOOKING.durationMinutes);
}

export function isValidDateString(value: string) {
  if (!DATE_RE.test(value)) return false;
  const [y, m, d] = value.split("-").map(Number);
  const date = new Date(Date.UTC(y, m - 1, d));
  return date.getUTCFullYear() === y && date.getUTCMonth() === m - 1 && date.getUTCDate() === d;
}

function parseDate(value: string) {
  const [y, m, d] = value.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d));
}

function formatDate(date: Date) {
  return date.toISOString().slice(0, 10);
}

/** Today's calendar date in the given IANA timezone. */
export function todayIn(timeZone: string) {
  // en-CA formats as YYYY-MM-DD
  return new Intl.DateTimeFormat("en-CA", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
}

export function addDays(value: string, days: number) {
  const date = parseDate(value);
  date.setUTCDate(date.getUTCDate() + days);
  return formatDate(date);
}

export function dayOfWeek(value: string) {
  return parseDate(value).getUTCDay();
}

/** The next N working days, starting tomorrow in the business timezone. */
export function getBookableDates(timeZone: string, count: number = BOOKING.daysOffered) {
  const dates: string[] = [];
  const workingDays = new Set<number>(BOOKING.workingDays);
  let cursor = todayIn(timeZone);
  while (dates.length < count) {
    cursor = addDays(cursor, 1);
    if (workingDays.has(dayOfWeek(cursor))) dates.push(cursor);
  }
  return dates;
}

export function isBookableDate(value: string, timeZone: string) {
  return isValidDateString(value) && getBookableDates(timeZone).includes(value);
}

export function formatDateParts(value: string) {
  const date = parseDate(value);
  const fmt = (options: Intl.DateTimeFormatOptions) =>
    new Intl.DateTimeFormat("en-US", { timeZone: "UTC", ...options }).format(date);
  return {
    weekday: fmt({ weekday: "short" }),
    day: fmt({ day: "numeric" }),
    month: fmt({ month: "short" }),
    long: fmt({ weekday: "long", day: "numeric", month: "long", year: "numeric" }),
  };
}

export function formatSlot(slot: string) {
  const [h, m] = slot.split(":").map(Number);
  const suffix = h >= 12 ? "PM" : "AM";
  const hour12 = h % 12 === 0 ? 12 : h % 12;
  return `${hour12}:${String(m).padStart(2, "0")} ${suffix}`;
}

/** Short label such as "GMT", "UTC" or "GMT+1" for display next to times. */
export function timeZoneLabel(timeZone: string) {
  const part = new Intl.DateTimeFormat("en-US", { timeZone, timeZoneName: "short" })
    .formatToParts(new Date())
    .find((p) => p.type === "timeZoneName");
  return part?.value ?? timeZone;
}

/** Converts a wall-clock date + slot in `timeZone` to an absolute Date. */
export function zonedTimeToDate(value: string, slot: string, timeZone: string) {
  const [y, mo, d] = value.split("-").map(Number);
  const [h, mi] = slot.split(":").map(Number);
  const guess = Date.UTC(y, mo - 1, d, h, mi);
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone,
    hourCycle: "h23",
    year: "numeric",
    month: "numeric",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
  }).formatToParts(new Date(guess));
  const get = (type: string) => Number(parts.find((p) => p.type === type)?.value);
  const asZoned = Date.UTC(get("year"), get("month") - 1, get("day"), get("hour"), get("minute"));
  return new Date(guess - (asZoned - guess));
}

export function googleCalendarUrl(opts: {
  date: string;
  slot: string;
  timeZone: string;
  title: string;
  details: string;
}) {
  const stamp = (date: string, slot: string) => `${date.replaceAll("-", "")}T${slot.replace(":", "")}00`;
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: opts.title,
    details: opts.details,
    dates: `${stamp(opts.date, opts.slot)}/${stamp(opts.date, slotEnd(opts.slot))}`,
    ctz: opts.timeZone,
  });
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}
