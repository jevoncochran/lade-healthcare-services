import Image from "next/image";
import type { ReactNode } from "react";

// Header for inner pages (Services, About, Contact…).
//
// layout="background" (default): the photo fills the header behind the text,
//   with a navy fade on the left. Crops the photo, so use `imagePosition`
//   to keep the subject in frame.
// layout="split": text on the left, the whole photo on the right at its
//   natural shape (stacks under the text on phones). Use it when the photo
//   needs to be seen in full.
// No `image`: a plain navy header with just the text.

// background layout only: how tall the header is, so more of the photo shows.
const heights = {
  default: "",
  tall: "min-h-[360px] lg:min-h-[480px]",
  taller: "min-h-[420px] sm:min-h-[520px] lg:min-h-[680px]",
};

const PageHero = ({
  title,
  intro,
  image,
  imageAlt = "",
  imagePosition = "object-center",
  layout = "background",
  height = "default",
  children,
}: {
  title: string;
  intro?: ReactNode;
  image?: string;
  imageAlt?: string;
  /** background layout only: Tailwind object-position classes, e.g. "object-[70%_30%]". */
  imagePosition?: string;
  layout?: "background" | "split";
  /** background layout only: a taller header crops the photo less. */
  height?: keyof typeof heights;
  /** Buttons or other content under the intro. */
  children?: ReactNode;
}) => {
  const copy = (
    <div className="max-w-2xl text-white">
      <h1 className="display">{title}</h1>
      {intro && (
        <p className="mt-6 max-w-xl text-lg text-white/85 sm:text-xl">
          {intro}
        </p>
      )}
      {children && (
        <div className="mt-9 flex flex-col gap-4 sm:flex-row">{children}</div>
      )}
    </div>
  );

  if (!image) {
    return (
      <section className="bg-primary">
        <div className="container-site py-14 sm:py-16 lg:py-20">{copy}</div>
      </section>
    );
  }

  if (layout === "split") {
    return (
      <section className="bg-primary">
        <div className="container-site grid items-center gap-10 py-12 sm:py-14 lg:grid-cols-2 lg:gap-14 lg:py-16">
          {copy}
          <div className="relative aspect-[3/2] overflow-hidden rounded-panel shadow-float">
            <Image
              src={image}
              alt={imageAlt}
              fill
              preload
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="object-cover"
            />
          </div>
        </div>
      </section>
    );
  }

  return (
    <section
      className={`relative isolate flex items-center overflow-hidden bg-primary ${heights[height]}`}
    >
      <Image
        src={image}
        alt={imageAlt}
        fill
        preload
        sizes="100vw"
        className={`-z-10 object-cover ${imagePosition}`}
      />
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-primary via-primary/85 to-primary/10 lg:via-primary/30" />
      <div className="container-site w-full py-14 sm:py-16 lg:py-20">
        {copy}
      </div>
    </section>
  );
};

export default PageHero;
