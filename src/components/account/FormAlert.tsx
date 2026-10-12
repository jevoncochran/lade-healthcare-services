import type { ReactNode } from "react";

// Message box at the top of a form. "error" is announced immediately by
// screen readers; "info" politely.
const FormAlert = ({
  tone = "error",
  children,
}: {
  tone?: "error" | "info";
  children: ReactNode;
}) => {
  if (tone === "info") {
    return (
      <p
        role="status"
        className="rounded-button border border-secondary/30 bg-secondary/5 px-4 py-3 text-sm font-medium text-primary"
      >
        {children}
      </p>
    );
  }
  return (
    <p
      role="alert"
      className="rounded-button border border-danger/30 bg-danger/5 px-4 py-3 text-sm font-medium text-danger"
    >
      {children}
    </p>
  );
};

export default FormAlert;
