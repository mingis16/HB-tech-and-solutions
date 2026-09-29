import { z } from "zod";
import { INDUSTRIES, PRIORITY_VALUES, SERVICE_TYPES } from "./constants";
import { TIME_SLOTS, isValidDateString } from "./booking";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const PHONE_RE = /^\+?[0-9\s().-]{7,20}$/;

const name = z
  .string()
  .trim()
  .min(2, "Please enter your full name")
  .max(120, "Name must be 120 characters or fewer");

const email = z
  .string()
  .trim()
  .min(1, "Email is required")
  .max(254, "Email is too long")
  .regex(EMAIL_RE, "Enter a valid email address");

const optionalPhone = z
  .string()
  .trim()
  .refine((v) => v === "" || PHONE_RE.test(v), "Enter a valid phone number, including country code");

const optionalCompany = z.string().trim().max(160, "Company name is too long");

export const inquirySchema = z.object({
  name,
  email,
  company: optionalCompany,
  phone: optionalPhone,
  serviceType: z.enum(SERVICE_TYPES, { error: "Select the service you need" }),
  industry: z.enum(INDUSTRIES, { error: "Select your industry or sector" }),
  priority: z.enum(PRIORITY_VALUES, { error: "Select a priority level" }),
  title: z
    .string()
    .trim()
    .min(4, "Give your request a short title")
    .max(160, "Title must be 160 characters or fewer"),
  description: z
    .string()
    .trim()
    .min(20, "Add a bit more detail (at least 20 characters)")
    .max(5000, "Description must be 5,000 characters or fewer"),
});

export const bookingSchema = z.object({
  name,
  email,
  phone: optionalPhone,
  company: optionalCompany,
  serviceType: z.union([z.enum(SERVICE_TYPES), z.literal("")]),
  notes: z.string().trim().max(1000, "Notes must be 1,000 characters or fewer"),
  date: z.string().refine(isValidDateString, "Pick a date"),
  slot: z.string().refine((v) => TIME_SLOTS.includes(v), "Pick a time slot"),
});

export type InquiryData = z.output<typeof inquirySchema>;
export type BookingData = z.output<typeof bookingSchema>;

/** Raw form state: every field is a string until validated. */
export type InquiryFormValues = { [K in keyof InquiryData]: string };
export type BookingFormValues = { [K in keyof BookingData]: string };

export type FieldErrors<T> = Partial<Record<keyof T & string, string>>;

export function toFieldErrors<T>(error: z.ZodError): FieldErrors<T> {
  const errors: Record<string, string> = {};
  for (const issue of error.issues) {
    const key = issue.path[0];
    if (typeof key === "string" && !(key in errors)) errors[key] = issue.message;
  }
  return errors as FieldErrors<T>;
}

export function validate<T>(schema: z.ZodType, values: T): FieldErrors<T> {
  const result = schema.safeParse(values);
  return result.success ? {} : toFieldErrors<T>(result.error);
}
