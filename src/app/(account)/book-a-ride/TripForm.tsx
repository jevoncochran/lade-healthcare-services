"use client";

import { useEffect, useRef, useState, type FormEvent, type ReactNode } from "react";
import Button from "@/components/Button";
import FormAlert from "@/components/account/FormAlert";
import Field, { describedBy } from "@/components/form/Field";
import InputField from "@/components/form/InputField";
import StepProgress from "@/components/form/StepProgress";
import AddressAutocomplete from "./AddressAutocomplete";
import { checkPhone, compactErrors, type FieldErrors } from "@/lib/account";
import { phoneInputProps } from "@/lib/phone";
import {
  careLevelOptions,
  relationshipOptions,
  tomorrowInTampa,
  tripKindOptions,
  tripTypeOptions,
  type Address,
  type CareLevel,
  type Relationship,
  type TripKind,
  type TripType,
} from "@/lib/booking";

// Everything the customer enters about the trip. Kept by the parent so
// "Edit trip" on the review step brings the same answers back.
export type TripDraft = {
  relationship: Relationship;
  riderFirstName: string;
  riderLastName: string;
  riderPhone: string;
  careLevel: CareLevel;
  tripType: TripType;
  tripKind: TripKind;
  pickup: Address;
  dropoff: Address;
  date: string; // YYYY-MM-DD, Tampa
  pickupTime: string; // HH:MM, Tampa
  appointmentTime: string;
  returnMode: "time" | "call";
  returnDate: string;
  returnTime: string;
  expectedWaitMinutes: string;
  companionCount: string;
  mobilityNotes: string;
  instructions: string;
};

const emptyAddress: Address = { line1: "", line2: "", city: "", state: "FL", zip: "" };

export const emptyDraft: TripDraft = {
  relationship: "SELF",
  riderFirstName: "",
  riderLastName: "",
  riderPhone: "",
  careLevel: "WHEELCHAIR",
  tripType: "MEDICAL_APPOINTMENT",
  tripKind: "ONE_WAY",
  pickup: emptyAddress,
  dropoff: emptyAddress,
  date: "",
  pickupTime: "",
  appointmentTime: "",
  returnMode: "time",
  returnDate: "",
  returnTime: "",
  expectedWaitMinutes: "",
  companionCount: "0",
  mobilityNotes: "",
  instructions: "",
};

const text = (form: FormData, key: string) => String(form.get(key) ?? "").trim();

const readAddress = (form: FormData, prefix: string): Address => ({
  line1: text(form, `${prefix}Line1`),
  line2: text(form, `${prefix}Line2`),
  city: text(form, `${prefix}City`),
  state: text(form, `${prefix}State`).toUpperCase(),
  zip: text(form, `${prefix}Zip`),
});

const checkAddress = (address: Address, prefix: string): FieldErrors => ({
  [`${prefix}Line1`]: address.line1 ? undefined : "Enter the street address.",
  [`${prefix}City`]: address.city ? undefined : "Enter the city.",
  [`${prefix}State`]: /^[A-Z]{2}$/.test(address.state)
    ? undefined
    : "Two letters, e.g. FL.",
  [`${prefix}Zip`]: /^\d{5}$/.test(address.zip) ? undefined : "5-digit ZIP code.",
});

// The trip form is a wizard: one topic per screen. Every step stays in the
// page (inactive ones are hidden), so going back and forth never loses
// answers and the whole trip is read from the form at the end.
export const TRIP_STEPS = ["Rider", "Trip", "Addresses", "When", "Details"] as const;
const LAST_STEP = TRIP_STEPS.length - 1;

const readDraft = (
  form: FormData,
  live: Pick<TripDraft, "relationship" | "tripKind" | "returnMode">,
): TripDraft => ({
  ...live,
  riderFirstName: text(form, "riderFirstName"),
  riderLastName: text(form, "riderLastName"),
  riderPhone: text(form, "riderPhone"),
  careLevel: text(form, "careLevel") as CareLevel,
  tripType: text(form, "tripType") as TripType,
  pickup: readAddress(form, "pickup"),
  dropoff: readAddress(form, "dropoff"),
  date: text(form, "date"),
  pickupTime: text(form, "pickupTime"),
  appointmentTime: text(form, "appointmentTime"),
  returnDate: text(form, "returnDate"),
  returnTime: text(form, "returnTime"),
  expectedWaitMinutes: text(form, "expectedWaitMinutes"),
  companionCount: text(form, "companionCount") || "0",
  mobilityNotes: text(form, "mobilityNotes"),
  instructions: text(form, "instructions"),
});

