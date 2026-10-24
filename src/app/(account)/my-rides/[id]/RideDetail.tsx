"use client";

import Link from "next/link";
import { useCallback, useEffect, useState, type ReactNode } from "react";
import Button from "@/components/Button";
import FormAlert from "@/components/account/FormAlert";
import Field, { describedBy } from "@/components/form/Field";
import { PhoneIcon } from "@/components/Icons";
import { api, type Customer } from "@/lib/api";
import {
  careLevelOptions,
  chargeLabel,
  customerPaymentLabel,
  formatAddress,
  formatDateTime,
  formatMoney,
  labelOf,
  statusLabel,
  tripKindOptions,
  type CustomerRide,
} from "@/lib/booking";
import { site } from "@/lib/site";
import { useSignedIn } from "@/lib/useSignedIn";

const Row = ({ label, children }: { label: string; children: ReactNode }) => (
  <div className="grid gap-1 py-3 sm:grid-cols-[130px_1fr]">
    <dt className="form-label">{label}</dt>
    <dd className="text-ink">{children}</dd>
  </div>
);

const Trip = ({ ride }: { ride: CustomerRide }) => (
  <section className="card p-6 sm:p-8" aria-label="Trip">
    <h2 className="card-title">Trip</h2>
    <dl className="mt-4 divide-y divide-line">
      <Row label="Rider">
        {ride.rider.firstName} {ride.rider.lastName}
      </Row>
      <Row label="Care">{labelOf(careLevelOptions, ride.careLevel)}</Row>
      <Row label="Trip">{labelOf(tripKindOptions, ride.tripKind)}</Row>
      {ride.legs.map((leg) => (
        <Row
          key={leg.direction}
          label={leg.direction === "OUTBOUND" ? "Ride there" : "Ride back"}
        >
          {leg.willCall
            ? "You'll call when ready"
            : leg.pickupAt
              ? formatDateTime(leg.pickupAt)
              : "Time to be arranged"}
          <br />
          <span className="text-muted">
            {formatAddress(leg.pickup)} → {formatAddress(leg.dropoff)}
          </span>
          {leg.status === "CANCELLED" && ride.status !== "CANCELLED" && (
            <>
              <br />
              <span className="text-muted">Not needed</span>
            </>
          )}
        </Row>
      ))}
    </dl>
  </section>
);

const Price = ({ ride }: { ride: CustomerRide }) => {
  const final = ride.charges.length > 0;
  return (
    <section className="card p-6 sm:p-8" aria-label="Price">
      <h2 className="card-title">{final ? "What you paid" : "Price"}</h2>
      <dl className="mt-4 divide-y divide-line">
        {(final ? ride.charges : ride.price.lines).map((line, index) => (
          <div key={index} className="flex justify-between gap-4 py-3">
            <dt className="text-muted">
              {"description" in line
                ? line.description
                : chargeLabel(line, ride.legs.length > 1)}
            </dt>
            <dd className="font-medium text-ink">
              {formatMoney(line.amountCents)}
            </dd>
          </div>
        ))}
        <div className="flex justify-between gap-4 py-3">
          <dt className="font-heading font-semibold text-primary">Total</dt>
          <dd className="font-heading text-xl font-bold text-primary">
            {formatMoney(
              final ? ride.chargesTotalCents : ride.price.totalCents,
            )}
          </dd>
        </div>
      </dl>
      {!final && (
        <p className="mt-2 text-sm text-muted">
          Your card is charged after the ride. Waiting time over 15 minutes is
          added then.
        </p>
      )}
      {ride.paymentStatus && (
        <p className="mt-2 text-sm text-muted">
          Payment: {customerPaymentLabel[ride.paymentStatus]}
        </p>
      )}
      {ride.paymentStatus === "FAILED" && (
        <div className="mt-4">
          <FormAlert>
            We couldn&apos;t charge your card for this ride. Please call us at{" "}
            {site.phone} so we can sort it out.
          </FormAlert>
        </div>
      )}
    </section>
  );
};

