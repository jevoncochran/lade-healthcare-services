"use client";

import { useState, type FormEvent, type ReactNode } from "react";
import Button from "@/components/Button";
import FormAlert from "@/components/account/FormAlert";
import Field, { describedBy } from "@/components/form/Field";
import { api, type Staff } from "@/lib/api";
import { formatDateTime, formatMoney } from "@/lib/booking";
import { chargeFailureText, type StaffBooking } from "@/lib/staff";

type Panel = "cancel" | "noShow" | "complete" | null;

const SUCCESS: Record<string, string> = {
  confirm: "Ride confirmed.",
  cancel: "Booking cancelled.",
  "no-show": "Marked as a no-show.",
  complete: "Ride completed.",
  "retry-charge": "Charge sent again.",
};

// A whole number of minutes, or undefined when left blank.
const minutesFrom = (form: FormData, name: string) => {
  const text = String(form.get(name) ?? "").trim();
  return text === "" ? undefined : Number(text);
};

const validMinutes = (value: number | undefined) =>
  value === undefined ||
  (Number.isInteger(value) && value >= 0 && value <= 720);

const PanelBox = ({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) => (
  <div className="rounded-card border border-line bg-surface p-5 sm:p-6">
    <h3 className="font-heading text-lg font-bold text-primary">{title}</h3>
    <div className="mt-3 space-y-4">{children}</div>
  </div>
);

const WaitField = ({
  name,
  label,
  error,
}: {
  name: string;
  label: string;
  error?: string;
}) => {
  const hint =
    "Leave blank if there was no wait. The first 15 minutes are free.";
  return (
    <Field name={name} label={label} hint={hint} error={error}>
      <input
        id={name}
        name={name}
        type="number"
        inputMode="numeric"
        min={0}
        max={720}
        step={1}
        className="form-input max-w-40"
        aria-invalid={!!error}
        aria-describedby={describedBy(name, hint, error)}
      />
    </Field>
  );
};

// The buttons staff use to move a booking along: confirm, cancel, no-show,
// complete, and retrying a declined charge. The API decides what's allowed
// (booking.actions) and re-checks everything; each action returns the
// updated booking.
const BookingActions = ({
  booking,
  staff,
  onUpdated,
  onSignedOut,
}: {
  booking: StaffBooking;
  staff: Staff;
  onUpdated: (booking: StaffBooking) => void;
  onSignedOut: () => void;
}) => {
  const [panel, setPanel] = useState<Panel>(null);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string>();
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [done, setDone] = useState<string>();
  const [returnRidden, setReturnRidden] = useState<"COMPLETED" | "CANCELLED">();
  const [waiveFee, setWaiveFee] = useState(false);

  const { actions } = booking;
  const returnLeg = booking.legs.find((leg) => leg.direction === "RETURN");
  const isAdmin = staff.role === "ADMIN";

  const open = (next: Panel) => {
    setPanel(next);
    setError(undefined);
    setFieldErrors({});
    setDone(undefined);
    setReturnRidden(undefined);
    setWaiveFee(false);
  };

  const run = async (action: string, body: object = {}) => {
    setPending(true);
    setError(undefined);
    setDone(undefined);
    const result = await api<StaffBooking>(
      `/staff/bookings/${booking.id}/${action}`,
      { method: "POST", body },
    );
    setPending(false);
    if (result.ok) {
      setPanel(null);
      setDone(SUCCESS[action]);
      onUpdated(result.data);
    } else if (result.status === 401) {
      onSignedOut();
    } else {
      setError(result.message);
    }
  };

  const submitCancel = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const reason = String(form.get("reason") ?? "").trim();
    const waiveReason = String(form.get("waiveReason") ?? "").trim();
    const errors: Record<string, string> = {};
    if (!reason) errors.reason = "Enter why the ride is cancelled.";
    if (waiveFee && !waiveReason)
      errors.waiveReason = "Enter why the fee is waived.";
    setFieldErrors(errors);
    if (Object.keys(errors).length > 0) return;
    void run(
      "cancel",
      waiveFee ? { reason, waiveFee: true, waiveReason } : { reason },
    );
  };

  const submitComplete = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const outboundWaitMinutes = minutesFrom(form, "outboundWait");
    const returnWaitMinutes =
      returnRidden === "COMPLETED"
        ? minutesFrom(form, "returnWait")
        : undefined;
    const errors: Record<string, string> = {};
    if (!validMinutes(outboundWaitMinutes)) {
      errors.outboundWait = "Enter whole minutes, 0 to 720.";
    }
    if (!validMinutes(returnWaitMinutes)) {
      errors.returnWait = "Enter whole minutes, 0 to 720.";
    }
    if (returnLeg && !returnRidden) {
      errors.returnLeg = "Say whether the ride back happened.";
    }
    setFieldErrors(errors);
    if (Object.keys(errors).length > 0) return;
    void run("complete", {
      outboundWaitMinutes,
      ...(returnLeg ? { returnLeg: returnRidden, returnWaitMinutes } : {}),
    });
  };

  const anything =
    actions.confirm ||
    actions.cancel.allowed ||
    actions.complete.availableAt ||
    actions.retryCharge;
  if (!anything && !done) return null;

  const failed = booking.payment?.status === "FAILED";
  const isRequest = booking.status === "REQUESTED";

  return (
    <section className="card space-y-5 p-6 sm:p-8" aria-label="Actions">
      <h2 className="card-title">Actions</h2>

      {done && <FormAlert tone="info">{done}</FormAlert>}

      {actions.retryCharge && booking.payment && (
        <div className="space-y-3">
          <FormAlert>
            {failed
              ? `${chargeFailureText(booking.payment.failureCode)} ${formatMoney(booking.payment.amountCents)} is still owed.`
              : `We sent a charge of ${formatMoney(booking.payment.amountCents)} but didn't hear back. Trying again won't charge twice.`}
          </FormAlert>
          {failed && (
            <p className="text-sm text-muted">
              Call the customer to sort it out with their bank, then try the
              charge again.
            </p>
          )}
          <Button onClick={() => void run("retry-charge")} disabled={pending}>
            {pending ? "Charging…" : "Try the charge again"}
          </Button>
        </div>
      )}

      {error && <FormAlert>{error}</FormAlert>}

      {panel === null && (
        <div className="flex flex-wrap gap-3">
          {actions.confirm && (
            <Button onClick={() => void run("confirm")} disabled={pending}>
              {pending ? "Confirming…" : "Confirm ride"}
            </Button>
          )}
          {actions.complete.availableAt && (
            <Button
              onClick={() => open("complete")}
              disabled={!actions.complete.allowed}
            >
              Complete ride
            </Button>
          )}
          {actions.noShow.availableAt && (
            <Button
              variant="outline"
              onClick={() => open("noShow")}
              disabled={!actions.noShow.allowed}
            >
              Mark no-show
            </Button>
          )}
          {actions.cancel.allowed && (
            <Button variant="outline" onClick={() => open("cancel")}>
              {isRequest ? "Decline request" : "Cancel ride"}
            </Button>
          )}
        </div>
      )}

      {panel === null && booking.status === "CONFIRMED" && (
        <p className="text-sm text-muted">
          {!actions.complete.allowed &&
            actions.complete.availableAt &&
            `Completing opens at the pickup time (${formatDateTime(actions.complete.availableAt)}). `}
          {!actions.noShow.allowed &&
            actions.noShow.availableAt &&
            `A no-show can be marked from ${formatDateTime(actions.noShow.availableAt)}, after the 15-minute grace period.`}
        </p>
      )}

      {panel === "cancel" && (
        <PanelBox
          title={isRequest ? "Decline this request" : "Cancel this ride"}
        >
          <form onSubmit={submitCancel} noValidate className="space-y-4">
            {actions.cancel.feeCents !== null ? (
              <FormAlert tone="info">
                It&apos;s less than 2 hours before pickup, so cancelling charges
                the late-cancellation fee of{" "}
                {formatMoney(actions.cancel.feeCents)} to the card on file.
              </FormAlert>
            ) : (
              <p className="text-sm text-muted">
                No fee: the customer isn&apos;t charged.
              </p>
            )}
            <Field
              name="reason"
              label="Reason"
              required
              hint="Saved with the booking's history."
              error={fieldErrors.reason}
            >
              <textarea
                id="reason"
                name="reason"
                rows={3}
                maxLength={500}
                className="form-input"
                aria-invalid={!!fieldErrors.reason}
                aria-describedby={describedBy(
                  "reason",
                  "Saved with the booking's history.",
                  fieldErrors.reason,
                )}
              />
            </Field>
            {isAdmin && actions.cancel.feeCents !== null && (
              <>
                <label className="flex items-start gap-3 text-ink">
                  <input
                    type="checkbox"
                    checked={waiveFee}
                    onChange={(event) => setWaiveFee(event.target.checked)}
                    className="mt-1 h-5 w-5 accent-secondary"
                  />
                  <span>Waive the fee (administrators only)</span>
                </label>
                {waiveFee && (
                  <Field
                    name="waiveReason"
                    label="Why the fee is waived"
                    required
                    error={fieldErrors.waiveReason}
                  >
                    <textarea
                      id="waiveReason"
                      name="waiveReason"
                      rows={2}
                      maxLength={500}
                      className="form-input"
                      aria-invalid={!!fieldErrors.waiveReason}
                      aria-describedby={describedBy(
                        "waiveReason",
                        undefined,
                        fieldErrors.waiveReason,
                      )}
                    />
                  </Field>
                )}
              </>
            )}
            <div className="flex flex-wrap gap-3">
              <Button type="submit" disabled={pending}>
                {pending
                  ? "Cancelling…"
                  : isRequest
                    ? "Decline request"
                    : "Cancel ride"}
              </Button>
              <Button variant="outline" onClick={() => open(null)}>
                Keep it
              </Button>
            </div>
          </form>
        </PanelBox>
      )}

      {panel === "noShow" && (
        <PanelBox title="Mark as a no-show">
          <p className="text-ink">
            The rider wasn&apos;t at the pickup. This charges the no-show fee of{" "}
            {formatMoney(actions.noShow.feeCents)} to the card on file
            {returnLeg ? " and cancels the ride back" : ""}.
          </p>
          <div className="flex flex-wrap gap-3">
            <Button onClick={() => void run("no-show")} disabled={pending}>
              {pending ? "Saving…" : "Mark no-show and charge"}
            </Button>
            <Button variant="outline" onClick={() => open(null)}>
              Go back
            </Button>
          </div>
        </PanelBox>
      )}

      {panel === "complete" && (
        <PanelBox title="Complete this ride">
          <form onSubmit={submitComplete} noValidate className="space-y-5">
            <WaitField
              name="outboundWait"
              label="Minutes the driver waited (ride there)"
              error={fieldErrors.outboundWait}
            />
            {returnLeg && (
              <fieldset>
                <legend className="form-label">
                  Did the ride back happen?
                </legend>
                <div className="mt-2 space-y-2">
                  {(
                    [
                      ["COMPLETED", "Yes"],
                      ["CANCELLED", "No, it wasn't needed (not charged)"],
                    ] as const
                  ).map(([value, label]) => (
                    <label
                      key={value}
                      className="flex items-center gap-3 text-ink"
                    >
                      <input
                        type="radio"
                        name="returnLeg"
                        value={value}
                        checked={returnRidden === value}
                        onChange={() => setReturnRidden(value)}
                        className="h-5 w-5 accent-secondary"
                      />
                      {label}
                    </label>
                  ))}
                </div>
                {fieldErrors.returnLeg && (
                  <p className="form-error">{fieldErrors.returnLeg}</p>
                )}
              </fieldset>
            )}
            {returnRidden === "COMPLETED" && (
              <WaitField
                name="returnWait"
                label="Minutes the driver waited (ride back)"
                error={fieldErrors.returnWait}
              />
            )}
            <p className="text-sm text-muted">
              Completing charges the card on file: fare, mileage and any waiting
              time.
            </p>
            <div className="flex flex-wrap gap-3">
              <Button type="submit" disabled={pending}>
                {pending ? "Charging…" : "Complete and charge"}
              </Button>
              <Button variant="outline" onClick={() => open(null)}>
                Go back
              </Button>
            </div>
          </form>
        </PanelBox>
      )}
    </section>
  );
};

export default BookingActions;
