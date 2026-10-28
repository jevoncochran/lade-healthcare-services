// Business details used across the site.
// TODO (confirm with the owner): phone and address come from Lade's rate
// card and haven't been confirmed for the website yet.
//
// Service area: leads with Tampa Bay (where riders search, and where Lade's
// Google listing is) while making long-distance trips visible. Online booking
// covers Florida trips up to 50 miles per leg; longer and out-of-state trips
// are "call for a quote".
export const site = {
  name: "Lade Health Care Services",
  shortName: "Lade",
  tagline: "Safe, reliable non-emergency medical transportation",
  phone: "(708) 735-5701",
  phoneHref: "tel:+17087355701",
  email: "info@ladehcs.com",
  address: "5100 N Nebraska Ave, Tampa, FL 33603",
  serviceArea:
    "Based in Tampa · Serving Tampa Bay, with long-distance trips across Florida and beyond",
};

export const navLinks = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About Us" },
  { href: "/services", label: "Services" },
  { href: "/contact", label: "Contact" },
];
