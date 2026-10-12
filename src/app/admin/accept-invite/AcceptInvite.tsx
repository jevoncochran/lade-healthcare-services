"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState, type FormEvent } from "react";
import Button from "@/components/Button";
import FormAlert from "@/components/account/FormAlert";
import InputField from "@/components/form/InputField";
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

// Two steps on one page: the API makes an authenticator secret for this
// invite (shown as a QR code), then the form sets name + password and checks
// a code from the app to prove it's connected.
const AcceptInvite = ({ token }: { token: string }) => {
  const router = useRouter();
  const [setup, setSetup] = useState<InviteSetup>();
  const [loadError, setLoadError] = useState<string>();
  const [errors, setErrors] = useState<FieldErrors>({});
  const [message, setMessage] = useState<string>();
  const [pending, setPending] = useState(false);
  // Each call makes a new secret, so only ask once (React runs effects twice
  // in development).
  const requested = useRef(false);

  useEffect(() => {
    if (!token || requested.current) return;
    requested.current = true;
    api<InviteSetup>("/staff/invites/accept/start", { body: { token } }).then(
      (result) => {
        if (result.ok) setSetup(result.data);
        else setLoadError(result.status === 400 ? INVALID_INVITE : result.message);
      },
    );
  }, [token]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const values = {
      name: formText(form, "name"),
      password: formPassword(form, "password"),
      mfaCode: formText(form, "mfaCode").replace(/\s/g, ""),
    };

    const fieldErrors = compactErrors({
      name: checkName(values.name),
      ...checkNewPassword(values.password, formPassword(form, "confirmPassword")),
      mfaCode: checkMfaCode(values.mfaCode),
    });
    setErrors(fieldErrors);
    setMessage(undefined);
    if (Object.keys(fieldErrors).length > 0) return;

    setPending(true);
    const result = await api("/staff/invites/accept/complete", {
      body: { token, ...values },
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

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-8">
      {message && <FormAlert>{message}</FormAlert>}

      <p className="text-muted">
        Setting up <strong className="text-ink">{setup.email}</strong> as{" "}
        {setup.role === "ADMIN" ? "an administrator" : "a dispatcher"}.
      </p>

      <fieldset className="space-y-4">
        <legend className="card-title">1. Connect your authenticator app</legend>
        <p className="text-muted">
          Open an authenticator app (Google Authenticator, Microsoft
          Authenticator, 1Password…) and scan this code.
        </p>
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
            Can&apos;t scan it? Enter this key instead
          </summary>
          <p className="mt-2 break-all font-mono text-ink">{setup.secret}</p>
        </details>
        <InputField
          name="mfaCode"
          label="6-digit code from the app"
          inputMode="numeric"
          autoComplete="one-time-code"
          maxLength={7}
          required
          error={errors.mfaCode}
        />
      </fieldset>

      <fieldset className="space-y-6">
        <legend className="card-title">2. Your details</legend>
        <InputField
          name="name"
          label="Your name"
          autoComplete="name"
          required
          error={errors.name}
        />
        <InputField
          name="password"
          label="Password"
          type="password"
          autoComplete="new-password"
          hint="At least 8 characters. Don't reuse a password from another site."
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
      </fieldset>

      <Button type="submit" size="lg" disabled={pending} className="w-full">
        {pending ? "Setting up…" : "Create staff account"}
      </Button>
    </form>
  );
};

export default AcceptInvite;
