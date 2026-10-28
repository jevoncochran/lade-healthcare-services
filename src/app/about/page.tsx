import type { Metadata } from "next";
import Button from "@/components/Button";
import CtaBand from "@/components/CtaBand";
import {
  ArrowRightIcon,
  CheckIcon,
  ClockIcon,
  HeartHandIcon,
  ShieldIcon,
  UserIcon,
  VanIcon,
  type IconComponent,
} from "@/components/Icons";
import PageHero from "@/components/PageHero";
import SectionHeader from "@/components/SectionHeader";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Lade Health Care Services provides compassionate, reliable non-emergency medical transportation 24 hours a day. Learn about our story, our values, our drivers and our vehicles.",
};

const values: { icon: IconComponent; title: string; description: string }[] = [
  {
    icon: HeartHandIcon,
    title: "Compassion",
    description:
      "We take our time, listen and treat every rider the way we'd want our own family treated.",
  },
  {
    icon: UserIcon,
    title: "Dignity",
    description:
      "Every rider is treated with respect, whatever their age, ability or condition.",
  },
  {
    icon: ClockIcon,
    title: "Reliability",
    description:
      "We show up on time, every time, because a missed ride can mean a missed treatment.",
  },
  {
    icon: ShieldIcon,
    title: "Safety",
    description:
      "Trained drivers, secured wheelchairs and well-maintained vehicles on every trip.",
  },
];

// Confirmed by Jevon for launch (2026-10-28).
const driverStandards = [
  "Background checked",
  "Clean driving record",
  "CPR and First Aid certified",
  "Trained in wheelchair securement and safe transfers",
  "Trained to protect patient privacy",
];

const About = () => {
  return (
    <>
      <PageHero
        title="About Us"
        intro="Where compassion meets care. We get people to the care they need, and we treat every rider the way we'd want our own family treated."
      />

      {/* Story + mission */}
      <section className="section">
        <div className="container-site grid gap-12 lg:grid-cols-[1fr_420px] lg:items-start">
          <div>
            <SectionHeader align="left" title="Why we started Lade" />
            <div className="section-lead mt-6 space-y-4">
              <p>
                {site.name} started with a simple idea: getting to medical care
                shouldn&apos;t be the hardest part of someone&apos;s day.
              </p>
              <p>
                Too often, patients wait hours for a late pickup, ride with a
                driver who&apos;s in a hurry, or spend half the morning on hold
                just to book a trip. Families take time off work to fill the
                gap, and facility staff lose hours arranging rides. We built
                Lade to do it differently.
              </p>
              <p>
                That means answering the phone 24 hours a day, showing up when
                we say we will, and giving our drivers the time to help every
                rider safely in and out, all the way to the door when they need
                it. Whether it&apos;s a ride home from the hospital or a
                standing dialysis schedule, every rider gets the same patient,
                respectful service.
              </p>
              <p>
                We&apos;re a new company, and we know trust is earned one ride
                at a time. We&apos;d be glad to earn yours.
              </p>
            </div>
          </div>

          <aside className="panel">
            <h2 className="font-heading text-sm font-semibold tracking-wide text-white/75 uppercase">
              Our mission
            </h2>
            <p className="mt-4 font-heading text-2xl leading-snug font-bold">
              To give every rider safe, dependable transportation to the care
              they need, with patience, respect and kindness from pickup to
              drop-off.
            </p>
          </aside>
        </div>
      </section>

      {/* Values */}
      <section className="section section-alt">
        <div className="container-site">
          <SectionHeader
            title="What we stand for"
            lead="Four things guide how we hire, how we drive and how we treat every rider."
          />
          <div className="mx-auto mt-14 grid max-w-5xl gap-6 sm:grid-cols-2">
            {values.map(({ icon: Icon, title, description }) => (
              <article key={title} className="card flex gap-5">
                <span className="icon-badge h-14 w-14 shrink-0">
                  <Icon className="h-7 w-7" />
                </span>
                <div>
                  <h3 className="card-title">{title}</h3>
                  <p className="mt-2 leading-relaxed text-muted">
                    {description}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Drivers + vehicles */}
      <section className="section">
        <div className="container-site">
          <SectionHeader
            title="Safety on every ride"
            lead="The people behind the wheel matter as much as the vehicles they drive."
          />
          <div className="mt-14 grid gap-6 lg:grid-cols-2">
            <article className="card card-accent">
              <span className="icon-badge">
                <UserIcon className="h-8 w-8" />
              </span>
              <h3 className="card-title mt-6 text-2xl">Our drivers</h3>
              <p className="mt-3 leading-relaxed text-muted">
                We hire drivers for their patience and people skills as much as
                their driving record. Every Lade driver is:
              </p>
              <ul className="mt-6 space-y-3">
                {driverStandards.map((standard) => (
                  <li key={standard} className="flex gap-3">
                    <span className="check-badge">
                      <CheckIcon className="h-4 w-4" strokeWidth={3} />
                    </span>
                    <span className="text-ink">{standard}</span>
                  </li>
                ))}
              </ul>
            </article>

            <article className="card card-accent">
              <span className="icon-badge">
                <VanIcon className="h-8 w-8" />
              </span>
              <h3 className="card-title mt-6 text-2xl">Our vehicles</h3>
              <div className="mt-3 space-y-4 leading-relaxed text-muted">
                <p>
                  Our wheelchair-accessible vans have ramps or lifts, and our
                  stretcher vans are equipped to carry riders who need to lie
                  flat, so we can match every rider with the right ride.
                </p>
                <p>
                  We keep every vehicle clean and well maintained, and every
                  wheelchair and stretcher is secured before we pull away.
                </p>
              </div>
              <Button
                href="/services"
                variant="link"
                icon={ArrowRightIcon}
                iconPosition="right"
                className="mt-8"
              >
                See our services
              </Button>
            </article>
          </div>
        </div>
      </section>

      <CtaBand />
    </>
  );
};

export default About;
