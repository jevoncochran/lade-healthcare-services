// Account form rules. These mirror the API's checks so people see problems
// next to the right field before submitting; the API checks again.

export const PASSWORD_MIN_LENGTH = 8;

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export type FieldErrors = Partial<Record<string, string>>;

// Staff accounts use a single name field; customers use first + last.
export const checkName = (name: string) => {
  if (!name) return "Please enter your name.";
  if (name.length > 100) return "Please shorten your name.";
};

export const checkFirstName = (name: string) => {
  if (!name) return "Please enter your first name.";
  if (name.length > 50) return "Please use 50 characters or fewer.";
};

export const checkLastName = (name: string) => {
  if (!name) return "Please enter your last name.";
  if (name.length > 50) return "Please use 50 characters or fewer.";
};

export const checkEmail = (email: string) => {
  if (!email) return "Please enter your email address.";
  if (!EMAIL_PATTERN.test(email))
    return "Please enter a valid email address, like name@example.com.";
};

export const checkPhone = (phone: string) => {
  const digits = phone.replace(/\D/g, "");
  if (!phone) return "Please enter a phone number.";
  if (!(digits.length === 10 || (digits.length === 11 && digits.startsWith("1"))))
    return "Please enter a 10-digit phone number.";
};

export const checkNewPassword = (password: string, confirm: string) => {
  const errors: FieldErrors = {};
  if (password.length < PASSWORD_MIN_LENGTH)
    errors.password = `Use at least ${PASSWORD_MIN_LENGTH} characters. A short phrase of a few words works well.`;
  else if (password.length > 128)
    errors.password = "Please use 128 characters or fewer.";
  if (confirm !== password) errors.confirmPassword = "The passwords don't match.";
  return errors;
};

// Drops undefined entries so `Object.keys(errors).length` means "has errors".
export const compactErrors = (errors: FieldErrors) =>
  Object.fromEntries(
    Object.entries(errors).filter(([, value]) => value),
  ) as FieldErrors;

export const formText = (form: FormData, key: string) =>
  String(form.get(key) ?? "").trim();

// Passwords are never trimmed: spaces can be part of them.
export const formPassword = (form: FormData, key: string) =>
  String(form.get(key) ?? "");