// Problems on one step only, so "Next" points at what's on screen.
const errorsForStep = (step: number, draft: TripDraft): FieldErrors => {
  const someoneElse = draft.relationship !== "SELF";
  const roundTripAtTime =
    draft.tripKind === "ROUND_TRIP" && draft.returnMode === "time";

  switch (step) {
    case 0:
      return compactErrors({
        riderFirstName:
          someoneElse && !draft.riderFirstName
            ? "Enter the rider's first name."
            : undefined,
        riderLastName:
          someoneElse && !draft.riderLastName
            ? "Enter the rider's last name."
            : undefined,
        riderPhone:
          someoneElse && draft.riderPhone ? checkPhone(draft.riderPhone) : undefined,
      });
    case 2:
      return compactErrors({
        ...checkAddress(draft.pickup, "pickup"),
        ...checkAddress(draft.dropoff, "dropoff"),
      });
    case 3:
      return compactErrors({
        date: draft.date ? undefined : "Choose the date.",
        pickupTime: draft.pickupTime ? undefined : "Choose the pickup time.",
        appointmentTime:
          draft.appointmentTime &&
          draft.pickupTime &&
          draft.appointmentTime < draft.pickupTime
            ? "The appointment should be after the pickup time."
            : undefined,
        returnDate:
          roundTripAtTime && !draft.returnDate
            ? "Choose the date for the ride back."
            : undefined,
        returnTime:
          roundTripAtTime && !draft.returnTime
            ? "Choose the time for the ride back."
            : undefined,
      });
    default:
      return {};
  }
};

