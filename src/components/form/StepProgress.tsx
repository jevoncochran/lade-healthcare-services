// "Step 2 of 5" over a bar per step, for forms split into steps (booking,
// staff account setup). The current step's name is highlighted; names are
// hidden on phones to save space.
const StepProgress = ({
  steps,
  current,
  label,
}: {
  steps: readonly string[];
  current: number;
  /** For screen readers, e.g. "Booking steps". */
  label: string;
}) => (
  <div>
    <p className="text-sm font-semibold text-secondary">
      Step {current + 1} of {steps.length}
    </p>
    <ol className="mt-3 flex gap-2" aria-label={label}>
      {steps.map((name, index) => (
        <li
          key={name}
          className="flex-1"
          aria-current={index === current ? "step" : undefined}
        >
          <span
            className={`block h-1.5 rounded-full ${index <= current ? "bg-secondary" : "bg-line"}`}
          />
          <span
            className={`mt-2 hidden text-xs sm:block ${index === current ? "font-semibold text-primary" : "text-muted"}`}
          >
            {name}
          </span>
        </li>
      ))}
    </ol>
  </div>
);

export default StepProgress;
