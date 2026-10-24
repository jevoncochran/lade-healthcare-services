"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";
import FormAlert from "@/components/account/FormAlert";
import { api, type Staff } from "@/lib/api";
import {
  careLevelOptions,
  formatAddress,
  formatDateTime,
  chargeLabel,
  formatMoney,
  labelOf,
  tripKindOptions,
  tripTypeOptions,
  type Address,
} from "@/lib/booking";
import {
  actorLabel,
  formatMiles,
  legStatusLabel,
  paymentStatusLabel,
  staffRelationshipLabel,
  historyLabel,
  type StaffBooking,
} from "@/lib/staff";
import { useSignedIn } from "@/lib/useSignedIn";
import StatusBadge from "../../StatusBadge";
import BookingActions from "./BookingActions";

const Row = ({ label, children }: { label: string; children: ReactNode }) => (
  <div className="grid gap-1 py-3 sm:grid-cols-[150px_1fr]">
    <dt className="form-label">{label}</dt>
    <dd className="text-ink">{children}</dd>
  </div>
);

const Card = ({ title, children }: { title: string; children: ReactNode }) => (
  <section className="card p-6 sm:p-8" aria-label={title}>
    <h2 className="card-title">{title}</h2>
    {children}
  </section>
);

const AddressBlock = ({ address }: { address: Address }) => (
  <address className="not-italic">{formatAddress(address)}</address>
);

const PhoneLink = ({ phone }: { phone: string }) => (
  <a href={`tel:${phone.replace(/[^\d+]/g, "")}`} className="link-arrow">
    {phone}
  </a>
);

const Trip = ({ booking }: { booking: StaffBooking }) => (
  <Card title="Trip">
    <dl className="mt-4 divide-y divide-line">
      <Row label="Care">{labelOf(careLevelOptions, booking.careLevel)}</Row>
      <Row label="Trip">
        {labelOf(tripKindOptions, booking.tripKind)} ·{" "}
        {labelOf(tripTypeOptions, booking.tripType)}
      </Row>
    </dl>

    {booking.legs.map((leg) => (
      <div key={leg.direction} className="mt-6">
        <h3 className="flex flex-wrap items-baseline justify-between gap-2 border-b border-line pb-2 font-heading text-base font-bold text-primary">
          {leg.direction === "OUTBOUND" ? "Ride there" : "Ride back"}
          <span className="text-sm font-semibold text-muted">
            {legStatusLabel[leg.status]}
          </span>
        </h3>
        <dl className="divide-y divide-line">
          <Row label="Pickup time">
            {leg.willCall
              ? "Will call when ready"
              : leg.pickupAt
                ? formatDateTime(leg.pickupAt)
                : "Not set"}
          </Row>
          {leg.appointmentAt && (
            <Row label="Appointment">{formatDateTime(leg.appointmentAt)}</Row>
          )}
          {leg.expectedWaitMinutes !== null && (
            <Row label="Expected wait">{leg.expectedWaitMinutes} minutes</Row>
          )}
          <Row label="From">
            <AddressBlock address={leg.pickup} />
          </Row>
          <Row label="To">
            <AddressBlock address={leg.dropoff} />
          </Row>
          <Row label="Distance">{formatMiles(leg.distanceMeters)}</Row>
          {leg.waitedMinutes !== null && (
            <Row label="Actual wait">{leg.waitedMinutes} minutes</Row>
          )}
        </dl>
      </div>
    ))}
  </Card>
);

const Rider = ({ booking }: { booking: StaffBooking }) => (
  <Card title="Rider">
    <dl className="mt-4 divide-y divide-line">
      <Row label="Name">
        {booking.rider.firstName} {booking.rider.lastName}
      </Row>
      <Row label="Phone">
        {booking.rider.phone ? (
          <PhoneLink phone={booking.rider.phone} />
        ) : (
          <span className="text-muted">Not given</span>
        )}
      </Row>
      <Row label="Companions">
        {booking.companionCount === 0 ? "None" : booking.companionCount}
      </Row>
      <Row label="Mobility needs">
        {booking.mobilityNotes ?? (
          <span className="text-muted">None given</span>
        )}
      </Row>
      <Row label="Instructions">
        {booking.instructions ?? <span className="text-muted">None given</span>}
      </Row>
    </dl>
  </Card>
);

const BookedBy = ({ booking }: { booking: StaffBooking }) => {
  const { requester } = booking;
  return (
    <Card title="Booked by">
      <dl className="mt-4 divide-y divide-line">
        <Row label="Who">
          {requester.name}
          <span className="text-muted">
            {" "}
            · {staffRelationshipLabel[requester.relationship]}
          </span>
        </Row>
        <Row label="Phone">
          <PhoneLink phone={requester.phone} />
        </Row>
        <Row label="Email">
          <a
            href={`mailto:${requester.email}`}
            className="link-arrow break-all"
          >
            {requester.email}
          </a>
        </Row>
      </dl>
    </Card>
  );
};

