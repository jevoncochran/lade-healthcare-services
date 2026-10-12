"use client";

import { useEffect, useState, type ReactNode } from "react";
import Button from "@/components/Button";
import FormAlert from "@/components/account/FormAlert";
import SuccessMessage from "@/components/account/SuccessMessage";
import { PhoneIcon } from "@/components/Icons";
import { api } from "@/lib/api";
import {
  careLevelOptions,
  formatAddress,
  formatDateTime,
  formatMoney,
  labelOf,
  relationshipOptions,
  tampaDateTimeToIso,
  tripKindOptions,
  tripTypeOptions,
  type Address,
  type Booking,
  type CreatedBooking,
  type Quote,
} from "@/lib/booking";
import { site } from "@/lib/site";
import StripeCardForm from "./StripeCardForm";
import TripForm, { emptyDraft, TRIP_STEPS, type TripDraft } from "./TripForm";

type Step =
  | {
      name: "details";
      formStep?: number;
      message?: string;
      callForQuote?: string;
    }
  | { name: "review"; quote: Extract<Quote, { status: "priced" }>; key: string }
  | { name: "card"; created: CreatedBooking }
  | { name: "done"; booking: Booking };

const stepNamed = (name: (typeof TRIP_STEPS)[number]) => TRIP_STEPS.indexOf(name);

// Which form step to reopen when the price check says no.
const STEP_FOR_REASON: Record<string, number> = {
  SHORT_NOTICE: stepNamed("When"),
  LONG_DISTANCE: stepNamed("Addresses"),
  OUT_OF_STATE: stepNamed("Addresses"),
  NO_RATE: stepNamed("Rider"), // the care level is chosen there
};

// Optional fields are left out rather than sent empty.
const address = ({ line2, ...rest }: Address): Address =>
  line2 ? { ...rest, line2 } : rest;

const quoteBody = (draft: TripDraft) => ({
  careLevel: draft.careLevel,
  tripKind: draft.tripKind,
  pickup: address(draft.pickup),
  dropoff: address(draft.dropoff),
  pickupAt: tampaDateTimeToIso(draft.date, draft.pickupTime),
});

const bookingBody = (draft: TripDraft, idempotencyKey: string) => {
  const someoneElse = draft.relationship !== "SELF";
  return {
    ...quoteBody(draft),
    idempotencyKey,
    tripType: draft.tripType,
    requesterRelationship: draft.relationship,
    ...(someoneElse && {
      riderFirstName: draft.riderFirstName,
      riderLastName: draft.riderLastName,
    }),
    ...(someoneElse && draft.riderPhone && { riderPhone: draft.riderPhone }),
    ...(draft.appointmentTime && {
      appointmentAt: tampaDateTimeToIso(draft.date, draft.appointmentTime),
    }),
    ...(draft.tripKind === "ROUND_TRIP" &&
      (draft.returnMode === "call"
        ? { returnWillCall: true }
        : { returnPickupAt: tampaDateTimeToIso(draft.returnDate, draft.returnTime) })),
    ...(draft.tripKind === "WAIT_AND_RETURN" &&
      draft.expectedWaitMinutes && {
        expectedWaitMinutes: Number(draft.expectedWaitMinutes),
      }),
    companionCount: Number(draft.companionCount),
    ...(draft.mobilityNotes && { mobilityNotes: draft.mobilityNotes }),
    ...(draft.instructions && { instructions: draft.instructions }),
    acceptTerms: true,
  };
};

