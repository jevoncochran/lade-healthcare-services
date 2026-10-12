import type { ReactNode } from "react";

// Highlights copy that still needs real information from the client.
// It renders in yellow on purpose so it can't ship unnoticed.
// Search the codebase for "<Placeholder" to find everything left to fill in.
const Placeholder = ({ children }: { children: ReactNode }) => {
  return (
    <mark className="rounded bg-placeholder px-1 text-ink">[{children}]</mark>
  );
};

export default Placeholder;
