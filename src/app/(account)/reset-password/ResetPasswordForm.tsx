"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import Button from "@/components/Button";
import FormAlert from "@/components/account/FormAlert";
import SuccessMessage from "@/components/account/SuccessMessage";
import InputField from "@/components/form/InputField";
import {
  checkNewPassword,
  formPassword,
  type FieldErrors,
} from "@/lib/account";
import { api } from "@/lib/api";

const ResetPasswordForm = ({ token }: { token: string }) => {
  const [errors, setErrors] = useState<FieldErrors>({});
  const [message, setMessage] = useState<string>();
  const [pending, setPending] = useState(false);
  const [done, setDone] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const password = formPassword(form, "password");

    const fieldErrors = checkNewPassword(
      password,
      formPassword(form, "confirmPassword"),
    );
    setErrors(fieldErrors);
    setMessage(undefined);
    if (Object.keys(fieldErrors).length > 0) return;

    setPending(true);
    const result = await api("/auth/reset-password", {
      body: { token, password },
    });
    setPending(false);

    if (result.ok) setDone(true);
    else setMessage(result.message);
  };

  if (!token) {
    return <ExpiredLink />;
  }

  if (done) {
    return (
      <SuccessMessage title="Your password has been changed">
        <p>You&apos;ve been signed out everywhere. Sign in with your new password.</p>
        <Button href="/login" size="lg" className="mt-2">
          Sign in
        </Button>
      </SuccessMessage>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-6">
      {message && (
        <FormAlert>
          {message}{" "}
          {message.includes("expired") && (
            <Link href="/forgot-password" className="underline">
              Get a new link
            </Link>
          )}
        </FormAlert>
      )}
      <InputField
        name="password"
        label="New password"
        type="password"
        autoComplete="new-password"
        hint="At least 8 characters. A short phrase of a few words is easy to remember."
        required
        error={errors.password}
      />
      <InputField
        name="confirmPassword"
        label="Confirm new password"
        type="password"
        autoComplete="new-password"
        required
        error={errors.confirmPassword}
      />
      <Button type="submit" size="lg" disabled={pending} className="w-full">
        {pending ? "Saving…" : "Change password"}
      </Button>
    </form>
  );
};

const ExpiredLink = () => (
  <FormAlert>
    This link is missing or incomplete.{" "}
    <Link href="/forgot-password" className="underline">
      Request a new one
    </Link>
    .
  </FormAlert>
);

export default ResetPasswordForm;
