// Booking form options, API shapes and helpers.

export const BUSINESS_TIME_ZONE = "America/New_York";

export type CareLevel =
  "AMBULATORY" | "WHEELCHAIR" | "BARIATRIC_WHEELCHAIR" | "STRETCHER";
export type TripKind = "ONE_WAY" | "ROUND_TRIP" | "WAIT_AND_RETURN";
export type TripType =
  | "MEDICAL_APPOINTMENT"
  | "HOSPITAL_DISCHARGE"
  | "DIALYSIS_RECURRING"
  | "PRIVATE";
export type Relationship =
  "SELF" | "FAMILY_CAREGIVER" | "FACILITY_STAFF" | "OTHER";

export const careLevelOptions: {
  value: CareLevel;
  label: string;
  description: string;
}[] = [
  {
    value: "AMBULATORY",
    label: "Ambulatory",
    description: "Can walk, with or without a little help.",
  },
  {
    value: "WHEELCHAIR",
    label: "Wheelchair",
    description: "Stays seated in their own wheelchair.",
  },
  {
    value: "BARIATRIC_WHEELCHAIR",
    label: "Bariatric wheelchair",
    description: "Wider wheelchair and extra securement.",
  },
  {
    value: "STRETCHER",
    label: "Stretcher",
    description: "Needs to lie flat. Two-person crew.",
  },
];

export const tripKindOptions: {
  value: TripKind;
  label: string;
  description: string;
}[] = [
  { value: "ONE_WAY", label: "One-way", description: "A single ride." },
  {
    value: "ROUND_TRIP",
    label: "Round trip",
    description: "There and back, with a separate ride home.",
  },
  {
    value: "WAIT_AND_RETURN",
    label: "Wait and return",
    description: "The driver waits during the appointment.",
  },
];

export const tripTypeOptions: { value: TripType; label: string }[] = [
  { value: "MEDICAL_APPOINTMENT", label: "Doctor or medical appointment" },
  { value: "HOSPITAL_DISCHARGE", label: "Hospital discharge" },
  { value: "DIALYSIS_RECURRING", label: "Dialysis or ongoing treatment" },
  { value: "PRIVATE", label: "Something else (errand, event, visit)" },
];

export const relationshipOptions: { value: Relationship; label: string }[] = [
  { value: "SELF", label: "Me" },
  { value: "FAMILY_CAREGIVER", label: "A family member or someone I care for" },
  { value: "FACILITY_STAFF", label: "A patient or resident at my facility" },
  { value: "OTHER", label: "Someone else" },
];

export const labelOf = <T extends string>(
  options: { value: T; label: string }[],
  value: T,
) => options.find((option) => option.value === value)?.label ?? value;

// ---------- API shapes ----------

export type Address = {
  line1: string;
  line2?: string;
  city: string;
  state: string;
  zip: string;
};

export type PriceLine = {
  type: string;
  description: string;
  quantity?: number;
  amountCents: number;
};

export type Quote =
  | {
      status: "priced";
      lines: PriceLine[];
      totalCents: number;
      billableMiles: number;
      // True while the API estimates distances from ZIP codes (test mode).
      distanceIsEstimate: boolean;
      notes: string[];
    }
  | { status: "call_for_quote"; reason: string; message: string };

export type BookingStatus =
  | "PENDING_PAYMENT"
  | "REQUESTED"
  | "CONFIRMED"
  | "COMPLETED"
  | "CANCELLED"
  | "NO_SHOW";

export type Booking = {
  id: string;
  reference: string;
  status: BookingStatus;
  careLevel: CareLevel;
  tripKind: TripKind;
  tripType: TripType;
  rider: { firstName: string; lastName: string; phone: string | null };
  legs: {
    direction: "OUTBOUND" | "RETURN";
    pickupAt: string | null;
    willCall: boolean;
    appointmentAt: string | null;
    expectedWaitMinutes: number | null;
    pickup: Address;
    dropoff: Address;
  }[];
  price: {
    totalCents: number;
    lines: PriceLine[];
    billableMiles: number;
    distanceIsEstimate: boolean;
  };
  createdAt: string;
};

export type CreatedBooking = {
  booking: Booking;
  payment: { provider: "fake" | "stripe"; clientSecret: string } | null;
};

export const statusLabel: Record<BookingStatus, string> = {
  PENDING_PAYMENT: "Waiting for card",
  REQUESTED: "Requested — waiting for confirmation",
  CONFIRMED: "Confirmed",
  COMPLETED: "Completed",
  CANCELLED: "Cancelled",
  NO_SHOW: "No-show",
};

export type PaymentStatus =
  | "CARD_PENDING"
  | "CARD_SAVED"
  | "CHARGE_PENDING"
  | "CHARGED"
  | "FAILED"
  | "REFUNDED"
  | "PARTIALLY_REFUNDED"
  | "CANCELED";

export type ChargeType =
  | "BASE_FARE"
  | "MILEAGE"
  | "WAIT_TIME"
  | "NO_SHOW"
  | "LATE_CANCELLATION"
  | "ADJUSTMENT";

