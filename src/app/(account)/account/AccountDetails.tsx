"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import Button from "@/components/Button";
import FormAlert from "@/components/account/FormAlert";
import { ArrowRightIcon } from "@/components/Icons";
import { api, type Customer } from "@/lib/api";
import { formatPhone } from "@/lib/phone";
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
          <Detail label="Phone" value={formatPhone(customer.phone)} />
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

// Rides live on their own page (/my-rides): upcoming, past, cancelling.
const YourRides = () => (
  <div className="card p-6 sm:p-8">
    <h2 className="card-title">Your rides</h2>
    <p className="mt-3 text-muted">
      See your upcoming and past rides, what you paid, or cancel a ride.
    </p>
    <div className="mt-4 flex flex-wrap gap-3">
      <Button href="/my-rides" icon={ArrowRightIcon} iconPosition="right">
        My rides
      </Button>
      <Button href="/book-a-ride" variant="outline">
        Book a Ride
      </Button>
    </div>
  </div>
);

export default AccountDetails;
