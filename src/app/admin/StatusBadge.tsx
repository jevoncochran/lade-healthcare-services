import type { BookingStatus } from "@/lib/booking";
import { staffStatusLabel } from "@/lib/staff";

// Token colors per status. "Needs confirmation" stands out: it's the work.
const badgeClass: Record<BookingStatus, string> = {
  REQUESTED: "bg-secondary text-white",
  CONFIRMED: "bg-accent/10 text-accent",
  COMPLETED: "bg-surface text-muted",
  CANCELLED: "bg-surface text-muted",
  NO_SHOW: "bg-danger/10 text-danger",
  PENDING_PAYMENT: "bg-surface text-muted",
};

// Status pill for staff pages.
const StatusBadge = ({ status }: { status: BookingStatus }) => (
  <span
    className={`inline-block rounded-full px-3 py-1 text-xs font-semibold whitespace-nowrap ${badgeClass[status]}`}
  >
    {staffStatusLabel[status]}
  </span>
);

export default StatusBadge;
