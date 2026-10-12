"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import Button from "./Button";
import Logo from "./Logo";
import {
  ClockIcon,
  CloseIcon,
  MailIcon,
  MenuIcon,
  PhoneIcon,
  UserIcon,
} from "./Icons";
import { navLinks, site } from "@/lib/site";

const Header = () => {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm">
      {/* Utility bar */}
      <div className="bg-primary text-sm text-white">
        <div className="container-site flex h-10 items-center justify-between gap-4">
          <p className="flex items-center gap-2">
            <ClockIcon className="h-4 w-4 text-accent-light" />
            <span>
              <span className="font-semibold">Open 24/7</span>
              <span className="hidden sm:inline">
                {" "}
                · Weekends, after hours &amp; holidays
              </span>
            </span>
          </p>
          <div className="flex items-center gap-5">
            <Link
              href="/account"
              className="flex items-center gap-2 hover:underline"
            >
              <UserIcon className="h-4 w-4" />
              My Account
            </Link>
            <a
              href={`mailto:${site.email}`}
              className="hidden items-center gap-2 hover:underline md:flex"
            >
              <MailIcon className="h-4 w-4" />
              {site.email}
            </a>
            <a
              href={site.phoneHref}
              className="flex items-center gap-2 font-semibold hover:underline"
            >
              <PhoneIcon className="h-4 w-4" />
              {site.phone}
            </a>
          </div>
        </div>
      </div>

      {/* Main nav */}
      <div className="container-site flex h-20 items-center justify-between">
        <Logo />

        <nav aria-label="Main" className="hidden items-center gap-8 lg:flex">
          {navLinks.map((link) => {
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                aria-current={active ? "page" : undefined}
                className={`relative py-2 text-[15px] font-medium transition-colors hover:text-secondary ${
                  active
                    ? "text-secondary after:absolute after:inset-x-0 after:-bottom-0.5 after:h-0.5 after:rounded after:bg-accent"
                    : "text-ink"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
          <Button href="/book-a-ride">Book a Ride</Button>
        </nav>

        <button
          type="button"
          className="grid h-11 w-11 place-items-center rounded-md text-primary lg:hidden"
          aria-expanded={open}
          aria-controls="mobile-nav"
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen((o) => !o)}
        >
          {open ? (
            <CloseIcon className="h-7 w-7" />
          ) : (
            <MenuIcon className="h-7 w-7" />
          )}
        </button>
      </div>

      {open && (
        <nav
          id="mobile-nav"
          aria-label="Mobile"
          className="border-t border-line bg-white lg:hidden"
        >
          <div className="container-site flex flex-col py-4">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className={`border-b border-line py-3 text-lg font-medium ${
                  pathname === link.href ? "text-secondary" : "text-ink"
                }`}
              >
                {link.label}
              </Link>
            ))}
            <Button
              href="/book-a-ride"
              onClick={() => setOpen(false)}
              className="mt-4"
            >
              Book a Ride
            </Button>
            <Button
              href={site.phoneHref}
              variant="outline"
              icon={PhoneIcon}
              className="mt-3"
            >
              Call {site.phone}
            </Button>
          </div>
        </nav>
      )}
    </header>
  );
};

export default Header;