const TripForm = ({
  initial,
  initialStep = 0,
  pending,
  message,
  onSubmit,
}: {
  initial: TripDraft;
  // Where to open, e.g. the "When" step after a "needs 24 hours" refusal.
  initialStep?: number;
  pending: boolean;
  message?: ReactNode;
  onSubmit: (draft: TripDraft) => void;
}) => {
  const [step, setStep] = useState(initialStep);
  // These change which other fields appear, so they're live state; the rest
  // is read from the form.
  const [relationship, setRelationship] = useState(initial.relationship);
  const [tripKind, setTripKind] = useState(initial.tripKind);
  const [returnMode, setReturnMode] = useState(initial.returnMode);
  const [errors, setErrors] = useState<FieldErrors>({});
  const formRef = useRef<HTMLFormElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const firstRender = useRef(true);

  // New step: back to the top, and move focus to its heading so screen
  // readers announce it. (Not on first load: the page heading comes first.)
  useEffect(() => {
    window.scrollTo({ top: 0 });
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    headingRef.current?.focus();
  }, [step]);

  const goTo = (next: number) => {
    setErrors({});
    setStep(next);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const draft = readDraft(new FormData(event.currentTarget), {
      relationship,
      tripKind,
      returnMode,
    });

    if (step < LAST_STEP) {
      const stepErrors = errorsForStep(step, draft);
      setErrors(stepErrors);
      if (Object.keys(stepErrors).length === 0) goTo(step + 1);
      else window.scrollTo({ top: 0 });
      return;
    }

    // Last step: check everything once more and open the first step with a
    // problem (e.g. an answer that changed after going back).
    for (let index = 0; index <= LAST_STEP; index++) {
      const stepErrors = errorsForStep(index, draft);
      if (Object.keys(stepErrors).length > 0) {
        setStep(index);
        setErrors(stepErrors);
        return;
      }
    }
    onSubmit(draft);
  };

  const hasErrors = Object.keys(errors).length > 0;

  return (
    <form ref={formRef} onSubmit={handleSubmit} noValidate className="space-y-8">
      <StepProgress steps={TRIP_STEPS} current={step} label="Booking steps" />

      <h2 ref={headingRef} tabIndex={-1} className="sr-only">
        Step {step + 1} of {TRIP_STEPS.length}: {TRIP_STEPS[step]}
      </h2>

      {hasErrors && <FormAlert>Please fix the highlighted fields.</FormAlert>}
      {message}

      {/* Step 1: Rider */}
      <div hidden={step !== 0} className="space-y-10">
        <Section title="Who is the ride for?">
          <div className="grid gap-3">
            {relationshipOptions.map((option) => (
              <Choice
                key={option.value}
                name="relationship"
                value={option.value}
                checked={relationship === option.value}
                onChange={() => setRelationship(option.value)}
                label={option.label}
              />
            ))}
          </div>
          {relationship !== "SELF" && (
            <div className="grid gap-6 sm:grid-cols-2">
              <InputField
                name="riderFirstName"
                label="Rider's first name"
                required
                defaultValue={initial.riderFirstName}
                error={errors.riderFirstName}
              />
              <InputField
                name="riderLastName"
                label="Rider's last name"
                required
                defaultValue={initial.riderLastName}
                error={errors.riderLastName}
              />
              <InputField
                name="riderPhone"
                label="Rider's phone"
                {...phoneInputProps}
                hint="So the driver can reach them on the day."
                defaultValue={initial.riderPhone}
                error={errors.riderPhone}
                className="sm:col-span-2"
              />
            </div>
          )}
        </Section>

        <Section title="Level of care">
          <div className="grid gap-3 sm:grid-cols-2">
            {careLevelOptions.map((option) => (
              <Choice
                key={option.value}
                name="careLevel"
                value={option.value}
                defaultChecked={initial.careLevel === option.value}
                label={option.label}
                description={option.description}
              />
            ))}
          </div>
        </Section>
      </div>

      {/* Step 2: Trip */}
      <div hidden={step !== 1} className="space-y-10">
        <Section title="What is the trip for?">
          <div className="grid gap-3">
            {tripTypeOptions.map((option) => (
              <Choice
                key={option.value}
                name="tripType"
                value={option.value}
                defaultChecked={initial.tripType === option.value}
                label={option.label}
              />
            ))}
          </div>
        </Section>
        <Section title="Type of trip">
          <div className="grid gap-3">
            {tripKindOptions.map((option) => (
              <Choice
                key={option.value}
                name="tripKind"
                value={option.value}
                checked={tripKind === option.value}
                onChange={() => setTripKind(option.value)}
                label={option.label}
                description={option.description}
              />
            ))}
          </div>
        </Section>
      </div>

      {/* Step 3: Addresses */}
      <div hidden={step !== 2} className="space-y-10">
        <AddressFields
          prefix="pickup"
          title="Pickup address"
          initial={initial.pickup}
          errors={errors}
        />
        <AddressFields
          prefix="dropoff"
          title="Drop-off address"
          initial={initial.dropoff}
          errors={errors}
        />
      </div>

      {/* Step 4: When */}
      <div hidden={step !== 3} className="space-y-10">
        <Section
          title="When"
          intro="Times are Tampa time. Online bookings need at least 24 hours' notice."
        >
          <div className="grid gap-6 sm:grid-cols-3">
            <InputField
              name="date"
              label="Date"
              type="date"
              min={tomorrowInTampa()}
              required
              defaultValue={initial.date}
              error={errors.date}
            />
            <InputField
              name="pickupTime"
              label="Pickup time"
              type="time"
              required
              defaultValue={initial.pickupTime}
              error={errors.pickupTime}
            />
            <InputField
              name="appointmentTime"
              label="Appointment time"
              type="time"
              defaultValue={initial.appointmentTime}
              error={errors.appointmentTime}
            />
          </div>
        </Section>

        {tripKind === "ROUND_TRIP" && (
          <Section title="The ride back">
            <div className="grid gap-3 sm:grid-cols-2">
              <Choice
                name="returnMode"
                value="time"
                checked={returnMode === "time"}
                onChange={() => setReturnMode("time")}
                label="At a set time"
              />
              <Choice
                name="returnMode"
                value="call"
                checked={returnMode === "call"}
                onChange={() => setReturnMode("call")}
                label="I'll call when ready"
                description="Good for discharges and appointments that may run long."
              />
            </div>
            {returnMode === "time" && (
              <div className="grid gap-6 sm:grid-cols-2">
                <InputField
                  name="returnDate"
                  label="Return date"
                  type="date"
                  min={tomorrowInTampa()}
                  required
                  defaultValue={initial.returnDate || initial.date}
                  error={errors.returnDate}
                />
                <InputField
                  name="returnTime"
                  label="Return pickup time"
                  type="time"
                  required
                  defaultValue={initial.returnTime}
                  error={errors.returnTime}
                />
              </div>
            )}
          </Section>
        )}

        {tripKind === "WAIT_AND_RETURN" && (
          <Section title="Waiting">
            <Field
              name="expectedWaitMinutes"
              label="About how long is the appointment?"
              hint="The first 15 minutes of waiting are free; after that it's $15 per 15 minutes."
            >
              <select
                id="expectedWaitMinutes"
                name="expectedWaitMinutes"
                defaultValue={initial.expectedWaitMinutes}
                className="form-input"
                aria-describedby={describedBy("expectedWaitMinutes", "hint")}
              >
                <option value="">Not sure</option>
                {[30, 45, 60, 90, 120, 180].map((minutes) => (
                  <option key={minutes} value={minutes}>
                    {minutes < 60
                      ? `${minutes} minutes`
                      : `${minutes / 60} hour${minutes > 60 ? "s" : ""}`}
                  </option>
                ))}
              </select>
            </Field>
          </Section>
        )}
      </div>

      {/* Step 5: Details */}
      <div hidden={step !== 4} className="space-y-10">
        <Section title="Anything else we should know?" intro="All optional.">
          <Field
            name="companionCount"
            label="People riding along"
            hint="Family or caregivers. No extra charge."
          >
            <select
              id="companionCount"
              name="companionCount"
              defaultValue={initial.companionCount}
              className="form-input"
              aria-describedby={describedBy("companionCount", "hint")}
            >
              {[0, 1, 2, 3].map((n) => (
                <option key={n} value={n}>
                  {n === 0 ? "No one" : n}
                </option>
              ))}
            </select>
          </Field>
          <TextArea
            name="mobilityNotes"
            label="Mobility needs"
            hint="For example: power wheelchair, needs help with stairs, uses oxygen."
            defaultValue={initial.mobilityNotes}
          />
          <TextArea
            name="instructions"
            label="Pickup instructions"
            hint="For example: gate code, which entrance, meet in the lobby."
            defaultValue={initial.instructions}
          />
        </Section>
      </div>

      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
        {step > 0 ? (
          <Button variant="outline" size="lg" onClick={() => goTo(step - 1)}>
            Back
          </Button>
        ) : (
          <span />
        )}
        <Button type="submit" size="lg" disabled={pending} className="sm:min-w-48">
          {step < LAST_STEP
            ? "Next"
            : pending
              ? "Getting your price…"
              : "See price"}
        </Button>
      </div>
    </form>
  );
};


