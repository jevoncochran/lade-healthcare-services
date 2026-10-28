"use client";

import {
  Elements,
  PaymentElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import { loadStripe, type Appearance } from "@stripe/stripe-js";
import { useMemo, useState, type FormEvent } from "react";
import Button from "@/components/Button";
import FormAlert from "@/components/account/FormAlert";
import { api } from "@/lib/api";
import type { Booking } from "@/lib/booking";

// Stripe.js, loaded once per key, and only on pages that show the card form.
// The key comes from the API with each card setup (test or live, matching
// its secret key), so the website has no Stripe setting of its own.
const stripeByKey = new Map<string, ReturnType<typeof loadStripe>>();
const stripeFor = (publishableKey: string) => {
  if (!stripeByKey.has(publishableKey)) {
    stripeByKey.set(publishableKey, loadStripe(publishableKey));
  }
  return stripeByKey.get(publishableKey)!;
};

// Stripe's card form runs in its own frame, so it can't use our CSS. Hand it
// the site's design tokens from globals.css instead of copying colors here.
const appearanceFromTokens = (): Appearance => {
  const token = (name: string) =>
    getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  return {
    theme: "stripe",
    variables: {
      colorPrimary: token("--color-secondary"),
      colorText: token("--color-ink"),
      colorTextSecondary: token("--color-muted"),
      colorDanger: token("--color-danger"),
      borderRadius: token("--radius-button") || "6px",
      fontSizeBase: "16px",
    },
  };
};

// Stripe's own card form: card numbers go straight from the browser to
// Stripe and never touch our servers. Once Stripe accepts the card, our API
// checks with Stripe itself before moving the booking along.
const StripeCardForm = ({
  bookingId,
  clientSecret,
  publishableKey,
  onSaved,
}: {
  bookingId: string;
  clientSecret: string;
  publishableKey: string;
  onSaved: (booking: Booking) => void;
}) => {
  const appearance = useMemo(() => appearanceFromTokens(), []);

  return (
    <Elements
      stripe={stripeFor(publishableKey)}
      options={{ clientSecret, appearance }}
    >
      <CardForm bookingId={bookingId} onSaved={onSaved} />
    </Elements>
  );
};

const CardForm = ({
  bookingId,
  onSaved,
}: {
  bookingId: string;
  onSaved: (booking: Booking) => void;
}) => {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState<string>();
  const [pending, setPending] = useState(false);
  const [stillConfirming, setStillConfirming] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!stripe || !elements) return; // Stripe.js still loading

    setPending(true);
    setError(undefined);

    // Shows the bank's verification screen (3-D Secure) in a pop-up if the
    // card needs it. Cards never redirect; return_url is only a fallback.
    const result = await stripe.confirmSetup({
      elements,
      redirect: "if_required",
      confirmParams: { return_url: `${window.location.origin}/account` },
    });

    if (result.error) {
      setPending(false);
      // Stripe's messages are written for customers (e.g. "Your card was
      // declined.").
      setError(result.error.message ?? "Your card couldn't be saved.");
      return;
    }

    const confirmed = await api<Booking>(
      `/bookings/${bookingId}/confirm-card`,
      {
        method: "POST",
      },
    );
    setPending(false);

    if (!confirmed.ok) {
      setError(confirmed.message);
    } else if (confirmed.data.status === "PENDING_PAYMENT") {
      // The bank is still confirming the card; Stripe tells our server when
      // it's done.
      setStillConfirming(true);
    } else {
      onSaved(confirmed.data);
    }
  };

  if (stillConfirming) {
    return (
      <FormAlert tone="info">
        Your bank is still confirming your card. Your ride request will go
        through as soon as it does; you can check it under My Account.
      </FormAlert>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {error && <FormAlert>{error}</FormAlert>}
      <PaymentElement options={{ layout: "tabs" }} />
      <Button
        type="submit"
        size="lg"
        disabled={!stripe || pending}
        className="w-full"
      >
        {pending ? "Saving your card…" : "Save card and request ride"}
      </Button>
      <p className="text-center text-sm text-muted">
        Your card is saved securely with Stripe. Nothing is charged until after
        the ride.
      </p>
    </form>
  );
};

export default StripeCardForm;
