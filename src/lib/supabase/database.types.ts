// Hand-written to match supabase/migrations. Regenerate with:
//   npx supabase gen types typescript --project-id <ref> > src/lib/supabase/database.types.ts

type InquiryRow = {
  id: string;
  reference: string;
  name: string;
  email: string;
  company: string | null;
  phone: string | null;
  service_type: string;
  industry: string;
  priority: "low" | "medium" | "high" | "critical";
  title: string;
  description: string;
  status: "new" | "in_review" | "responded" | "closed";
  user_agent: string | null;
  ip_hash: string | null;
  created_at: string;
  updated_at: string;
};

type BookingRow = {
  id: string;
  reference: string;
  name: string;
  email: string;
  phone: string | null;
  company: string | null;
  service_type: string | null;
  notes: string | null;
  booking_date: string;
  time_slot: string;
  duration_minutes: number;
  timezone: string;
  status: "pending" | "confirmed" | "cancelled" | "completed";
  user_agent: string | null;
  ip_hash: string | null;
  created_at: string;
  updated_at: string;
};

type Generated = "id" | "created_at" | "updated_at";
type Nullable = "ip_hash";
type Defaulted = "status" | "priority" | "duration_minutes" | "timezone" | Nullable;

type InsertOf<Row> = Omit<Row, Generated | Defaulted> &
  Partial<Pick<Row, Extract<keyof Row, Generated | Defaulted>>>;

export type Database = {
  public: {
    Tables: {
      inquiries: {
        Row: InquiryRow;
        Insert: InsertOf<InquiryRow>;
        Update: Partial<InquiryRow>;
        Relationships: [];
      };
      bookings: {
        Row: BookingRow;
        Insert: InsertOf<BookingRow>;
        Update: Partial<BookingRow>;
        Relationships: [];
      };
    };
    Views: { [_ in never]: never };
    Functions: { [_ in never]: never };
    Enums: { [_ in never]: never };
    CompositeTypes: { [_ in never]: never };
  };
};
