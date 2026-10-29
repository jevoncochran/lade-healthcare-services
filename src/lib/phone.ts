import type { FormEvent } from "react";

// US phone numbers, shown and typed as (813) 555-0100. The API accepts any
// common format and stores what it's sent; it matches numbers on their
// digits, so formatting never stops a lookup from working.

// The 10 digits, without a leading 1 country code. US area codes never
// start with 0 or 1, so a leading 1 is always the country code.
const tenDigits = (value: string) =>
  value.replace(/\D/g, "").replace(/^1/, "").slice(0, 10);

// For showing a number: "8135550100", "+1 813-555-0100" → "(813) 555-0100".
// Anything that isn't a US number is shown as it is.
export const formatPhone = (value: string) => {
  const digits = value.replace(/\D/g, "");
  if (digits.length === 10 || (digits.length === 11 && digits[0] === "1")) {
    const d = digits.slice(-10);
    return `(${d.slice(0, 3)}) ${d.slice(3, 6)}-${d.slice(6)}`;
  }
  return value;
};

// While typing: "813" → "(813", "8135" → "(813) 5", "8135550100" →
// "(813) 555-0100". Stops at 10 digits.
export const formatPhoneInput = (value: string) => {
  const d = tenDigits(value);
  if (d.length === 0) return "";
  if (d.length <= 3) return `(${d}`;
  if (d.length <= 6) return `(${d.slice(0, 3)}) ${d.slice(3)}`;
  return `(${d.slice(0, 3)}) ${d.slice(3, 6)}-${d.slice(6)}`;
};

// Props for a phone <input> (works with <InputField> and plain inputs; the
// forms stay uncontrolled). Formats as you type when the caret is at the
// end, so fixing a digit in the middle doesn't make the caret jump. On
// leaving the field, formats only a complete number: anything else (e.g. an
// 11th digit added mid-edit) stays as typed for the form's check to flag,
// rather than silently dropping a digit.
export const phoneInputProps = {
  type: "tel",
  inputMode: "tel",
  autoComplete: "tel",
  placeholder: "(813) 555-0100",
  onInput: (event: FormEvent<HTMLInputElement>) => {
    const input = event.currentTarget;
    if (input.selectionStart === input.value.length) {
      input.value = formatPhoneInput(input.value);
    }
  },
  onBlur: (event: FormEvent<HTMLInputElement>) => {
    const input = event.currentTarget;
    input.value = formatPhone(input.value);
  },
} as const;
