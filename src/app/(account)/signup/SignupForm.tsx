"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import Button from "@/components/Button";
import AuthShell from "@/components/account/AuthShell";
import FormAlert from "@/components/account/FormAlert";
import SuccessMessage from "@/components/account/SuccessMessage";
import InputField from "@/components/form/InputField";
import {
  checkEmail,
  checkFirstName,
  checkLastName,
  checkNewPassword,
  checkPhone,
  compactErrors,
  formPassword,
  formText,
  type FieldErrors,
} from "@/lib/account";
import { api } from "@/lib/api";
import { phoneInputProps } from "@/lib/phone";

const SignupForm = () => {
  const [errors, setErrors] = useState<FieldErrors>({});
  const [message, setMessage] = useState<string>();
  const [pending, setPending] = useState(false);
  const [sentTo, setSentTo] = useState<string>();
  const [resent, setResent] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const values = {
      firstName: formText(form, "firstName"),
      lastName: formText(form, "lastName"),
      email: formText(form, "email"),
      phone: formText(form, "phone"),
      password: formPassword(form, "password"),
      acceptTerms: form.get("acceptTerms") === "on",
    };

    const fieldErrors = compactErrors({
      firstName: checkFirstName(values.firstName),
      lastName: checkLastName(values.lastName),
      email: checkEmail(values.email),
      phone: checkPhone(values.phone),
      ...checkNewPassword(values.password, formPassword(form, "confirmPassword")),
      acceptTerms: values.acceptTerms
        ? undefined
        : "Please agree to the terms to create an account.",
    });
    setErrors(fieldErrors);
    setMessage(undefined);
    if (Object.keys(fieldErrors).length > 0) {
      setMessage("Please fix the highlighted fields and try again.");
      return;
    }

    setPending(true);
    const result = await api("/auth/signup", { body: values });
    setPending(false);

    if (result.ok) setSentTo(values.email);
    else setMessage(result.message);
  };

  const resend = async () => {
    if (!sentTo) return;
    await api("/auth/verify-email/resend", { body: { email: sentTo } });
    setResent(true);
  };

  // Once sent, show only the confirmation: no sign-up heading or links.
  if (sentTo) {
    return (
      <AuthShell>
        <SuccessMessage title="Check your email">
          <p>
            We sent a link to <strong className="text-ink">{sentTo}</strong>.
            Open it to confirm your email address and finish setting up your
            account. The link works for 24 hours.
          </p>
          {resent ? (
            <p role="status">We sent another link.</p>
          ) : (
            <p>
              Didn&apos;t get it? Check your spam folder, or{" "}
              <button
                type="button"
                onClick={resend}
                className="font-semibold text-secondary hover:underline"
              >
                send it again
              </button>
              .
            </p>
          )}
        </SuccessMessage>
      </AuthShell>
    );
  }

  return (
    <AuthShell
      title="Create an account"
      intro="You'll need an account to book rides online. It only takes a minute, and you can book for yourself or someone you care for."
      footer={
        <p>
          Already have an account?{" "}
          <Link
            href="/login"
            className="font-semibold text-secondary hover:underline"
          >
            Sign in
          </Link>
        </p>
      }
    >
      <form onSubmit={handleSubmit} noValidate className="space-y-6">
        {message && <FormAlert>{message}</FormAlert>}

        <div className="grid gap-6 sm:grid-cols-2">
          <InputField
            name="firstName"
            label="First name"
            autoComplete="given-name"
            required
            error={errors.firstName}
          />
          <InputField
            name="lastName"
            label="Last name"
            autoComplete="family-name"
            required
            error={errors.lastName}
          />
        </div>
        <InputField
          name="email"
          label="Email"
          type="email"
          autoComplete="email"
          required
          error={errors.email}
        />
        <InputField
          name="phone"
          label="Phone"
          {...phoneInputProps}
          hint="We'll call this number if we need to reach you about a ride."
          required
          error={errors.phone}
        />
        <InputField
          name="password"
          label="Password"
          type="password"
          autoComplete="new-password"
          hint="At least 8 characters. A short phrase of a few words is easy to remember."
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

        <div>
          <label className="flex items-start gap-3">
            <input
              name="acceptTerms"
              type="checkbox"
              className="mt-1 h-5 w-5 shrink-0 accent-accent"
              aria-invalid={!!errors.acceptTerms}
              aria-describedby={errors.acceptTerms ? "acceptTerms-error" : undefined}
            />
            {/* New tab: following a link must not lose the half-filled form. */}
            <span className="text-ink">
              I agree to the{" "}
              <a href="/terms" target="_blank" className="font-semibold text-secondary underline">
                Terms of Service
              </a>{" "}
              and{" "}
              <a href="/privacy" target="_blank" className="font-semibold text-secondary underline">
                Privacy Notice
              </a>
              , including the charges for waiting time, no-shows and late
              cancellations.
            </span>
          </label>
          {errors.acceptTerms && (
            <p id="acceptTerms-error" className="form-error">
              {errors.acceptTerms}
            </p>
          )}
        </div>

        <Button type="submit" size="lg" disabled={pending} className="w-full">
          {pending ? "Creating account…" : "Create account"}
        </Button>
      </form>
    </AuthShell>
  );
};

export default SignupForm;
