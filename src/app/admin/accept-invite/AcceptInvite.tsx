"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState, type FormEvent } from "react";
import Button from "@/components/Button";
import FormAlert from "@/components/account/FormAlert";
import InputField from "@/components/form/InputField";
import StepProgress from "@/components/form/StepProgress";
import {
  checkName,
  checkNewPassword,
  compactErrors,
  formPassword,
  formText,
  type FieldErrors,
} from "@/lib/account";
import { api, type InviteSetup } from "@/lib/api";

const INVALID_INVITE =
  "This invite link is invalid or has expired. Ask an administrator to send you a new one.";

// A sign-in reset (forgotten password) skips "You": the account already has
// a name, so it's a single step.
const INVITE_STEPS = ["You", "Password"] as const;
const RESET_STEPS = ["Password"] as const;
type StepName = (typeof INVITE_STEPS)[number];

// Staff account setup: name → password. Both steps stay in the page
// (inactive ones hidden), so Back never loses answers.
const AcceptInvite = ({ token }: { token: string }) => {
  const router = useRouter();
  const [setup, setSetup] = useState<InviteSetup>();
  const [loadError, setLoadError] = useState<string>();
  const [step, setStep] = useState(0);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [message, setMessage] = useState<string>();
  const [pending, setPending] = useState(false);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const firstStep = useRef(true);

  useEffect(() => {
    if (!token) return;
    let active = true;
    api<InviteSetup>("/staff/invites/accept/start", { body: { token } }).then(
      (result) => {
        if (!active) return;
        if (result.ok) setSetup(result.data);
        else
          setLoadError(result.status === 400 ? INVALID_INVITE : result.message);
      },
    );
    return () => {
      active = false;
    };
  }, [token]);

  // New step: back to the top, and announce it to screen readers.
  useEffect(() => {
    window.scrollTo({ top: 0 });
    if (firstStep.current) {
      firstStep.current = false;
      return;
    }
    headingRef.current?.focus();
  }, [step]);

  const isReset = setup?.kind === "reset";
  const steps: readonly StepName[] = isReset ? RESET_STEPS : INVITE_STEPS;
  const lastStep = steps.length - 1;
  const current = steps[step];

  const goTo = (next: number) => {
    setErrors({});
    setMessage(undefined);
    setStep(next);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const values = {
      name: formText(form, "name"),
      password: formPassword(form, "password"),
    };

    const stepErrors = compactErrors(
      current === "You"
        ? { name: checkName(values.name) }
        : checkNewPassword(
            values.password,
            formPassword(form, "confirmPassword"),
          ),
    );
    setErrors(stepErrors);
    setMessage(undefined);
    if (Object.keys(stepErrors).length > 0) return;

    if (step < lastStep) {
      goTo(step + 1);
      return;
    }

    setPending(true);
    const result = await api("/staff/invites/accept/complete", {
      // A reset keeps the account's name.
      body: isReset
        ? { token, password: values.password }
        : { token, name: values.name, password: values.password },
    });

    if (result.ok) {
      router.push("/admin");
      return;
    }
    setPending(false);
    setMessage(result.message);
  };

  if (!token || loadError) {
    return <FormAlert>{loadError ?? INVALID_INVITE}</FormAlert>;
  }

  if (!setup) {
    return (
      <p role="status" className="text-muted">
        Preparing your account…
      </p>
    );
  }

  const roleName = setup.role === "ADMIN" ? "an administrator" : "a dispatcher";

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-8">
      {steps.length > 1 && (
        <StepProgress
          steps={steps}
          current={step}
          label="Account setup steps"
        />
      )}

      <h2 ref={headingRef} tabIndex={-1} className="sr-only">
        Step {step + 1} of {steps.length}: {current}
      </h2>

      {message && <FormAlert>{message}</FormAlert>}

      {/* Step 1: You (new accounts only) */}
      <div hidden={current !== "You"} className="space-y-6">
        <p className="text-muted">
          You&apos;ve been invited to join Lade as {roleName}, signing in as{" "}
          <strong className="break-all text-ink">{setup.email}</strong>. First,
          your name.
        </p>
        <InputField
          name="name"
          label="Your name"
          defaultValue={setup.name ?? undefined}
          autoComplete="name"
          required
          error={errors.name}
        />
      </div>

      {/* Step 2: Password */}
      <div hidden={current !== "Password"} className="space-y-6">
        <p className="text-muted">
          {isReset ? (
            <>
              An administrator reset the sign-in for{" "}
              <strong className="break-all text-ink">{setup.email}</strong>.
              Choose a new password you don&apos;t use anywhere else.
            </>
          ) : (
            "Choose a password you don't use anywhere else."
          )}
        </p>
        <InputField
          name="password"
          label="Password"
          type="password"
          autoComplete="new-password"
          hint="At least 8 characters."
          required
          error={errors.password}
        />
        <InputField
          name="confirmPassword"
          label="Confirm password"
          type="password"
          autoComplete="new-password"
          required
          error={errors.confirmPassword}
        />
      </div>

      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
        {step > 0 ? (
          <Button variant="outline" size="lg" onClick={() => goTo(step - 1)}>
            Back
          </Button>
        ) : (
          <span />
        )}
        <Button
          type="submit"
          size="lg"
          disabled={pending}
          className="sm:min-w-48"
        >
          {pending
            ? "Setting up…"
            : step < lastStep
              ? "Next"
              : isReset
                ? "Save and sign in"
                : "Create staff account"}
        </Button>
      </div>
    </form>
  );
};

export default AcceptInvite;