// Payment, in the customer's words.
export const customerPaymentLabel: Record<PaymentStatus, string> = {
  CARD_PENDING: "Card not saved",
  CARD_SAVED: "Card saved, not charged yet",
  CHARGE_PENDING: "Payment processing",
  CHARGED: "Paid",
  FAILED: "Payment didn't go through",
  REFUNDED: "Refunded",
  PARTIALLY_REFUNDED: "Partly refunded",
  CANCELED: "Not charged",
};

// A customer's own ride on "My rides" (GET /bookings, GET /bookings/:id):
// the booking plus how it went and whether they can still cancel it.
export type CustomerRide = Omit<Booking, "legs"> & {
  legs: (Booking["legs"][number] & {
    status: "SCHEDULED" | "COMPLETED" | "CANCELLED" | "NO_SHOW";
  })[];
  cancelledAt: string | null;
  charges: {
    type: ChargeType;
    leg: "OUTBOUND" | "RETURN" | null;
    quantity: number | null;
    amountCents: number;
  }[];
  chargesTotalCents: number;
  paymentStatus: PaymentStatus | null;
  // feeCents: the late-cancellation fee if they cancel now, else null.
  cancel: { allowed: boolean; feeCents: number | null };
};

// ---------- Formatting ----------

export const formatMoney = (cents: number) =>
  (cents / 100).toLocaleString("en-US", { style: "currency", currency: "USD" });

export const formatAddress = (address: Address) =>
  [
    address.line1,
    address.line2,
    `${address.city}, ${address.state} ${address.zip}`,
  ]
    .filter(Boolean)
    .join(", ");

// "Wed, Oct 14, 9:30 AM", always in Tampa time.
export const formatDateTime = (iso: string) =>
  new Date(iso).toLocaleString("en-US", {
    timeZone: BUSINESS_TIME_ZONE,
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });

// One line of what a booking owes, in words.
export const chargeLabel = (
  charge: {
    type: ChargeType;
    leg: "OUTBOUND" | "RETURN" | null;
    quantity: number | null;
    note?: string | null;
  },
  // Say which leg only when the trip has a ride back.
  twoLegs = true,
) => {
  const where = !twoLegs
    ? ""
    : charge.leg === "RETURN"
      ? " (ride back)"
      : charge.leg === "OUTBOUND"
        ? " (ride there)"
        : "";
  switch (charge.type) {
    case "BASE_FARE":
      return "Base fare";
    case "MILEAGE":
      return `Mileage: ${charge.quantity ?? 0} mi`;
    case "WAIT_TIME":
      return `Waiting time${where}: ${charge.quantity ?? 0} × 15 min`;
    case "NO_SHOW":
      return "No-show fee";
    case "LATE_CANCELLATION":
      return "Late cancellation fee";
    case "ADJUSTMENT":
      return charge.note ? `Adjustment: ${charge.note}` : "Adjustment";
  }
};

// ---------- Times ----------

// The UTC offset (in minutes) of a time zone at a given moment, e.g. -240
// for Tampa in summer.
const offsetMinutes = (utcMs: number, timeZone: string) => {
  const parts = Object.fromEntries(
    new Intl.DateTimeFormat("en-US", {
      timeZone,
      hourCycle: "h23",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    })
      .formatToParts(new Date(utcMs))
      .map((part) => [part.type, part.value]),
  );
  const asUtc = Date.UTC(
    Number(parts.year),
    Number(parts.month) - 1,
    Number(parts.day),
    Number(parts.hour),
    Number(parts.minute),
    Number(parts.second),
  );
  return Math.round((asUtc - utcMs) / 60_000);
};

// A date ("2026-10-14") and time ("09:30") picked on the form, as Tampa time,
// to an ISO string with the offset: "2026-10-14T09:30:00-04:00". Works no
// matter what time zone the visitor's computer is set to.
export const tampaDateTimeToIso = (date: string, time: string) => {
  const [year, month, day] = date.split("-").map(Number);
  const [hour, minute] = time.split(":").map(Number);
  const wallClockAsUtc = Date.UTC(year, month - 1, day, hour, minute);

  // Two passes handle the hour around daylight-saving changes.
  let offset = offsetMinutes(wallClockAsUtc, BUSINESS_TIME_ZONE);
  offset = offsetMinutes(wallClockAsUtc - offset * 60_000, BUSINESS_TIME_ZONE);

  const sign = offset < 0 ? "-" : "+";
  const abs = Math.abs(offset);
  const hh = String(Math.floor(abs / 60)).padStart(2, "0");
  const mm = String(abs % 60).padStart(2, "0");
  return `${date}T${time}:00${sign}${hh}:${mm}`;
};

// Tomorrow's date in Tampa, for the earliest bookable day on the date picker
// (the API still enforces the full 24 hours).
export const tomorrowInTampa = () => {
  const now = new Date(Date.now() + 24 * 60 * 60 * 1000);
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: BUSINESS_TIME_ZONE,
  }).format(now); // en-CA formats as YYYY-MM-DD
};
