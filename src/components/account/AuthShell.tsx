import type { ReactNode } from "react";

// Layout for sign-in, sign-up and other account pages: a single centered card
// on a light gray section. Leave out `title` to show just the content (e.g. a
// confirmation that replaces a form).
const AuthShell = ({
  title,
  intro,
  children,
  footer,
}: {
  title?: string;
  intro?: ReactNode;
  children: ReactNode;
  /** Links at the bottom of the card, e.g. "Already have an account? Sign in". */
  footer?: ReactNode;
}) => {
  return (
    <section className="section section-alt">
      <div className="container-site">
        <div className="mx-auto max-w-lg">
          <div className="card p-6 sm:p-10">
            {title && <h1 className="section-title text-3xl">{title}</h1>}
            {intro && (
              <p className="mt-3 leading-relaxed text-muted">{intro}</p>
            )}
            <div className={title || intro ? "mt-8" : undefined}>
              {children}
            </div>
            {footer && (
              <div className="mt-8 space-y-2 border-t border-line pt-6 text-center text-muted">
                {footer}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default AuthShell;
