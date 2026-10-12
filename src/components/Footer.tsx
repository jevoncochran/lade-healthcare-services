import Link from "next/link";
import Logo from "./Logo";
import { ClockIcon, MailIcon, MapPinIcon, PhoneIcon } from "./Icons";
import { services } from "@/lib/services";
import { navLinks, site } from "@/lib/site";

const Footer = () => {
  return (
    <footer className="bg-primary-dark text-white/80">
      <div className="container-site grid gap-10 py-16 md:grid-cols-2 lg:grid-cols-4">
        <div className="space-y-4">
          <Logo light />
          <p className="text-sm leading-relaxed">
            Non-emergency medical transportation for seniors, people with
            disabilities, patients and facilities — available 24 hours a day,
            365 days a year.
          </p>
        </div>

        <div>
          <h2 className="footer-heading">Quick Links</h2>
          <ul className="space-y-2 text-sm">
            {[...navLinks, { href: "/book-a-ride", label: "Book a Ride" }].map(
              (link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="hover:text-white hover:underline"
                  >
                    {link.label}
                  </Link>
                </li>
              ),
            )}
          </ul>
        </div>

        <div>
          <h2 className="footer-heading">Services</h2>
          <ul className="space-y-2 text-sm">
            {services.map(({ id, title }) => (
              <li key={id}>
                <Link
                  href={`/services#${id}`}
                  className="hover:text-white hover:underline"
                >
                  {title}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="footer-heading">Contact</h2>
          <ul className="space-y-3 text-sm">
            <li className="flex gap-3">
              <PhoneIcon className="mt-0.5 h-4 w-4 shrink-0 text-accent-light" />
              <a
                href={site.phoneHref}
                className="font-semibold text-white hover:underline"
              >
                {site.phone}
              </a>
            </li>
            <li className="flex gap-3">
              <MailIcon className="mt-0.5 h-4 w-4 shrink-0 text-accent-light" />
              <a
                href={`mailto:${site.email}`}
                className="hover:text-white hover:underline"
              >
                {site.email}
              </a>
            </li>
            <li className="flex gap-3">
              <MapPinIcon className="mt-0.5 h-4 w-4 shrink-0 text-accent-light" />
              <span>{site.serviceArea}</span>
            </li>
            <li className="flex gap-3">
              <ClockIcon className="mt-0.5 h-4 w-4 shrink-0 text-accent-light" />
              <span>24/7 rides &amp; customer service, including holidays</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="container-site flex flex-col gap-2 py-6 text-xs sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} {site.name}. All rights reserved.
          </p>
          <p>For medical emergencies, call 911.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
