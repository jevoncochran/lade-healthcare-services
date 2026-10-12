import Button from "./Button";
import { PhoneIcon } from "./Icons";
import { site } from "@/lib/site";

// Green "Need a ride today?" band shown near the bottom of most pages.
const CtaBand = ({
  title = "Need a ride today?",
  text = "Our team is standing by 24 hours a day, 7 days a week, including holidays.",
}: {
  title?: string;
  text?: string;
}) => {
  return (
    <section className="bg-accent py-16 text-white">
      <div className="container-site flex flex-col items-center justify-between gap-8 text-center lg:flex-row lg:text-left">
        <div>
          <h2 className="section-title text-white">{title}</h2>
          <p className="mt-2 text-lg text-white/90">{text}</p>
        </div>
        <div className="flex flex-col gap-4 sm:flex-row">
          <Button
            href={site.phoneHref}
            variant="light"
            size="lg"
            icon={PhoneIcon}
          >
            Call {site.phone}
          </Button>
          <Button href="/book-a-ride" variant="outline-light" size="lg">
            Book Online
          </Button>
        </div>
      </div>
    </section>
  );
};

export default CtaBand;
