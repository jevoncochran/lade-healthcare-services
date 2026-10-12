import type { ServiceItem } from "@/lib/services";

// Compact, centered card for a type of trip (hospital visit, discharge, etc.).
// Set `headingLevel` to match where the card sits in the page outline.
const TripTypeCard = ({
  icon: Icon,
  title,
  description,
  headingLevel = "h3",
  className = "",
}: ServiceItem & { headingLevel?: "h3" | "h4"; className?: string }) => {
  const Heading = headingLevel;
  return (
    <article className={`card h-full p-6 text-center ${className}`}>
      <Icon className="mx-auto h-9 w-9 text-accent" />
      <Heading className="mt-4 font-heading font-semibold text-primary">
        {title}
      </Heading>
      <p className="mt-2 text-sm text-muted">{description}</p>
    </article>
  );
};

export default TripTypeCard;
