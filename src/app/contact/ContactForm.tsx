"use client";

import { startTransition, useActionState, type FormEvent } from "react";
import Button from "@/components/Button";
import { CheckIcon } from "@/components/Icons";
import Field, { describedBy } from "@/components/form/Field";
import { api } from "@/lib/api";
import {
  contactTopics,
  validateContact,
  type ContactFormState,
  type ContactValues,
} from "@/lib/contact";
import { phoneInputProps } from "@/lib/phone";
import { site } from "@/lib/site";

const initialState: ContactFormState = { status: "idle" };

const text = (formData: FormData, key: string) =>
  String(formData.get(key) ?? "").trim();

// Checks the fields here for quick feedback, then sends the message to the
// booking API, which checks it again and emails it to Lade's inbox through
// Amazon SES (the visitor's email as reply-to). Nothing is stored.
const sendContactMessage = async (
  _prevState: ContactFormState,
  formData: FormData,
): Promise<ContactFormState> => {
  const values: ContactValues = {
    name: text(formData, "name"),
    email: text(formData, "email"),
    phone: text(formData, "phone"),
    topic: text(formData, "topic"),
    message: text(formData, "message"),
  };

  const errors = validateContact(values);
  if (Object.keys(errors).length > 0) {
    return {
      status: "error",
      message: "Please fix the highlighted fields and try again.",
      errors,
    };
  }

  const result = await api("/contact", {
    // `company` is the hidden honeypot field: the API drops bot messages.
    body: {
      ...values,
      phone: values.phone || undefined,
      company: text(formData, "company") || undefined,
    },
  });
  return result.ok
    ? { status: "success" }
    : { status: "error", message: result.message };
};

const ContactForm = ({ defaultTopic = "" }: { defaultTopic?: string }) => {
  const [state, formAction, pending] = useActionState(
    sendContactMessage,
    initialState,
  );

  // Submitting through onSubmit (instead of <form action>) skips React's
  // automatic form reset, so whatever the visitor typed stays in place when
  // the server sends back validation errors.
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    startTransition(() => formAction(formData));
  };

  if (state.status === "success") {
    return (
      <div role="status" className="py-6 text-center">
        <span className="check-badge mx-auto h-14 w-14">
          <CheckIcon className="h-7 w-7" strokeWidth={3} />
        </span>
        <h2 className="card-title mt-6 text-2xl">
          Thanks, we got your message
        </h2>
        <p className="mx-auto mt-3 max-w-md leading-relaxed text-muted">
          Someone from our team will get back to you soon. If you need a ride
          today, please call us at{" "}
          <a
            href={site.phoneHref}
            className="font-semibold text-secondary hover:underline"
          >
            {site.phone}
          </a>
          .
        </p>
      </div>
    );
  }

  const errors = state.errors ?? {};

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-6">
      {state.status === "error" && state.message && (
        <p
          role="alert"
          className="rounded-button border border-danger/30 bg-danger/5 px-4 py-3 text-sm font-medium text-danger"
        >
          {state.message}
        </p>
      )}

      <div className="grid gap-6 sm:grid-cols-2">
        <Field name="name" label="Your name" required error={errors.name}>
          <input
            id="name"
            name="name"
            type="text"
            autoComplete="name"
            required
            className="form-input"
            aria-invalid={!!errors.name}
            aria-describedby={describedBy("name", undefined, errors.name)}
          />
        </Field>

        <Field name="phone" label="Phone" error={errors.phone}>
          <input
            id="phone"
            name="phone"
            {...phoneInputProps}
            className="form-input"
            aria-invalid={!!errors.phone}
            aria-describedby={describedBy("phone", undefined, errors.phone)}
          />
        </Field>
      </div>

      <Field name="email" label="Email" required error={errors.email}>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
          className="form-input"
          aria-invalid={!!errors.email}
          aria-describedby={describedBy("email", undefined, errors.email)}
        />
      </Field>

      <Field
        name="topic"
        label="What is your message about?"
        required
        error={errors.topic}
      >
        <select
          id="topic"
          name="topic"
          required
          defaultValue={defaultTopic}
          className="form-input"
          aria-invalid={!!errors.topic}
          aria-describedby={describedBy("topic", undefined, errors.topic)}
        >
          <option value="" disabled>
            Choose one
          </option>
          {contactTopics.map(({ value, label }) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
      </Field>

      <Field
        name="message"
        label="Message"
        required
        hint="Please don't include medical details here. We'll ask for what we need when we call you back."
        error={errors.message}
      >
        <textarea
          id="message"
          name="message"
          rows={6}
          required
          maxLength={2000}
          className="form-input"
          aria-invalid={!!errors.message}
          aria-describedby={describedBy("message", "hint", errors.message)}
        />
      </Field>

      {/* Honeypot: hidden from people and screen readers, often filled by bots. */}
      <div aria-hidden="true" className="hidden">
        <label htmlFor="company">Company</label>
        <input
          id="company"
          name="company"
          type="text"
          tabIndex={-1}
          autoComplete="off"
        />
      </div>

      <Button
        type="submit"
        size="lg"
        disabled={pending}
        className="w-full sm:w-auto"
      >
        {pending ? "Sending…" : "Send Message"}
      </Button>
    </form>
  );
};

export default ContactForm;
