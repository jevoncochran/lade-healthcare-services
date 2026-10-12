import type { Metadata } from "next";
import Button from "@/components/Button";
import SectionHeader from "@/components/SectionHeader";
import {
  ArrowRightIcon,
  CheckIcon,
  PhoneIcon,
  WheelchairIcon,
} from "@/components/Icons";

// Internal reference page: shows every design token and component class.
// Everything here is driven by src/app/globals.css — edit tokens there.
export const metadata: Metadata = {
  title: "Style Guide",
  robots: { index: false, follow: false },
};

const colors = [
  {
    name: "primary",
    className: "bg-primary",
    use: "Navy — header bar, dark sections, headings",
  },
  { name: "primary-dark", className: "bg-primary-dark", use: "Footer" },
  {
    name: "secondary",
    className: "bg-secondary",
    use: "Blue — links, icons, card accents, panels",
  },
  {
    name: "secondary-light",
    className: "bg-secondary-light",
    use: "Focus outlines",
  },
  {
    name: "accent",
    className: "bg-accent",
    use: "Green — primary buttons, checkmarks, CTA band",
  },
  {
    name: "accent-dark",
    className: "bg-accent-dark",
    use: "Primary button hover",
  },
  {
    name: "accent-light",
    className: "bg-accent-light",
    use: "Accent on dark backgrounds",
  },
  {
    name: "surface",
    className: "bg-surface",
    use: "Light gray sections and panels",
  },
  { name: "ink", className: "bg-ink", use: "Body text" },
  { name: "muted", className: "bg-muted", use: "Secondary text" },
  { name: "line", className: "bg-line", use: "Borders and dividers" },
];

const Block = ({
  title,
  token,
  children,
}: {
  title: string;
  token: string;
  children: React.ReactNode;
}) => {
  return (
    <div className="border-t border-line py-10">
      <div className="mb-6 flex flex-wrap items-baseline justify-between gap-2">
        <h2 className="card-title">{title}</h2>
        <code className="text-sm text-muted">{token}</code>
      </div>
      {children}
    </div>
  );
};

const StyleGuide = () => {
  return (
    <div className="section">
      <div className="container-site">
        <h1 className="section-title">Style Guide</h1>
        <p className="section-lead mt-4 max-w-2xl">
          Every color, font and component on the site comes from{" "}
          <code>src/app/globals.css</code>. Change a token there and this page —
          and the whole site — updates.
        </p>

        <div className="mt-12">
          <Block title="Colors" token="--color-*">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {colors.map((c) => (
                <div
                  key={c.name}
                  className="overflow-hidden rounded-card border border-line"
                >
                  <div className={`h-20 ${c.className}`} />
                  <div className="p-4">
                    <p className="font-heading font-semibold text-primary">
                      {c.name}
                    </p>
                    <p className="mt-1 text-sm text-muted">{c.use}</p>
                  </div>
                </div>
              ))}
            </div>
          </Block>

          <Block title="Typography" token="--font-heading / --font-sans">
            <div className="space-y-6">
              <div className="rounded-card bg-primary p-8 text-white">
                <p className="display">Display headline</p>
                <p className="mt-2 text-sm text-white/70">
                  .display — hero headline, one per page
                </p>
              </div>
              <div>
                <p className="section-title">Section title</p>
                <p className="section-lead mt-4 max-w-2xl">
                  Section lead — the intro paragraph that sits under a section
                  title.
                </p>
                <p className="mt-2 text-sm text-muted">
                  .section-title · .section-lead
                </p>
              </div>
              <div>
                <p className="card-title">Card title</p>
                <p className="mt-2 text-ink">
                  Body text in the ink color using the sans font.
                </p>
                <p className="mt-1 text-muted">
                  Muted text for secondary information.
                </p>
                <p className="mt-2 text-sm text-muted">
                  .card-title · text-ink · text-muted
                </p>
              </div>
            </div>
          </Block>

          <Block title="Buttons" token="<Button variant size icon>">
            <div className="flex flex-wrap items-center gap-4">
              <Button>variant=&quot;primary&quot;</Button>
              <Button variant="outline">variant=&quot;outline&quot;</Button>
              <Button size="lg" icon={ArrowRightIcon} iconPosition="right">
                size=&quot;lg&quot;
              </Button>
              <Button
                href="#"
                variant="link"
                icon={ArrowRightIcon}
                iconPosition="right"
              >
                variant=&quot;link&quot;
              </Button>
            </div>
            <div className="mt-6 flex flex-wrap items-center gap-4 rounded-card bg-primary p-6">
              <Button variant="light" icon={PhoneIcon}>
                variant=&quot;light&quot;
              </Button>
              <Button variant="outline-light">
                variant=&quot;outline-light&quot;
              </Button>
            </div>
          </Block>

          <Block title="Cards & panels" token="--radius-* / --shadow-*">
            <div className="grid gap-6 rounded-card bg-surface p-6 md:grid-cols-3">
              <div className="card">
                <p className="card-title">.card</p>
                <p className="mt-2 text-muted">Base white card.</p>
              </div>
              <div className="group card card-hover card-accent">
                <span className="icon-badge">
                  <WheelchairIcon className="h-8 w-8" />
                </span>
                <p className="card-title mt-6">.card-accent</p>
                <p className="mt-2 text-muted">+ .card-hover and .icon-badge</p>
              </div>
              <div className="panel">
                <p className="font-heading text-xl font-bold">.panel</p>
                <p className="mt-2 text-white/80">Colored feature block.</p>
              </div>
            </div>
            <div className="mt-6 flex items-center gap-4">
              <span className="check-badge">
                <CheckIcon className="h-4 w-4" strokeWidth={3} />
              </span>
              <span className="text-lg">
                .check-badge — bullet list checkmark
              </span>
            </div>
          </Block>

          <Block title="Sections" token="--section-y">
            <div className="space-y-4">
              <div className="rounded-card border border-line p-8">
                <SectionHeader
                  title="White section"
                  lead="Default background."
                />
              </div>
              <div className="section-alt rounded-card p-8">
                <SectionHeader
                  title="Light gray section"
                  lead="Alternate background."
                />
              </div>
              <div className="section-dark rounded-card p-8">
                <SectionHeader
                  title="Navy section"
                  lead="Headings and text switch to light colors automatically."
                />
              </div>
            </div>
          </Block>
        </div>
      </div>
    </div>
  );
};

export default StyleGuide;
