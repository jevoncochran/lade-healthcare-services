"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import Button from "@/components/Button";
import FormAlert from "@/components/account/FormAlert";
import InputField from "@/components/form/InputField";
import {
  checkEmail,
  compactErrors,
  formPassword,
  formText,
  type FieldErrors,
} from "@/lib/account";
import { api, safeNextPath } from "@/lib/api";

const LoginForm = ({ next }: { next: string | null }) => {
  const router = useRouter();
  const [errors, setErrors] = useState<FieldErrors>({});
  const [message, setMessage] = useState<string>();
  const [pending, setPending] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const email = formText(form, "email");
    const password = formPassword(form, "password");

    const fieldErrors = compactErrors({
      email: checkEmail(email),
      password: password ? undefined : "Please enter your password.",
    });
    setErrors(fieldErrors);
    setMessage(undefined);
    if (Object.keys(fieldErrors).length > 0) return;

    setPending(true);
    const result = await api("/auth/login", { body: { email, password } });

    if (result.ok) {
      router.push(safeNextPath(next, "/account"));
      return; // keep the button disabled while the next page loads
    }
    setPending(false);
    setMessage(result.message);
  };

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-6">
      {message && <FormAlert>{message}</FormAlert>}

      <InputField
        name="email"
        label="Email"
        type="email"
        autoComplete="email"
        required
        error={errors.email}
      />
      <div>
        <InputField
          name="password"
          label="Password"
          type="password"
          autoComplete="current-password"
          required
          error={errors.password}
        />
        <p className="mt-2 text-right text-sm">
          <Link
            href="/forgot-password"
            className="font-semibold text-secondary hover:underline"
          >
            Forgot your password?
          </Link>
        </p>
      </div>

      <Button type="submit" size="lg" disabled={pending} className="w-full">
        {pending ? "Signing in…" : "Sign in"}
      </Button>
    </form>
  );
};

export default LoginForm;
