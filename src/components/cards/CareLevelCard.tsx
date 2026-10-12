import type { ServiceItem } from "@/lib/services";

// Large card for a level of care (ambulatory, wheelchair, stretcher).
// Blue top border; the icon fills in on hover.
const CareLevelCard = ({
  icon: Icon,
  title,
  description,
  className = "",
}: ServiceItem & { className?: string }) => {
  return (
    <article
      className={`group card card-hover card-accent h-full ${className}`}
    >
      <span className="icon-badge transition-colors group-hover:bg-secondary group-hover:text-white">
        <Icon className="h-8 w-8" />
      </span>
      <h3 className="card-title mt-6 uppercase tracking-wide">{title}</h3>
      <p className="mt-3 leading-relaxed text-muted">{description}</p>
    </article>
  );
};

export default CareLevelCard;
