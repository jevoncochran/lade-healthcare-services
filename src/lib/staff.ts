// Staff dashboard: API shapes, labels and the ride list filters.

import {
  BUSINESS_TIME_ZONE,
  type Address,
  type BookingStatus,
  type CareLevel,
  type TripKind,
  type TripType,
} from "./booking";

export type PaymentStatus =
  | "CARD_PENDING"
  | "CARD_SAVED"
  | "CHARGED"
  | "FAILED"
  | "REFUNDED"
  | "PARTIALLY_REFUNDED"
  | "CANCELED";

// One row of GET /staff/bookings.
export type StaffBookingSummary = {
  id: string;
  reference: string;
  status: BookingStatus;
  careLevel: CareLevel;
  tripKind: TripKind;
  tripType: TripType;
  rider: { firstName: string; lastName: string };
  pickupAt: string;
  pickup: Address;
  dropoff: Address;
  returnLeg: { pickupAt: string | null; willCall: boolean } | null;
  totalCents: number;
  paymentStatus: PaymentStatus | null;
  createdAt: string;
};

export type StaffBookingList = {
  bookings: StaffBookingSummary[];
  total: number;
  page: number;
  pageSize: number;
};

// Shorter than the customer labels, and worded for the person acting on them.
export const staffStatusLabel: Record<BookingStatus, string> = {
  REQUESTED: "Needs confirmation",
  CONFIRMED: "Confirmed",
  COMPLETED: "Completed",
  CANCELLED: "Cancelled",
  NO_SHOW: "No-show",
  PENDING_PAYMENT: "Card not saved",
};

// In the order a dispatcher filters by most.
export const statusFilterOptions: { value: BookingStatus; label: string }[] = [
  { value: "REQUESTED", label: "Needs confirmation" },
  { value: "CONFIRMED", label: "Confirmed" },
  { value: "COMPLETED", label: "Completed" },
  { value: "NO_SHOW", label: "No-show" },
  { value: "CANCELLED", label: "Cancelled" },
  { value: "PENDING_PAYMENT", label: "Card not saved (unfinished checkout)" },
];

// ---------- Ride list filters (kept in the page URL) ----------

export type RideFilters = {
  status?: BookingStatus;
  from?: string; // YYYY-MM-DD, Tampa
  to?: string;
  q?: string; // booking reference or rider last name
  sort: "pickup" | "newest";
  page: number;
};

const DATE = /^\d{4}-\d{2}-\d{2}$/;
const STATUSES = statusFilterOptions.map((option) => option.value);

type SearchParams = Record<string, string | string[] | undefined>;

// Reads the filters from /admin?status=…&from=…; anything unexpected is
// ignored rather than shown as an error.
export const parseRideFilters = (params: SearchParams): RideFilters => {
  const one = (key: string) => {
    const value = params[key];
    const text = (Array.isArray(value) ? value[0] : value)?.trim();
    return text || undefined;
  };
  const status = one("status") as BookingStatus | undefined;
  const from = one("from");
  const to = one("to");
  const page = Number(one("page"));

  return {
    status: status && STATUSES.includes(status) ? status : undefined,
    from: from && DATE.test(from) ? from : undefined,
    to: to && DATE.test(to) ? to : undefined,
    q: one("q")?.slice(0, 50),
    sort: one("sort") === "newest" ? "newest" : "pickup",
    page: Number.isInteger(page) && page > 1 ? page : 1,
  };
};

// The /admin URL for a set of filters (used by paging links).
export const rideFiltersHref = (filters: RideFilters) => {
  const params = new URLSearchParams();
  if (filters.status) params.set("status", filters.status);
  if (filters.from) params.set("from", filters.from);
  if (filters.to) params.set("to", filters.to);
  if (filters.q) params.set("q", filters.q);
  if (filters.sort !== "pickup") params.set("sort", filters.sort);
  if (filters.page > 1) params.set("page", String(filters.page));
  const query = params.toString();
  return query ? `/admin?${query}` : "/admin";
};

// Booking references look like "LD-7K3Q9X"; anything else is a last name.
const REFERENCE = /^LD-?([A-Z0-9]{6})$/i;

export const PAGE_SIZE = 50;

// The API query for a set of filters.
export const rideListQuery = (filters: RideFilters) => {
  const params = new URLSearchParams();
  if (filters.status) params.set("status", filters.status);
  if (filters.from) params.set("from", filters.from);
  if (filters.to) params.set("to", filters.to);
  if (filters.q) {
    const reference = filters.q.match(REFERENCE);
    if (reference) params.set("reference", `LD-${reference[1].toUpperCase()}`);
    else params.set("riderLastName", filters.q);
  }
  params.set("sort", filters.sort);
  params.set("page", String(filters.page));
  params.set("pageSize", String(PAGE_SIZE));
  return `/staff/bookings?${params}`;
};

// ---------- Formatting ----------

// The Tampa calendar date of a time, "2026-10-21".
export const tampaDate = (iso: string | Date) =>
  new Intl.DateTimeFormat("en-CA", { timeZone: BUSINESS_TIME_ZONE }).format(
    new Date(iso),
  );

// "9:30 AM", Tampa time.
export const formatTime = (iso: string) =>
  new Date(iso).toLocaleTimeString("en-US", {
    timeZone: BUSINESS_TIME_ZONE,
    hour: "numeric",
    minute: "2-digit",
  });

// Day headings on the ride list: "Today", "Tomorrow" or "Thursday, Oct 22".
export const formatDayHeading = (date: string) => {
  const today = tampaDate(new Date());
  const tomorrow = tampaDate(new Date(Date.now() + 24 * 60 * 60 * 1000));
  const [year, month, day] = date.split("-").map(Number);
  const label = new Date(Date.UTC(year, month - 1, day)).toLocaleDateString(
    "en-US",
    { timeZone: "UTC", weekday: "long", month: "short", day: "numeric" },
  );
  if (date === today) return `Today · ${label}`;
  if (date === tomorrow) return `Tomorrow · ${label}`;
  return label;
};

// "123 Palm Ave, Tampa": enough to dispatch from at a glance.
export const shortAddress = (address: Address) =>
  `${address.line1}, ${address.city}`;
