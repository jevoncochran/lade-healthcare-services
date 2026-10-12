"use client";

import { useState } from "react";
import FormAlert from "@/components/account/FormAlert";
import { api, type Customer } from "@/lib/api";
import { useSignedIn } from "@/lib/useSignedIn";
import BookingFlow from "./BookingFlow";

const BookRide = () => {
  const { user: customer, error } = useSignedIn<Customer>("/auth/me", "/login");
  const [resent, setResent] = useState(false);

  const resendVerification = async () => {
    if (!customer) return;
    await api("/auth/verify-email/resend", { body: { email: customer.email } });
    setResent(true);
  };

  if (error) return <FormAlert>{error}</FormAlert>;

  if (!customer) {
    return (
      <p role="status" className="text-muted">
        Loading…
      </p>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="section-title text-3xl">Book a ride</h1>
        <p className="mt-2 text-muted">
          Signed in as {customer.firstName} {customer.lastName}
        </p>
      </div>

      {customer.emailVerified ? (
        <BookingFlow />
      ) : (
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
    </div>
  );
};

export default BookRide;
