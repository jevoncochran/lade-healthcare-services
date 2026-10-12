import Image from "next/image";
import Button from "./Button";
import { ArrowRightIcon, CheckIcon } from "./Icons";
import type { Service } from "@/lib/services";

// One service on the Services page: media on one side, copy on the other.
// Set `reverse` to put the media on the right; alternate it row by row.
// Shows the service's photo if it has one, otherwise a navy icon panel.
const ServiceRow = ({
  service,
  reverse = false,
  className = "",
}: {
  service: Service;
  reverse?: boolean;
  className?: string;
}) => {
  const {
    id,
    icon: Icon,
    title,
    paragraphs,
    highlights,
    image,
    imageAlt,
  } = service;

  return (
    <section
      id={id}
      aria-labelledby={`${id}-title`}
      className={`section scroll-mt-32 ${className}`}
    >
      <div className="container-site grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
        <div className={reverse ? "lg:order-2" : ""}>
          {image ? (
            <div className="relative aspect-[4/3] overflow-hidden rounded-panel shadow-card">
              <Image
                src={image}
                alt={imageAlt ?? ""}
                fill
                sizes="(min-width: 1024px) 50vw, 100vw"
                className="object-cover"
              />
            </div>
          ) : (
            <div
              aria-hidden="true"
              className="grid aspect-[4/3] place-items-center rounded-panel bg-primary"
            >
              <span className="grid h-32 w-32 place-items-center rounded-full bg-white/10 text-white sm:h-40 sm:w-40">
                <Icon className="h-16 w-16 sm:h-20 sm:w-20" strokeWidth={1.4} />
              </span>
            </div>
          )}
        </div>

        <div>
          <h2 id={`${id}-title`} className="section-title">
            {title}
          </h2>
          <div className="section-lead mt-5 space-y-4">
            {paragraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
          <ul className="mt-6 space-y-3">
            {highlights.map((highlight) => (
              <li key={highlight} className="flex gap-3">
                <span className="check-badge">
                  <CheckIcon className="h-4 w-4" strokeWidth={3} />
                </span>
                <span className="text-ink">{highlight}</span>
              </li>
            ))}
          </ul>
          <Button
            href="/book-a-ride"
            icon={ArrowRightIcon}
            iconPosition="right"
            className="mt-8"
          >
            Book a Ride
          </Button>
        </div>
      </div>
    </section>
  );
};

export default ServiceRow;
