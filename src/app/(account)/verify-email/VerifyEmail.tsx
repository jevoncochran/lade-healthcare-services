"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import Button from "@/components/Button";
import FormAlert from "@/components/account/FormAlert";
import SuccessMessage from "@/components/account/SuccessMessage";
import InputField from "@/components/form/InputField";
import { checkEmail, formText } from "@/lib/account";
import { api } from "@/lib/api";

type Status = "verifying" | "verified" | "failed";

// Confirms the email as soon as the page opens, then offers a new link if
// the old one expired or was already used.
const VerifyEmail = ({ token }: { token: string }) => {
  const [status, setStatus] = useState<Status>(token ? "verifying" : "failed");
  // Links only work once, so never send the same token twice (React runs
  // effects twice in development).
  const sent = useRef(false);

  useEffect(() => {
    if (!token || sent.current) return;
    sent.current = true;
    api("/auth/verify-email", { body: { token } }).then((result) =>
      setStatus(result.ok ? "verified" : "failed"),
    );
  }, [token]);

  if (status === "verifying") {
    return (
      <p role="status" className="text-muted">
        Confirming your email address…
      </p>
    );
  }

  if (status === "verified") {
    return (
      <SuccessMessage title="Your email is confirmed">
        <p>Your account is ready. Sign in to book a ride.</p>
        <Button href="/login" size="lg" className="mt-2">
          Sign in
        </Button>
      </SuccessMessage>
    );
  }

  return <ResendLink />;
};

const ResendLink = () => {
  const [error, setError] = useState<string>();
  const [pending, setPending] = useState(false);
  const [done, setDone] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const email = formText(new FormData(event.currentTarget), "email");
    const problem = checkEmail(email);
    setError(problem);
    if (problem) return;

    setPending(true);
    await api("/auth/verify-email/resend", { body: { email } });
    setPending(false);
    setDone(true);
  };

  if (done) {
    return (
      <SuccessMessage title="Check your email">
        <p>
          If that email has an account waiting to be confirmed, we&apos;ve sent
          a new link. It works for 24 hours.
        </p>
      </SuccessMessage>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-6">
      <FormAlert>
        This link has expired or was already used. Enter your email and
        we&apos;ll send a new one.
      </FormAlert>
      <InputField
        name="email"
        label="Email"
        type="email"
        autoComplete="email"
        required
        error={error}
      />
      <Button type="submit" size="lg" disabled={pending} className="w-full">
        {pending ? "Sending…" : "Send a new link"}
      </Button>
    </form>
  );
};

export default VerifyEmail;