const PriceAndPayment = ({ booking }: { booking: StaffBooking }) => (
  <Card title="Price and payment">
    <dl className="mt-4 divide-y divide-line">
      {booking.price.lines.map((line) => (
        <div key={line.type} className="flex justify-between gap-4 py-3">
          <dt className="text-muted">{line.description}</dt>
          <dd className="font-medium text-ink">
            {formatMoney(line.amountCents)}
          </dd>
        </div>
      ))}
      <div className="flex justify-between gap-4 py-3">
        <dt className="font-heading font-semibold text-primary">
          Quoted total
        </dt>
        <dd className="font-heading text-xl font-bold text-primary">
          {formatMoney(booking.price.totalCents)}
        </dd>
      </div>
    </dl>
    {booking.charges.length > 0 && (
      <>
        <h3 className="mt-6 font-heading text-base font-bold text-primary">
          Final charges
        </h3>
        <dl className="mt-2 divide-y divide-line">
          {booking.charges.map((charge, index) => (
            <div key={index} className="flex justify-between gap-4 py-3">
              <dt className="text-muted">
                {chargeLabel(charge, booking.legs.length > 1)}
              </dt>
              <dd className="font-medium text-ink">
                {formatMoney(charge.amountCents)}
              </dd>
            </div>
          ))}
          <div className="flex justify-between gap-4 py-3">
            <dt className="font-heading font-semibold text-primary">
              Total owed
            </dt>
            <dd className="font-heading text-xl font-bold text-primary">
              {formatMoney(booking.chargesTotalCents)}
            </dd>
          </div>
        </dl>
      </>
    )}
    <p className="mt-2 text-sm text-muted">
      {booking.price.billableMiles} billable miles
      {booking.price.distanceIsEstimate &&
        " (estimated from ZIP codes in test mode)"}
      . Wait time, no-show and late-cancel fees are added after the ride.
    </p>
    <dl className="mt-4 divide-y divide-line border-t border-line">
      <Row label="Payment">
        {booking.payment ? (
          paymentStatusLabel[booking.payment.status]
        ) : (
          <span className="text-muted">No payment record</span>
        )}
      </Row>
      {booking.payment && booking.payment.refundedCents > 0 && (
        <Row label="Refunded">{formatMoney(booking.payment.refundedCents)}</Row>
      )}
    </dl>
  </Card>
);

const History = ({ booking }: { booking: StaffBooking }) => (
  <Card title="History">
    <ol className="mt-4 space-y-4 border-l-2 border-line pl-5">
      {booking.history.map((event, index) => (
        <li key={index}>
          <p className="font-semibold text-ink">
            {historyLabel[event.toStatus]}
          </p>
          <p className="text-sm text-muted">
            {formatDateTime(event.at)} · by{" "}
            {event.staffName ?? actorLabel[event.actorType]}
          </p>
          {event.note && <p className="mt-1 text-sm">{event.note}</p>}
        </li>
      ))}
    </ol>
  </Card>
);

// One booking, everything staff need to dispatch and answer calls about it.
// Read-only for now; the confirm / cancel / no-show / complete actions come
// next. Viewing is recorded in the audit log by the API.
const BookingDetail = ({ id, listHref }: { id: string; listHref: string }) => {
  const router = useRouter();
  const pathname = usePathname();
  // Who's signed in decides admin-only options (waiving fees). Also sends
  // them to sign in if the session has ended.
  const { user: staff } = useSignedIn<Staff>("/staff/auth/me", "/admin/login");
  const [booking, setBooking] = useState<StaffBooking>();
  const [error, setError] = useState<string>();

  const signIn = () =>
    router.replace(`/admin/login?next=${encodeURIComponent(pathname)}`);

  useEffect(() => {
    let active = true;
    api<StaffBooking>(`/staff/bookings/${encodeURIComponent(id)}`).then(
      (result) => {
        if (!active) return;
        if (result.ok) setBooking(result.data);
        else if (result.status === 401) {
          // Signed out after 15 idle minutes: sign in, then come back here.
          router.replace(`/admin/login?next=${encodeURIComponent(pathname)}`);
        } else if (result.status === 404 || result.status === 400) {
          setError("We couldn't find that booking. It may have been removed.");
        } else setError(result.message);
      },
    );
    return () => {
      active = false;
    };
  }, [id, pathname, router]);

  const back = (
    <Link href={listHref} className="link-arrow">
      ← All rides
    </Link>
  );

  if (error) {
    return (
      <div className="space-y-6">
        {back}
        <FormAlert>{error}</FormAlert>
      </div>
    );
  }

  if (!booking || !staff) {
    return (
      <div className="space-y-6">
        {back}
        <p role="status" className="text-muted">
          Loading booking…
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {back}

      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="font-mono text-sm text-muted">{booking.reference}</p>
          <h1 className="section-title text-3xl">
            {booking.rider.firstName} {booking.rider.lastName}
          </h1>
          <p className="mt-2 text-muted">
            Requested {formatDateTime(booking.createdAt)}
          </p>
        </div>
        <StatusBadge status={booking.status} />
      </div>

      {booking.status === "CANCELLED" && (
        <FormAlert tone="info">
          Cancelled
          {booking.cancelledAt && ` ${formatDateTime(booking.cancelledAt)}`}
          {booking.cancellationReason && `: ${booking.cancellationReason}`}
        </FormAlert>
      )}
      {booking.status === "PENDING_PAYMENT" && (
        <FormAlert tone="info">
          The customer didn&apos;t finish saving a card, so this isn&apos;t a
          real booking yet.
        </FormAlert>
      )}

      <BookingActions
        booking={booking}
        staff={staff}
        onUpdated={setBooking}
        onSignedOut={signIn}
      />

      <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr] lg:items-start">
        <div className="space-y-6">
          <Trip booking={booking} />
          <History booking={booking} />
        </div>
        <div className="space-y-6">
          <Rider booking={booking} />
          <BookedBy booking={booking} />
          <PriceAndPayment booking={booking} />
        </div>
      </div>
    </div>
  );
};

export default BookingDetail;
