import Image from "next/image";
import {
  ArrowRightIcon,
  CheckIcon,
  ClockIcon,
  MailIcon,
  MapPinIcon,
  PhoneIcon,
} from "@/components/Icons";
import Button from "@/components/Button";
import SectionHeader from "@/components/SectionHeader";
import CareLevelCard from "@/components/cards/CareLevelCard";
import TripTypeCard from "@/components/cards/TripTypeCard";
import CtaBand from "@/components/CtaBand";
import {
  audiences,
  careLevels,
  paymentOptions,
  tripTypes,
} from "@/lib/services";
import { site } from "@/lib/site";

const reasons = [
  "Door-to-door or door-through-door service — we can help you all the way inside",
  "Caregivers and family members are welcome to ride along",
  "Available 24/7, including weekends, after hours and holidays",
  "Live customer service around the clock — talk to a real person",
  "Medicaid, private insurance and cash accepted",
  "Same-day and short-notice rides when vehicles are available",
];

const Home = () => {
  return (
    <>
      {/* Hero */}
      <section className="relative isolate overflow-hidden bg-primary">
        <Image
          src="/assets/images/home/lade_healthcare_services.jpg"
          alt="A caregiver helping a man in a wheelchair up the ramp of an accessible van"
          fill
          preload
          sizes="100vw"
          className="-z-10 object-cover object-[52%_center] lg:object-[70%_center]"
        />
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-primary via-primary/85 to-primary/10 lg:via-primary/30" />

        <div className="container-site pb-36 pt-20 sm:pb-44 sm:pt-28 lg:pb-52 lg:pt-32">
          <div className="max-w-2xl text-white">
            <h1 className="display">
              Safe &amp; Reliable Medical Transportation
            </h1>
            <p className="mt-6 max-w-xl text-lg text-white/85 sm:text-xl">
              Ambulatory, wheelchair and stretcher transport for your patients,
              residents and loved ones — to appointments, through discharge and
              back home again.
            </p>
            <div className="mt-9 flex flex-col gap-4 sm:flex-row">
              <Button
                href="/book-a-ride"
                size="lg"
                icon={ArrowRightIcon}
                iconPosition="right"
              >
                Book a Ride
              </Button>
              <Button
                href={site.phoneHref}
                variant="outline-light"
                size="lg"
                icon={PhoneIcon}
              >
                Call {site.phone}
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Contact strip overlapping the hero */}
      <section
        aria-label="Contact information"
        className="relative z-10 -mt-24 sm:-mt-28"
      >
        <div className="container-site">
          <div className="overflow-hidden rounded-card bg-white shadow-float ring-1 ring-black/5">
            <h2 className="bg-secondary py-3 text-center font-heading text-lg font-semibold uppercase tracking-wide text-white">
              Contact Us Now
            </h2>
            <div className="grid divide-y divide-line md:grid-cols-3 md:divide-x md:divide-y-0">
              <InfoItem icon={MapPinIcon} label="Service Area">
                {site.serviceArea}
              </InfoItem>
              <InfoItem icon={PhoneIcon} label="Phone & Email">
                <a
                  href={site.phoneHref}
                  className="font-semibold text-primary hover:underline"
                >
                  {site.phone}
                </a>
                <br />
                <a href={`mailto:${site.email}`} className="hover:underline">
                  {site.email}
                </a>
              </InfoItem>
              <InfoItem icon={ClockIcon} label="Hours">
                24/7/365 — rides &amp; customer service
              </InfoItem>
            </div>
          </div>
        </div>
      </section>

      {/* Welcome */}
      <section className="section">
        <div className="container-site grid gap-12 lg:grid-cols-[1fr_380px]">
          <div>
            <SectionHeader
              align="left"
              title="Transportation built around comfort, dignity and safety"
            />
            <div className="section-lead mt-6 space-y-4">
              <p>
                Getting to a medical appointment shouldn&apos;t be the hardest
                part of your day. Whether it&apos;s a routine check-up, a
                dialysis session or a ride home after a hospital stay,{" "}
                {site.name} gets you there safely and on time.
              </p>
              <p>
                Our trained drivers provide door-to-door and door-through-door
                service in vehicles equipped for ambulatory, wheelchair and
                stretcher riders. Caregivers are always welcome to ride along,
                and our team is available around the clock — including weekends,
                after hours and holidays.
              </p>
            </div>
            <Button
              href="/about"
              variant="link"
              icon={ArrowRightIcon}
              iconPosition="right"
              className="mt-8"
            >
              Learn more about us
            </Button>
          </div>

          <aside className="h-fit rounded-card bg-surface p-8">
            <h3 className="card-title text-2xl">Need a ride?</h3>
            <p className="mt-2 text-muted">
              Book online or call us any time. For same-day or urgent rides,
              please call.
            </p>
            <div className="mt-6 flex flex-col gap-3">
              <Button href="/book-a-ride">Request a Ride Online</Button>
              <Button href={site.phoneHref} variant="outline" icon={PhoneIcon}>
                {site.phone}
              </Button>
              <Button
                href={`mailto:${site.email}`}
                variant="outline"
                icon={MailIcon}
              >
                Email Us
              </Button>
            </div>
            <p className="mt-6 text-sm text-muted">
              We recommend booking at least 24 hours in advance for scheduled
              trips.
            </p>
          </aside>
        </div>
      </section>

      {/* Levels of service */}
      <section className="section section-alt">
        <div className="container-site">
          <SectionHeader
            title="Transport for every level of mobility"
            lead="We match each rider with the right vehicle and the right level of assistance."
          />
          <div className="mt-14 grid gap-6 md:grid-cols-3">
            {careLevels.map((level) => (
              <CareLevelCard key={level.title} {...level} />
            ))}
          </div>

          <div className="mt-16">
            <h3 className="card-title text-center text-2xl">
              Where we take you
            </h3>
            <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
              {tripTypes.map((trip) => (
                <li key={trip.title}>
                  <TripTypeCard {...trip} headingLevel="h4" />
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-12 text-center">
            <Button href="/services" variant="outline">
              View All Services
            </Button>
          </div>
        </div>
      </section>

      {/* Why choose us */}
      <section className="section">
        <div className="container-site grid items-center gap-12 lg:grid-cols-2">
          <div>
            <SectionHeader
              align="left"
              title="Families and facilities turn to us because…"
            />
            <ul className="mt-8 space-y-4">
              {reasons.map((reason) => (
                <li key={reason} className="flex gap-4">
                  <span className="check-badge">
                    <CheckIcon className="h-4 w-4" strokeWidth={3} />
                  </span>
                  <span className="text-lg text-ink">{reason}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="panel">
            <h3 className="font-heading text-2xl font-bold">Payment options</h3>
            <p className="mt-2 text-white/80">
              We work with you to make every ride affordable.
            </p>
            <ul className="mt-6 grid gap-3">
              {paymentOptions.map((p) => (
                <li
                  key={p}
                  className="flex items-center gap-3 rounded-button bg-white/10 px-5 py-4 font-heading font-semibold"
                >
                  <CheckIcon
                    className="h-5 w-5 text-accent-light"
                    strokeWidth={3}
                  />
                  {p}
                </li>
              ))}
            </ul>
            <p className="mt-6 text-sm text-white/70">
              Not sure if your trip is covered? Call us and we&apos;ll help you
              find out.
            </p>
          </div>
        </div>
      </section>

      {/* Who we serve */}
      <section className="section section-dark">
        <div className="container-site">
          <SectionHeader
            title="Taking you, your loved ones and your patients wherever care is needed"
            className="uppercase"
          />
          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-5">
            {audiences.map(({ title, description }) => (
              <div
                key={title}
                className="rounded-card border border-white/15 bg-white/5 p-6"
              >
                <h3 className="card-title text-lg">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-white/75">
                  {description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <CtaBand />
    </>
  );
};

export default Home;

const InfoItem = ({
  icon: Icon,
  label,
  children,
}: {
  icon: typeof PhoneIcon;
  label: string;
  children: React.ReactNode;
}) => {
  return (
    <div className="flex flex-col items-center gap-2 px-6 py-6 text-center">
      <Icon className="h-7 w-7 text-accent" />
      <p className="font-heading text-sm font-semibold uppercase tracking-wide text-primary">
        {label}
      </p>
      <p className="text-muted">{children}</p>
    </div>
  );
};
