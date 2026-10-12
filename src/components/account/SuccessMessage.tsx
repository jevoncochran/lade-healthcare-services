"use client";

import { useEffect, type ReactNode } from "react";
import { CheckIcon } from "@/components/Icons";

// Confirmation shown in place of a form once it's done (same look as the
// contact form's thank-you message).
const SuccessMessage = ({
  title,
  children,
}: {
  title: string;
  children?: ReactNode;
}) => {
  // The form it replaces is usually taller, which would leave the page
  // scrolled down past this message.
  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, []);

  return (
    <div role="status" className="py-2 text-center">
      <span className="check-badge mx-auto h-14 w-14">
        <CheckIcon className="h-7 w-7" strokeWidth={3} />
      </span>
      <h2 className="card-title mt-6 text-2xl">{title}</h2>
      {children && (
        <div className="mx-auto mt-3 max-w-md space-y-4 leading-relaxed text-muted">
          {children}
        </div>
      )}
    </div>
  );
};

export default SuccessMessage;
