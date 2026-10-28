"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState, type FormEvent } from "react";
import Button from "@/components/Button";
import FormAlert from "@/components/account/FormAlert";
import InputField from "@/components/form/InputField";
import StepProgress from "@/components/form/StepProgress";
import {
  checkMfaCode,
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

const STEPS = ["Phone", "You", "Password"] as const;
const LAST_STEP = STEPS.length - 1;

// Staff account setup in three steps, in the order people expect after
// clicking the invite: scan the QR code and enter the phone's code → name →
// password. The code is checked as soon as they press Next (codes only last
// about 30 seconds), so taking their time on the later steps is fine. All
// steps stay in the page (inactive ones hidden), so Back never loses answers.
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
  // Each call makes a new authenticator secret, so only ask once (React runs
  // effects twice in development).
  const requested = useRef(false);

  useEffect(() => {
    if (!token || requested.current) return;
    requested.current = true;
    api<InviteSetup>("/staff/invites/accept/start", { body: { token } }).then(
      (result) => {
        if (result.ok) setSetup(result.data);
        else
          setLoadError(result.status === 400 ? INVALID_INVITE : result.message);
      },
    );
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
      mfaCode: formText(form, "mfaCode").replace(/\s/g, ""),
    };

    const stepErrors = compactErrors(
      step === 0
        ? { mfaCode: checkMfaCode(values.mfaCode) }
        : step === 1
          ? { name: checkName(values.name) }
          : checkNewPassword(
              values.password,
              formPassword(form, "confirmPassword"),
            ),
    );
    setErrors(stepErrors);
    setMessage(undefined);
    if (Object.keys(stepErrors).length > 0) return;

    // Step 1: check the phone's code with the server right away.
    if (step === 0) {
      setPending(true);
      const verified = await api("/staff/invites/accept/verify-code", {
        body: { token, mfaCode: values.mfaCode },
      });
      setPending(false);
      if (verified.ok) goTo(1);
      else setMessage(verified.message);
      return;
    }

    if (step < LAST_STEP) {
      goTo(step + 1);
      return;
    }

    setPending(true);
    const result = await api("/staff/invites/accept/complete", {
      body: { token, name: values.name, password: values.password },
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
      <StepProgress steps={STEPS} current={step} label="Account setup steps" />

      <h2 ref={headingRef} tabIndex={-1} className="sr-only">
        Step {step + 1} of {STEPS.length}: {STEPS[step]}
      </h2>

      {message && <FormAlert>{message}</FormAlert>}

      {/* Step 1: Phone */}
      <div hidden={step !== 0} className="space-y-6">
        <div className="space-y-3 text-muted">
          {setup.kind === "reset" ? (
            <p>
              An administrator reset the sign-in for{" "}
              <strong className="break-all text-ink">{setup.email}</strong>.
              You&apos;ll choose a new password and connect your phone again. If
              your phone still has an old Lade entry, delete it first.
            </p>
          ) : (
            <p>
              You&apos;ve been invited to join Lade as {roleName}, signing in as{" "}
              <strong className="break-all text-ink">{setup.email}</strong>.
              First, connect your phone.
            </p>
          )}
          <p>
            Staff sign in with a password and a code from their phone, so a
            stolen password alone can&apos;t open patient records.
          </p>
          <p>
            <strong className="text-ink">iPhone:</strong> point the Camera at
            the code below and tap &ldquo;Add verification code&rdquo;.{" "}
            <strong className="text-ink">Android:</strong> scan it with Google
            Authenticator or Microsoft Authenticator.
          </p>
        </div>
        <Image
          src={setup.qrCodeDataUrl}
          alt="QR code for your authenticator app"
          width={200}
          height={200}
          unoptimized
          className="mx-auto rounded-card border border-line"
        />
        <details className="text-sm text-muted">
          <summary className="cursor-pointer font-semibold text-secondary">
            Setting up on this phone? Enter this key instead
          </summary>
          <p className="mt-2 break-all font-mono text-ink">{setup.secret}</p>
        </details>
        <InputField
          name="mfaCode"
          label="6-digit code from your phone"
          hint="It changes every 30 seconds; enter the one showing now."
          inputMode="numeric"
          autoComplete="one-time-code"
          maxLength={7}
          required
          error={errors.mfaCode}
        />
      </div>

      {/* Step 2: You */}
      <div hidden={step !== 1} className="space-y-6">
        <p className="text-muted">Your phone is connected. Now, your name.</p>
        <InputField
          name="name"
          label="Your name"
          defaultValue={setup.name ?? undefined}
          autoComplete="name"
          required
          error={errors.name}
        />
      </div>

      {/* Step 3: Password */}
      <div hidden={step !== 2} className="space-y-6">
        <p className="text-muted">
          Choose a password you don&apos;t use anywhere else.
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
            ? step === 0
              ? "Checking…"
              : "Setting up…"
            : step < LAST_STEP
              ? "Next"
              : setup.kind === "reset"
                ? "Save and sign in"
                : "Create staff account"}
        </Button>
      </div>
    </form>
  );
};

export default AcceptInvite;
