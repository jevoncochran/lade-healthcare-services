import type { ReactNode } from "react";

// Label + optional hint + error message around a form control.
// Give the control: id={name}, className="form-input",
// aria-invalid={!!error} and aria-describedby={describedBy(name, hint, error)}.
const Field = ({
  name,
  label,
  required = false,
  hint,
  error,
  className = "",
  children,
}: {
  name: string;
  label: string;
  required?: boolean;
  hint?: string;
  error?: string;
  className?: string;
  children: ReactNode;
}) => {
  return (
    <div className={className}>
      <label htmlFor={name} className="form-label">
        {label}
        {required ? (
          <span aria-hidden="true" className="text-accent">
            {" "}
            *
          </span>
        ) : (
          <span className="font-normal text-muted"> (optional)</span>
        )}
      </label>
      {hint && (
        <p id={`${name}-hint`} className="form-hint">
          {hint}
        </p>
      )}
      {children}
      {error && (
        <p id={`${name}-error`} className="form-error">
          {error}
        </p>
      )}
    </div>
  );
};

// Builds the aria-describedby value so screen readers read the hint and error.
export const describedBy = (name: string, hint?: string, error?: string) =>
  [hint && `${name}-hint`, error && `${name}-error`]
    .filter(Boolean)
    .join(" ") || undefined;

export default Field;