// Cancelling: states any fee first, then asks the API with the fee the
// customer agreed to (the API refuses if a bigger one now applies).
const Cancel = ({
  ride,
  onCancelled,
  onStale,
}: {
  ride: CustomerRide;
  onCancelled: (ride: CustomerRide) => void;
  onStale: () => void;
}) => {
  const [open, setOpen] = useState(false);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string>();
  const fee = ride.cancel.feeCents;
  const hint = "It helps us plan.";

  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const reason = String(
      new FormData(event.currentTarget).get("reason") ?? "",
    ).trim();
    setPending(true);
    setError(undefined);
    const result = await api<CustomerRide>(`/bookings/${ride.id}/cancel`, {
      body: { reason: reason || undefined, acceptedFeeCents: fee ?? undefined },
    });
    setPending(false);
    if (result.ok) {
      onCancelled(result.data);
    } else {
      setError(result.message);
      // e.g. a fee now applies: show the latest (and the new fee).
      if (result.status === 409) onStale();
    }
  };

  if (!ride.cancel.allowed) {
    if (ride.status !== "REQUESTED" && ride.status !== "CONFIRMED") return null;
    return (
      <section className="card p-6 sm:p-8" aria-label="Changes">
        <h2 className="card-title">Need to change this ride?</h2>
        <p className="mt-3 text-muted">
          The pickup time has passed, so please call us.
        </p>
        <Button href={site.phoneHref} icon={PhoneIcon} className="mt-4">
          Call {site.phone}
        </Button>
      </section>
    );
  }

  return (
    <section className="card space-y-4 p-6 sm:p-8" aria-label="Cancel">
      <h2 className="card-title">Can&apos;t make it?</h2>
      {error && <FormAlert>{error}</FormAlert>}
      {!open ? (
        <>
          <p className="text-muted">
            {fee === null
              ? ride.status === "REQUESTED"
                ? "You can cancel for free until we confirm the ride."
                : "Cancelling is free until 2 hours before pickup."
              : `It's less than 2 hours before pickup, so cancelling now costs a late-cancellation fee of ${formatMoney(fee)}.`}
          </p>
          <Button variant="outline" onClick={() => setOpen(true)}>
            Cancel this ride
          </Button>
        </>
      ) : (
        <form onSubmit={submit} noValidate className="space-y-4">
          <FormAlert tone="info">
            {fee === null
              ? "You won't be charged."
              : `A late-cancellation fee of ${formatMoney(fee)} will be charged to your card.`}
          </FormAlert>
          <Field name="reason" label="Why are you cancelling?" hint={hint}>
            <textarea
              id="reason"
              name="reason"
              rows={2}
              maxLength={500}
              className="form-input"
              aria-describedby={describedBy("reason", hint)}
            />
          </Field>
          <div className="flex flex-wrap gap-3">
            <Button type="submit" disabled={pending}>
              {pending
                ? "Cancelling…"
                : fee === null
                  ? "Cancel ride"
                  : `Cancel and pay ${formatMoney(fee)}`}
            </Button>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Keep my ride
            </Button>
          </div>
        </form>
      )}
    </section>
  );
};

// One of the customer's rides: details, what it cost, and cancelling.
const RideDetail = ({ id }: { id: string }) => {
  const { user: customer, error: signInError } = useSignedIn<Customer>(
    "/auth/me",
    "/login",
  );
  const [ride, setRide] = useState<CustomerRide>();
  const [error, setError] = useState<string>();
  const [cancelled, setCancelled] = useState(false);

  const fetchRide = useCallback(
    () => api<CustomerRide>(`/bookings/${encodeURIComponent(id)}`),
    [id],
  );
  // State setters never change, so this is stable.
  const show = useCallback((result: Awaited<ReturnType<typeof fetchRide>>) => {
    if (result.ok) setRide(result.data);
    else
      setError(
        result.status === 404 || result.status === 400
          ? "We couldn't find that ride."
          : result.message,
      );
  }, []);

  useEffect(() => {
    if (!customer) return;
    let active = true;
    fetchRide().then((result) => {
      if (active) show(result);
    });
    return () => {
      active = false;
    };
  }, [customer, fetchRide, show]);

  const back = (
    <Link href="/my-rides" className="link-arrow">
      ← My rides
    </Link>
  );

  if (signInError || error) {
    return (
      <div className="space-y-6">
        {back}
        <FormAlert>{signInError ?? error}</FormAlert>
      </div>
    );
  }

  if (!ride) {
    return (
      <div className="space-y-6">
        {back}
        <p role="status" className="text-muted">
          Loading your ride…
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {back}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="font-mono text-sm text-muted">{ride.reference}</p>
          <h1 className="section-title text-3xl">
            {ride.legs[0].pickupAt
              ? formatDateTime(ride.legs[0].pickupAt)
              : "Your ride"}
          </h1>
        </div>
        <p className="rounded-full bg-secondary/10 px-3 py-1 text-sm font-semibold text-secondary">
          {statusLabel[ride.status]}
        </p>
      </div>

      {cancelled && (
        <FormAlert tone="info">
          Your ride is cancelled. We&apos;ve emailed you a confirmation.
        </FormAlert>
      )}
      {ride.status === "CANCELLED" && !cancelled && ride.cancelledAt && (
        <FormAlert tone="info">
          Cancelled {formatDateTime(ride.cancelledAt)}.
        </FormAlert>
      )}
      {ride.status === "NO_SHOW" && (
        <FormAlert tone="info">
          Our driver couldn&apos;t find the rider at the pickup. If you think
          this is a mistake, please call us at {site.phone}.
        </FormAlert>
      )}

      <Trip ride={ride} />
      <Price ride={ride} />
      <Cancel
        ride={ride}
        onCancelled={(updated) => {
          setRide(updated);
          setCancelled(true);
          window.scrollTo({ top: 0 });
        }}
        onStale={() => void fetchRide().then(show)}
      />
    </div>
  );
};

export default RideDetail;