// Booking in four steps: trip details → price & review → card → done.
// The price shown comes from the API, and the API prices the booking again
// itself when it's created.
const BookingFlow = () => {
  const [draft, setDraft] = useState<TripDraft>(emptyDraft);
  const [step, setStep] = useState<Step>({ name: "details" });
  const [pending, setPending] = useState(false);
  // Bumped after every price check, so the trip form reopens fresh on the
  // right step even when the same answer comes back twice.
  const [formVisit, setFormVisit] = useState(0);

  // Each step has a different height; start every step at the top.
  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [step]);

  const getQuote = async (next: TripDraft) => {
    setDraft(next);
    setPending(true);
    const result = await api<Quote>("/quotes", { body: quoteBody(next) });
    setPending(false);
    setFormVisit((visit) => visit + 1);

    if (!result.ok) {
      // e.g. an address the map can't find: reopen the addresses step.
      setStep({
        name: "details",
        message: result.message,
        formStep: /address/i.test(result.message)
          ? stepNamed("Addresses")
          : TRIP_STEPS.length - 1,
      });
    } else if (result.data.status === "call_for_quote") {
      setStep({
        name: "details",
        callForQuote: result.data.message,
        formStep: STEP_FOR_REASON[result.data.reason] ?? TRIP_STEPS.length - 1,
      });
    } else {
      // A fresh key per review, so resubmitting this review never books twice.
      setStep({ name: "review", quote: result.data, key: crypto.randomUUID() });
    }
  };

  if (step.name === "details") {
    return (
      <TripForm
        key={formVisit}
        initial={draft}
        initialStep={step.formStep}
        pending={pending}
        onSubmit={getQuote}
        message={
          step.callForQuote ? (
            <CallUs message={step.callForQuote} />
          ) : step.message ? (
            <FormAlert>{step.message}</FormAlert>
          ) : undefined
        }
      />
    );
  }

  if (step.name === "review") {
    return (
      <Review
        draft={draft}
        quote={step.quote}
        idempotencyKey={step.key}
        onEdit={() => setStep({ name: "details", formStep: 0 })}
        onBooked={(created) =>
          setStep(
            created.payment
              ? { name: "card", created }
              : { name: "done", booking: created.booking },
          )
        }
      />
    );
  }

  if (step.name === "card") {
    return (
      <CardStep
        created={step.created}
        onSaved={(booking) => setStep({ name: "done", booking })}
      />
    );
  }

  return (
    <div className="card p-6 sm:p-10">
      <SuccessMessage title="Your ride is requested">
        <p>
          Your booking number is{" "}
          <strong className="text-ink">{step.booking.reference}</strong>. We&apos;ll
          confirm the ride with you before the pickup.
        </p>
        <div className="flex flex-col justify-center gap-3 pt-2 sm:flex-row">
          <Button href="/account">View my rides</Button>
          <Button
            variant="outline"
            onClick={() => {
              setDraft(emptyDraft);
              setStep({ name: "details" });
            }}
          >
            Book another ride
          </Button>
        </div>
      </SuccessMessage>
    </div>
  );
};

// ---------- Steps ----------

const CallUs = ({ message }: { message: string }) => (
  <div role="alert" className="rounded-card border border-secondary/30 bg-secondary/5 p-5">
    <p className="font-medium text-primary">{message}</p>
    <Button href={site.phoneHref} icon={PhoneIcon} className="mt-4">
      Call {site.phone}
    </Button>
  </div>
);

