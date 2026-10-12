import Image from "next/image";
import Link from "next/link";

// Horizontal logo: the heart mark from the client's logo + the company name.
// The full stacked logo is at /assets/images/brand/lade-logo-full.jpg.
// `light` is for dark backgrounds (footer): the mark sits on a white tile
// because the source file has a white background.
// TODO: ask the client for a transparent PNG or SVG version of the logo.
const Logo = ({ light = false }: { light?: boolean }) => {
  return (
    <Link
      href="/"
      className="flex items-center gap-3"
      aria-label="Lade Health Care Services home"
    >
      <span
        className={`shrink-0 ${light ? "rounded-card bg-white p-1.5" : ""}`}
      >
        <Image
          src="/assets/images/brand/lade-mark.png"
          alt=""
          // Display size (48px tall). Next.js serves 1x/2x versions from this.
          width={57}
          height={48}
          className="h-12 w-auto"
          preload
        />
      </span>
      <span className="leading-none">
        <span
          className={`block font-heading text-2xl font-extrabold tracking-wide uppercase ${light ? "text-accent-light" : "text-accent"}`}
        >
          Lade
        </span>
        <span
          className={`mt-1 block text-[11px] font-bold tracking-[0.12em] uppercase ${light ? "text-white/80" : "text-primary"}`}
        >
          Health Care Services
        </span>
      </span>
    </Link>
  );
};

export default Logo;
