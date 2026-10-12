import type { Metadata } from "next";
import Button from "@/components/Button";
import CtaBand from "@/components/CtaBand";
import FaqList from "@/components/FaqList";
import { ArrowRightIcon, CheckIcon, PhoneIcon } from "@/components/Icons";
import PageHero from "@/components/PageHero";
import SectionHeader from "@/components/SectionHeader";
import ServiceRow from "@/components/ServiceRow";
import { faqs } from "@/lib/faqs";
import { audiences, paymentOptions, services } from "@/lib/services";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Services",
  description:
    "Ambulatory, wheelchair and stretcher transportation for hospital visits, discharges, dialysis and more. Door-to-door and door-through-door service, 24/7. Medicaid, private insurance and cash accepted.",
};

const assistanceLevels = [
  {
    title: "Door-to-door",
    description:
      "Your driver meets you at the door of your home and walks with you to the door of your destination.",
    points: [
      "Help getting in and out of the vehicle",
      "Escort between the vehicle and the door",
      "A good fit for riders who are mostly independent",
    ],
  },
  {
    title: "Door-through-door",
    description:
      "Your driver comes inside to help, from your room or bedside to the vehicle, and all the way to check-in at the other end.",
    points: [
      "Pickup from inside your home, room or facility",
      "Help through hallways, elevators and lobbies",
      "A good fit for riders who need a steady hand the whole way",
    ],
  },
];

const Services = () => {
  return (
    <>
      <PageHero
        title="Our Services"
        intro="Wheelchair, stretcher and ambulatory transportation to appointments, home from the hospital and anywhere else you need to go. Available 24 hours a day."
        image="/assets/images/services/lade_healthcare_services_services.jpg"
        imageAlt="Two drivers and a family member standing with a smiling man in a wheelchair beside an accessible van with its ramp lowered"
        layout="split"
      >
        <Button href="/book-a-ride" size="lg">
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
      </PageHero>

      {/* Service list: links down to each service below */}
      <nav aria-label="Our services" className="pt-10 sm:pt-12">
        <ul className="container-site grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {services.map(({ id, icon: Icon, title }) => (
            <li key={id}>
              <a
                href={`#${id}`}
                className="group card card-hover flex h-full items-center gap-4 p-5"
              >
                <span className="icon-badge h-12 w-12 shrink-0 transition-colors group-hover:bg-secondary group-hover:text-white">
                  <Icon className="h-6 w-6" />
                </span>
                <span className="font-heading font-semibold text-primary">
                  {title}
                </span>
              </a>
            </li>
          ))}
        </ul>
      </nav>

      {services.map((service, i) => (
        <ServiceRow
          key={service.id}
          service={service}
          reverse={i % 2 === 1}
          className={i % 2 === 1 ? "section-alt" : ""}
        />
      ))}

      {/* Assistance levels */}
      <section className="section section-alt">
        <div className="container-site">
          <SectionHeader
            title="How much help do you need?"
            lead="Every ride comes with one of two levels of assistance. If you're not sure which one fits, we'll help you decide when you book."
          />
          <div className="mx-auto mt-14 grid max-w-5xl gap-6 md:grid-cols-2">
            {assistanceLevels.map(({ title, description, points }) => (
              <article key={title} className="card card-accent">
                <h3 className="card-title text-2xl">{title}</h3>
                <p className="mt-3 leading-relaxed text-muted">{description}</p>
                <ul className="mt-6 space-y-3">
                  {points.map((point) => (
                    <li key={point} className="flex gap-3">
                      <span className="check-badge">
                        <CheckIcon className="h-4 w-4" strokeWidth={3} />
                      </span>
                      <span className="text-ink">{point}</span>
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Who we serve */}
      <section className="section section-dark">
        <div className="container-site grid gap-12 lg:grid-cols-[1fr_400px] lg:items-start">
          <div>
            <SectionHeader align="left" title="Who we serve" />
            <dl className="mt-10 grid gap-x-10 gap-y-8 sm:grid-cols-2">
              {audiences.map(({ title, description }) => (
                <div key={title}>
                  <dt className="card-title text-lg">{title}</dt>
                  <dd className="mt-2 leading-relaxed text-white/75">
                    {description}
                  </dd>
                </div>
              ))}
            </dl>
          </div>

          <aside className="rounded-panel bg-white p-8 text-ink sm:p-10">
            <h3 className="card-title text-2xl text-primary">
              For hospitals and care facilities
            </h3>
            <p className="mt-3 leading-relaxed text-muted">
              Discharge planners, case managers and facility staff can book
              rides for patients and residents, including standing schedules for
              dialysis and therapy.
            </p>
            <Button
              href="/contact?topic=facility"
              variant="link"
              icon={ArrowRightIcon}
              iconPosition="right"
              className="mt-6"
            >
              Set up a facility account
            </Button>
          </aside>
        </div>
      </section>

      {/* Insurance & payment */}
      <section className="section section-alt">
        <div className="container-site">
          <SectionHeader
            title="Insurance & payment"
            lead="We accept the most common ways to pay for medical transportation."
          />
          <ul className="mx-auto mt-12 grid max-w-4xl gap-4 sm:grid-cols-3">
            {paymentOptions.map((option) => (
              <li
                key={option}
                className="card flex items-center justify-center gap-3 p-6 font-heading text-lg font-semibold text-primary"
              >
                <CheckIcon className="h-6 w-6 text-accent" strokeWidth={2.5} />
                {option}
              </li>
            ))}
          </ul>
          <p className="mx-auto mt-8 max-w-2xl text-center text-muted">
            Not sure if your trip is covered? Call us at{" "}
            <a
              href={site.phoneHref}
              className="font-semibold text-secondary hover:underline"
            >
              {site.phone}
            </a>{" "}
            and we&apos;ll check before your ride.
          </p>
        </div>
      </section>

      {/* FAQ */}
      <section className="section">
        <div className="container-site">
          <div className="mx-auto max-w-4xl">
            <SectionHeader title="Frequently asked questions" />
            <div className="mt-12">
              <FaqList faqs={faqs} />
            </div>
          </div>
        </div>
      </section>

      <CtaBand />
    </>
  );
};

export default Services;