// ---------- Pieces ----------

const Section = ({
  title,
  intro,
  children,
}: {
  title: string;
  intro?: string;
  children: ReactNode;
}) => (
  <fieldset className="space-y-6">
    <legend className="card-title">{title}</legend>
    {intro && <p className="-mt-3 text-sm text-muted">{intro}</p>}
    {children}
  </fieldset>
);

// A radio button styled as a selectable card.
const Choice = ({
  name,
  value,
  label,
  description,
  ...input
}: {
  name: string;
  value: string;
  label: string;
  description?: string;
  checked?: boolean;
  defaultChecked?: boolean;
  onChange?: () => void;
}) => (
  <label className="flex cursor-pointer items-start gap-3 rounded-card border border-line bg-white p-4 transition-colors has-checked:border-secondary has-checked:bg-secondary/5 has-focus-visible:ring-2 has-focus-visible:ring-secondary/40">
    <input
      type="radio"
      name={name}
      value={value}
      className="mt-1 h-4 w-4 shrink-0 accent-secondary"
      {...input}
    />
    <span>
      <span className="block font-heading font-semibold text-primary">{label}</span>
      {description && <span className="mt-1 block text-sm text-muted">{description}</span>}
    </span>
  </label>
);

const TextArea = ({
  name,
  label,
  hint,
  defaultValue,
}: {
  name: string;
  label: string;
  hint: string;
  defaultValue: string;
}) => (
  <Field name={name} label={label} hint={hint}>
    <textarea
      id={name}
      name={name}
      rows={3}
      maxLength={500}
      defaultValue={defaultValue}
      className="form-input"
      aria-describedby={describedBy(name, "hint")}
    />
  </Field>
);

const AddressFields = ({
  prefix,
  title,
  initial,
  errors,
}: {
  prefix: "pickup" | "dropoff";
  title: string;
  initial: Address;
  errors: FieldErrors;
}) => (
  <Section title={title}>
    <div className="grid gap-6 sm:grid-cols-6">
      <div className="sm:col-span-6">
        <AddressAutocomplete
          prefix={prefix}
          defaultValue={initial.line1}
          error={errors[`${prefix}Line1`]}
        />
      </div>
      <InputField
        name={`${prefix}Line2`}
        label="Apartment, suite or room"
        autoComplete={`section-${prefix} address-line2`}
        defaultValue={initial.line2}
        className="sm:col-span-6"
      />
      <InputField
        name={`${prefix}City`}
        label="City"
        autoComplete={`section-${prefix} address-level2`}
        required
        defaultValue={initial.city}
        error={errors[`${prefix}City`]}
        className="sm:col-span-3"
      />
      <InputField
        name={`${prefix}State`}
        label="State"
        autoComplete={`section-${prefix} address-level1`}
        maxLength={2}
        required
        defaultValue={initial.state}
        error={errors[`${prefix}State`]}
        className="sm:col-span-1"
      />
      <InputField
        name={`${prefix}Zip`}
        label="ZIP"
        inputMode="numeric"
        autoComplete={`section-${prefix} postal-code`}
        maxLength={5}
        required
        defaultValue={initial.zip}
        error={errors[`${prefix}Zip`]}
        className="sm:col-span-2"
      />
    </div>
  </Section>
);

export default TripForm;
