import type { ReactNode } from "react";

// Standard title + lead block used at the top of page sections.
// Colors adapt automatically inside a `.section-dark` section.
const SectionHeader = ({
  title,
  lead,
  align = "center",
  className = "",
}: {
  title: ReactNode;
  lead?: ReactNode;
  align?: "center" | "left";
  className?: string;
}) => {
  return (
    <div
      className={`${align === "center" ? "mx-auto max-w-2xl text-center" : ""} ${className}`}
    >
      <h2 className="section-title">{title}</h2>
      {lead && <p className="section-lead mt-4">{lead}</p>}
    </div>
  );
};

export default SectionHeader;
