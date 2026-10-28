import type { ReactNode } from "react";
import PageHero from "@/components/PageHero";

// Layout for the Terms of Service and Privacy Notice: a plain header, a
// "draft" warning until Lade approves the text, and readable article styles
// for the h2 / p / ul / table inside.
const LegalPage = ({
  title,
  updated,
  draft = false,
  children,
}: {
  title: string;
  updated: string; // e.g. "October 28, 2026"
  /** Shows a prominent banner: the text isn't approved yet. */
  draft?: boolean;
  children: ReactNode;
}) => (
  <>
    <PageHero title={title} intro={`Last updated ${updated}`} />
    <section className="section">
      <div className="container-site">
        <div className="mx-auto max-w-3xl">
          {draft && (
            <p
              role="note"
              className="mb-10 rounded-card border-2 border-placeholder bg-placeholder/40 p-5 font-semibold text-ink"
            >
              DRAFT, not yet approved by Lade Health Care Services or reviewed
              by an attorney. Do not rely on this text.
            </p>
          )}
          <article className="space-y-5 leading-relaxed text-ink [&_a]:font-semibold [&_a]:text-secondary [&_a]:underline [&_h2]:pt-6 [&_h2]:font-heading [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:text-primary [&_h3]:pt-2 [&_h3]:font-heading [&_h3]:text-lg [&_h3]:font-bold [&_h3]:text-primary [&_li]:pl-1 [&_table]:w-full [&_table]:text-left [&_table]:text-sm [&_td]:border-b [&_td]:border-line [&_td]:py-2 [&_td]:pr-3 [&_th]:border-b-2 [&_th]:border-line [&_th]:py-2 [&_th]:pr-3 [&_th]:font-heading [&_ul]:list-disc [&_ul]:space-y-2 [&_ul]:pl-6">
            {children}
          </article>
        </div>
      </div>
    </section>
  </>
);

export default LegalPage;
