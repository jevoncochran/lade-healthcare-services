"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import Button from "@/components/Button";
import FormAlert from "@/components/account/FormAlert";
import { ArrowRightIcon } from "@/components/Icons";
import { api, type Customer } from "@/lib/api";
import {
  formatAddress,
  formatDateTime,
  formatMoney,
  statusLabel,
  type CustomerRide,
} from "@/lib/booking";
import { useSignedIn } from "@/lib/useSignedIn";

const pickupTime = (ride: CustomerRide) => ride.legs[0].pickupAt ?? "";

// Upcoming: still going to happen, soonest first. Past: everything else,
// most recent first.
const split = (rides: CustomerRide[]) => {
  const upcoming = rides
    .filter(
      (ride) => ride.status === "REQUESTED" || ride.status === "CONFIRMED",
    )
    .sort((a, b) => pickupTime(a).localeCompare(pickupTime(b)));
  const past = rides
    .filter((ride) => !upcoming.includes(ride))
    .sort((a, b) => pickupTime(b).localeCompare(pickupTime(a)));
  return { upcoming, past };
};

const RideCard = ({ ride }: { ride: CustomerRide }) => {
  const outbound = ride.legs[0];
  const done = ride.status === "COMPLETED" && ride.chargesTotalCents > 0;
  return (
    <li className="relative -mx-3 rounded-button px-3 py-4 hover:bg-surface">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        {/* The link covers the whole card (after:inset-0). */}
        <Link
          href={`/my-rides/${ride.id}`}
          className="font-heading font-semibold text-primary after:absolute after:inset-0 hover:text-secondary"
        >
          {outbound.pickupAt
            ? formatDateTime(outbound.pickupAt)
            : "Time to be arranged"}
        </Link>
        <p className="text-sm font-medium text-secondary">
          {statusLabel[ride.status]}
        </p>
      </div>
      <p className="mt-1 text-sm text-ink">
        {formatAddress(outbound.pickup)} → {formatAddress(outbound.dropoff)}
      </p>
      <p className="mt-1 text-sm text-muted">
        {ride.reference} · {ride.rider.firstName} {ride.rider.lastName} ·{" "}
        {done
          ? `${formatMoney(ride.chargesTotalCents)} charged`
          : formatMoney(ride.price.totalCents)}
      </p>
    </li>
  );
};

const Section = ({
  title,
  rides,
  empty,
}: {
  title: string;
  rides: CustomerRide[];
  empty: string;
}) => (
  <section className="card p-6 sm:p-8" aria-label={title}>
    <h2 className="card-title">{title}</h2>
    {rides.length === 0 ? (
      <p className="mt-4 text-muted">{empty}</p>
    ) : (
      <ul className="mt-2 divide-y divide-line">
        {rides.map((ride) => (
          <RideCard key={ride.id} ride={ride} />
        ))}
      </ul>
    )}
  </section>
);

// The signed-in customer's rides. Opening one shows the details, charges
// and the cancel button.
const MyRides = () => {
  const { user: customer, error: signInError } = useSignedIn<Customer>(
    "/auth/me",
    "/login",
  );
  const [rides, setRides] = useState<CustomerRide[]>();
  const [error, setError] = useState<string>();

  useEffect(() => {
    if (!customer) return;
    api<CustomerRide[]>("/bookings").then((result) =>
      result.ok ? setRides(result.data) : setError(result.message),
    );
  }, [customer]);

  if (signInError || error) {
    return <FormAlert>{signInError ?? error}</FormAlert>;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <Link href="/account" className="link-arrow">
            ← My account
          </Link>
          <h1 className="section-title mt-3 text-3xl">My rides</h1>
        </div>
        <Button href="/book-a-ride" icon={ArrowRightIcon} iconPosition="right">
          Book a Ride
        </Button>
      </div>

      {!rides ? (
        <p role="status" className="text-muted">
          Loading your rides…
        </p>
      ) : (
        <>
          <Section
            title="Upcoming"
            rides={split(rides).upcoming}
            empty="No upcoming rides."
          />
          <Section
            title="Past and cancelled"
            rides={split(rides).past}
            empty="Nothing here yet."
          />
        </>
      )}
    </div>
  );
};

export default MyRides;