const Review = ({
  draft,
  quote,
  idempotencyKey,
  onEdit,
  onBooked,
}: {
  draft: TripDraft;
  quote: Extract<Quote, { status: "priced" }>;
  idempotencyKey: string;
  onEdit: () => void;
  onBooked: (created: CreatedBooking) => void;
}) => {
  const [accepted, setAccepted] = useState(false);
  const [error, setError] = useState<string>();
  const [pending, setPending] = useState(false);

  const book = async () => {
    if (!accepted) {
      setError("Please agree to the booking terms.");
      return;
    }
    setError(undefined);
    setPending(true);
    const result = await api<CreatedBooking>("/bookings", {
      body: bookingBody(draft, idempotencyKey),
    });
    setPending(false);
    if (result.ok) onBooked(result.data);
    else setError(result.message);
  };

  const pickupAt = tampaDateTimeToIso(draft.date, draft.pickupTime);

  return (
    <div className="space-y-6">
      <div className="card p-6 sm:p-8">
        <div className="flex items-start justify-between gap-4">
          <h2 className="card-title">Your trip</h2>
          <Button variant="link" onClick={onEdit}>
            Edit
          </Button>
        </div>
        <dl className="mt-4 divide-y divide-line">
          <Row label="For">
            {draft.relationship === "SELF"
              ? "Me"
              : `${draft.riderFirstName} ${draft.riderLastName} (${labelOf(relationshipOptions, draft.relationship).toLowerCase()})`}
          </Row>
          <Row label="Care">{labelOf(careLevelOptions, draft.careLevel)}</Row>
          <Row label="Trip">
            {labelOf(tripKindOptions, draft.tripKind)} ·{" "}
            {labelOf(tripTypeOptions, draft.tripType)}
          </Row>
          <Row label="Pickup">
            {formatDateTime(pickupAt)}
            <br />
            {formatAddress(draft.pickup)}
          </Row>
          <Row label="Drop-off">
            {draft.appointmentTime &&
              `Appointment ${formatDateTime(tampaDateTimeToIso(draft.date, draft.appointmentTime))}`}
            {draft.appointmentTime && <br />}
            {formatAddress(draft.dropoff)}
          </Row>
          {draft.tripKind === "ROUND_TRIP" && (
            <Row label="Ride back">
              {draft.returnMode === "call"
                ? "You'll call when ready"
                : formatDateTime(tampaDateTimeToIso(draft.returnDate, draft.returnTime))}
            </Row>
          )}
          {draft.tripKind === "WAIT_AND_RETURN" && (
            <Row label="Ride back">The driver waits and brings you back</Row>
          )}
        </dl>
      </div>

      <div className="card p-6 sm:p-8">
        <h2 className="card-title">Price</h2>
        <dl className="mt-4 divide-y divide-line">
          {quote.lines.map((line) => (
            <div key={line.type} className="flex justify-between gap-4 py-3">
              <dt className="text-muted">{line.description}</dt>
              <dd className="font-medium text-ink">{formatMoney(line.amountCents)}</dd>
            </div>
          ))}
          <div className="flex justify-between gap-4 py-3">
            <dt className="font-heading font-semibold text-primary">Total</dt>
            <dd className="font-heading text-xl font-bold text-primary">
              {formatMoney(quote.totalCents)}
            </dd>
          </div>
        </dl>
        {quote.distanceIsEstimate && (
          <div className="mt-4">
            {/* TEST MODE: disappears once real route distances are connected. */}
            <FormAlert tone="info">
              Test mode: the distance is an estimate from the ZIP codes, not
              the real route, so this price is approximate.
            </FormAlert>
          </div>
        )}
        {quote.notes.map((note) => (
          <p key={note} className="mt-2 text-sm text-muted">
            {note}
          </p>
        ))}
      </div>

      <div className="card space-y-5 p-6 sm:p-8">
        <label className="flex items-start gap-3">
          <input
            type="checkbox"
            checked={accepted}
            onChange={(event) => setAccepted(event.target.checked)}
            className="mt-1 h-5 w-5 shrink-0 accent-accent"
          />
          {/* TODO (launch blocker): link the booking terms once Lade provides them. */}
          <span className="text-ink">
            I agree to the booking terms. My card is saved now and charged after
            the ride. It may also be charged for waiting time, a no-show, or a
            cancellation less than 2 hours before pickup.
          </span>
        </label>
        {/* Next to the button, where the customer is looking. */}
        {error && <FormAlert>{error}</FormAlert>}
        <Button size="lg" onClick={book} disabled={pending} className="w-full">
          {pending ? "Booking…" : "Book and add a card"}
        </Button>
      </div>
    </div>
  );
};

const CardStep = ({
  created,
  onSaved,
}: {
  created: CreatedBooking;
  onSaved: (booking: Booking) => void;
}) => {
  const [error, setError] = useState<string>();
  const [pending, setPending] = useState(false);
  const { booking, payment } = created;

  // Fake payment gateway (local development without Stripe): no card form,
  // the API just reports the card as saved.
  const continueWithoutCard = async () => {
    setPending(true);
    const result = await api<Booking>(`/bookings/${booking.id}/confirm-card`, {
      method: "POST",
    });
    setPending(false);
    if (result.ok) onSaved(result.data);
    else setError(result.message);
  };

  return (
    <div className="card space-y-5 p-6 sm:p-8">
      <h2 className="card-title">Add a card</h2>
      <p className="text-muted">
        Booking {booking.reference} · {formatMoney(booking.price.totalCents)}.
        Your card is saved now and charged after the ride.
      </p>

      {payment?.provider === "stripe" ? (
        <StripeCardForm
          bookingId={booking.id}
          clientSecret={payment.clientSecret}
          onSaved={onSaved}
        />
      ) : (
        <>
          {error && <FormAlert>{error}</FormAlert>}
          {/* DEVELOPMENT ONLY: the API is using its fake payment gateway. */}
          <FormAlert tone="info">
            Test mode: card payments aren&apos;t connected on this server. No
            card is needed and nothing is charged.
          </FormAlert>
          <Button
            size="lg"
            onClick={continueWithoutCard}
            disabled={pending}
            className="w-full"
          >
            {pending ? "Saving…" : "Continue without a card"}
          </Button>
        </>
      )}
    </div>
  );
};

const Row = ({ label, children }: { label: string; children: ReactNode }) => (
  <div className="grid gap-1 py-3 sm:grid-cols-[110px_1fr]">
    <dt className="form-label">{label}</dt>
    <dd className="text-ink">{children}</dd>
  </div>
);

export default BookingFlow;
