"use client";

import { useState, type ComponentPropsWithoutRef } from "react";
import Field, { describedBy } from "./Field";

// <Field> plus a text-style <input>, with the id, aria and class wiring done.
// Password inputs get a "Show" toggle, which helps people typing long
// passphrases on a phone.
//
//   <InputField name="email" label="Email" type="email" autoComplete="email" required error={errors.email} />
const InputField = ({
  name,
  label,
  hint,
  error,
  required = false,
  type = "text",
  className = "",
  ...inputProps
}: {
  name: string;
  label: string;
  hint?: string;
  error?: string;
  required?: boolean;
  className?: string;
} & Omit<
  ComponentPropsWithoutRef<"input">,
  "name" | "id" | "required" | "className"
>) => {
  const [visible, setVisible] = useState(false);
  const isPassword = type === "password";

  const input = (
    <input
      id={name}
      name={name}
      type={isPassword && visible ? "text" : type}
      required={required}
      className={`form-input ${isPassword ? "pr-20" : ""}`}
      aria-invalid={!!error}
      aria-describedby={describedBy(name, hint, error)}
      {...inputProps}
    />
  );

  return (
    <Field
      name={name}
      label={label}
      hint={hint}
      error={error}
      required={required}
      className={className}
    >
      {isPassword ? (
        <div className="relative">
          {input}
          <button
            type="button"
            onClick={() => setVisible((v) => !v)}
            aria-controls={name}
            aria-pressed={visible}
            className="absolute inset-y-0 right-0 mt-2 px-4 font-heading text-sm font-semibold text-secondary hover:underline"
          >
            {visible ? "Hide" : "Show"}
          </button>
        </div>
      ) : (
        input
      )}
    </Field>
  );
};

export default InputField;
