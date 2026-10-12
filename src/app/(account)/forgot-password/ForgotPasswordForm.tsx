"use client";

import { useState, type FormEvent } from "react";
import Button from "@/components/Button";
import FormAlert from "@/components/account/FormAlert";
import SuccessMessage from "@/components/account/SuccessMessage";
import InputField from "@/components/form/InputField";
import { checkEmail, formText } from "@/lib/account";
import { api } from "@/lib/api";

const ForgotPasswordForm = () => {
  const [error, setError] = useState<string>();
  const [message, setMessage] = useState<string>();
  const [pending, setPending] = useState(false);
  const [done, setDone] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const email = formText(new FormData(event.currentTarget), "email");
    const problem = checkEmail(email);
    setError(problem);
    setMessage(undefined);
    if (problem) return;

    setPending(true);
    const result = await api("/auth/forgot-password", { body: { email } });
    setPending(false);

    if (result.ok) setDone(true);
    else setMessage(result.message);
  };

  if (done) {
    // Same message whether or not the email has an account, so this page
    // can't be used to find out who is a Lade customer.
    return (
      <SuccessMessage title="Check your email">
        <p>
          If there&apos;s an account with that email, we&apos;ve sent a link to
          reset the password. It works once and expires in 1 hour.
        </p>
      </SuccessMessage>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-6">
      {message && <FormAlert>{message}</FormAlert>}
      <InputField
        name="email"
        label="Email"
        type="email"
        autoComplete="email"
        required
        error={error}
      />
      <Button type="submit" size="lg" disabled={pending} className="w-full">
        {pending ? "Sending…" : "Send reset link"}
      </Button>
    </form>
  );
};

export default ForgotPasswordForm;
