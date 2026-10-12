import type { Faq } from "@/lib/faqs";

// Expandable question/answer list. Uses native <details>, so it works
// without JavaScript and is keyboard accessible by default.
const FaqList = ({ faqs }: { faqs: Faq[] }) => {
  return (
    <div className="divide-y divide-line rounded-card border border-line bg-white">
      {faqs.map(({ question, answer }) => (
        <details key={question} className="group px-6 py-5">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-6 font-heading text-lg font-semibold text-primary [&::-webkit-details-marker]:hidden">
            {question}
            <span
              aria-hidden="true"
              className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-secondary/10 text-xl leading-none text-secondary transition-transform group-open:rotate-45"
            >
              +
            </span>
          </summary>
          <p className="mt-3 max-w-3xl leading-relaxed text-muted">{answer}</p>
        </details>
      ))}
    </div>
  );
};

export default FaqList;
