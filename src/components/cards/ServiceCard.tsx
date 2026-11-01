import Button from "../Button";
import { ArrowRightIcon, CheckIcon, PhoneIcon } from "../Icons";
import type { Service } from "@/lib/services";
import { site } from "@/lib/site";

// A service on the Services page without a photo: a compact card, shown
// three across on desktop. The button stays at the bottom so cards in a row
// line up.
const ServiceCard = ({ service }: { service: Service }) => {
  const { id, icon: Icon, title, paragraphs, highlights } = service;

  return (
    <article
      id={id}
      aria-labelledby={`${id}-title`}
      className="card flex h-full scroll-mt-32 flex-col p-6 sm:p-8"
    >
      <span className="icon-badge h-12 w-12">
        <Icon className="h-6 w-6" />
      </span>
      <h3 id={`${id}-title`} className="card-title mt-5 text-xl">
        {title}
      </h3>
      <div className="mt-3 space-y-3 leading-relaxed text-muted">
        {paragraphs.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </div>
      <ul className="mt-5 space-y-3">
        {highlights.map((highlight) => (
          <li key={highlight} className="flex gap-3">
            <span className="check-badge">
              <CheckIcon className="h-4 w-4" strokeWidth={3} />
            </span>
            <span className="text-ink">{highlight}</span>
          </li>
        ))}
      </ul>
      <div className="mt-auto pt-8">
        {service.action === "call" ? (
          <Button href={site.phoneHref} variant="outline" icon={PhoneIcon}>
            Call {site.phone}
          </Button>
        ) : (
          <Button
            href="/book-a-ride"
            variant="outline"
            icon={ArrowRightIcon}
            iconPosition="right"
          >
            Book a Ride
          </Button>
        )}
      </div>
    </article>
  );
};

export default ServiceCard;
