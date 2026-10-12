import type { Metadata } from "next";
import Button from "@/components/Button";
import {
  ArrowRightIcon,
  ClockIcon,
  MailIcon,
  MapPinIcon,
  PhoneIcon,
} from "@/components/Icons";
import PageHero from "@/components/PageHero";
import { isContactTopic } from "@/lib/contact";
import { site } from "@/lib/site";
import ContactForm from "./ContactForm";

export const metadata: Metadata = {
  title: "Contact Us",
  description:
    "Call Lade Health Care Services 24 hours a day, 7 days a week, or send us a message. Questions about rides, coverage or facility accounts are welcome.",
};

const Contact = async ({ searchParams }: PageProps<"/contact">) => {
  // /contact?topic=facility preselects the topic (used by the Services page).
  const { topic } = await searchParams;
  const defaultTopic =
    typeof topic === "string" && isContactTopic(topic) ? topic : "";

  return (
    <>
      <PageHero
        title="Contact Us"
        intro="Questions about a ride, your coverage or setting up an account? Call us any time, day or night, or send us a message."
      />

      <section className="section">
        <div className="container-site grid gap-10 lg:grid-cols-[380px_1fr] lg:gap-14">
          {/* Contact details */}
          <div className="space-y-6">
            <div className="rounded-panel bg-primary p-8 text-white">
              <p className="flex items-center gap-2 font-heading text-sm font-semibold tracking-wide text-accent-light uppercase">
                <ClockIcon className="h-4 w-4" />
                Open 24/7, including holidays
              </p>
              <h2 className="mt-4 font-heading text-lg font-semibold text-white/80">
                The fastest way to reach us
              </h2>
              <a
                href={site.phoneHref}
                className="mt-1 block font-heading text-3xl font-bold hover:underline"
              >
                {site.phone}
              </a>
              <p className="mt-3 text-white/75">
                A real person answers, any time of day.
              </p>
            </div>

            <ul className="card space-y-6">
              <li className="flex gap-4">
                <MailIcon className="mt-0.5 h-6 w-6 shrink-0 text-accent" />
                <div>
                  <p className="form-label">Email</p>
                  <a
                    href={`mailto:${site.email}`}
                    className="mt-1 block break-all text-secondary hover:underline"
                  >
                    {site.email}
                  </a>
                </div>
              </li>
              <li className="flex gap-4">
                <MapPinIcon className="mt-0.5 h-6 w-6 shrink-0 text-accent" />
                <div>
                  <p className="form-label">Service area</p>
                  <p className="mt-1 text-muted">{site.serviceArea}</p>
                </div>
              </li>
              <li className="flex gap-4">
                <PhoneIcon className="mt-0.5 h-6 w-6 shrink-0 text-accent" />
                <div>
                  <p className="form-label">Need to book a ride?</p>
                  <p className="mt-1 text-muted">
                    Call us, or request a ride online.
                  </p>
                  <Button
                    href="/book-a-ride"
                    variant="link"
                    icon={ArrowRightIcon}
                    iconPosition="right"
                    className="mt-2"
                  >
                    Book a Ride
                  </Button>
                </div>
              </li>
            </ul>
          </div>

          {/* Message form */}
          <div className="card p-6 sm:p-10">
            <h2 className="section-title text-3xl">Send us a message</h2>
            <p className="mt-3 text-muted">
              We&apos;ll get back to you as soon as we can. Facilities and case
              managers can use this form to set up an account.
            </p>
            <div className="mt-8">
              <ContactForm defaultTopic={defaultTopic} />
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Contact;
