"use client";

import { useRouter } from "next/navigation";
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
  type Booking,
} from "@/lib/booking";
import { useSignedIn } from "@/lib/useSignedIn";

const AccountDetails = () => {
  const router = useRouter();
  const { user: customer, error } = useSignedIn<Customer>("/auth/me", "/login");
  const [signingOut, setSigningOut] = useState(false);
  const [resent, setResent] = useState(false);

  const signOut = async () => {
    setSigningOut(true);
    await api("/auth/logout", { method: "POST" });
    router.push("/login");
  };

  const resendVerification = async () => {
    if (!customer) return;
    await api("/auth/verify-email/resend", { body: { email: customer.email } });
    setResent(true);
  };

  if (error) return <FormAlert>{error}</FormAlert>;

  if (!customer) {
    return (
      <p role="status" className="text-muted">
        Loading your account…
      </p>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="section-title text-3xl">My account</h1>
          <p className="mt-2 text-muted">
            Signed in as {customer.firstName} {customer.lastName}
          </p>
        </div>
        <Button variant="outline" onClick={signOut} disabled={signingOut}>
          {signingOut ? "Signing out…" : "Sign out"}
        </Button>
      </div>

      {!customer.emailVerified && (
        <FormAlert tone="info">
          Please confirm your email address before booking. We sent a link to{" "}
          {customer.email}.{" "}
          {resent ? (
            "We sent another one."
          ) : (
            <button
              type="button"
              onClick={resendVerification}
              className="font-semibold text-secondary underline"
            >
              Send it again
            </button>
          )}
        </FormAlert>
      )}

      <div className="card p-6 sm:p-8">
        <h2 className="card-title">Your details</h2>
        <dl className="mt-4 divide-y divide-line">
          <Detail label="First name" value={customer.firstName} />
          <Detail label="Last name" value={customer.lastName} />
          <Detail label="Email" value={customer.email} />
          <Detail label="Phone" value={customer.phone} />
        </dl>
      </div>

      <YourRides />
    </div>
  );
};

const Detail = ({ label, value }: { label: string; value: string }) => (
  <div className="grid gap-1 py-3 sm:grid-cols-[120px_1fr]">
    <dt className="form-label">{label}</dt>
    <dd className="break-all text-ink">{value}</dd>
  </div>
);

const YourRides = () => {
  const [bookings, setBookings] = useState<Booking[]>();
  const [error, setError] = useState<string>();

  useEffect(() => {
    api<Booking[]>("/bookings").then((result) =>
      result.ok ? setBookings(result.data) : setError(result.message),
    );
  }, []);

  return (
    <div className="card p-6 sm:p-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h2 className="card-title">Your rides</h2>
        <Button href="/book-a-ride" icon={ArrowRightIcon} iconPosition="right">
          Book a Ride
        </Button>
      </div>

      {error && (
        <div className="mt-4">
          <FormAlert>{error}</FormAlert>
        </div>
      )}
      {!bookings && !error && (
        <p role="status" className="mt-4 text-muted">
          Loading your rides…
        </p>
      )}
      {bookings?.length === 0 && (
        <p className="mt-4 text-muted">You haven&apos;t booked any rides yet.</p>
      )}

      {bookings && bookings.length > 0 && (
        <ul className="mt-4 divide-y divide-line">
          {bookings.map((booking) => {
            const outbound = booking.legs[0];
            return (
              <li key={booking.id} className="py-4">
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <p className="font-heading font-semibold text-primary">
                    {outbound.pickupAt
                      ? formatDateTime(outbound.pickupAt)
                      : "Time to be arranged"}
                  </p>
                  <p className="text-sm font-medium text-secondary">
                    {statusLabel[booking.status]}
                  </p>
                </div>
                <p className="mt-1 text-sm text-muted">
                  {formatAddress(outbound.pickup)} → {formatAddress(outbound.dropoff)}
                </p>
                <p className="mt-1 text-sm text-muted">
                  {booking.reference} · {booking.rider.firstName}{" "}
                  {booking.rider.lastName} ·{" "}
                  {formatMoney(booking.price.totalCents)}
                  {booking.price.distanceIsEstimate && " (estimated distance)"}
                </p>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default AccountDetails;
