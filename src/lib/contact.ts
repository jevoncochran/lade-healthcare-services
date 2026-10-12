// Contact form: shared types, options and validation.
// Used by the form (client) and the Server Action (server).

export const contactTopics = [
  { value: "rider", label: "Rider or family member" },
  { value: "facility", label: "Facility or case manager" },
  { value: "billing", label: "Insurance or billing" },
  { value: "other", label: "Something else" },
] as const;

export type ContactTopic = (typeof contactTopics)[number]["value"];

export type ContactValues = {
  name: string;
  email: string;
  phone: string;
  topic: string;
  message: string;
};

export type ContactErrors = Partial<Record<keyof ContactValues, string>>;

export type ContactFormState = {
  status: "idle" | "success" | "error";
  message?: string;
  errors?: ContactErrors;
};

export const isContactTopic = (value: string): value is ContactTopic =>
  contactTopics.some((topic) => topic.value === value);

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const validateContact = (values: ContactValues): ContactErrors => {
  const errors: ContactErrors = {};

  if (!values.name) errors.name = "Please enter your name.";
  else if (values.name.length > 100) errors.name = "Please shorten your name.";

  if (!values.email) errors.email = "Please enter your email address.";
  else if (!EMAIL_PATTERN.test(values.email))
    errors.email = "Please enter a valid email address, like name@example.com.";

  const digits = values.phone.replace(/\D/g, "");
  if (
    values.phone &&
    !(digits.length === 10 || (digits.length === 11 && digits.startsWith("1")))
  )
    errors.phone = "Please enter a 10-digit phone number, or leave it blank.";

  if (!isContactTopic(values.topic))
    errors.topic = "Please choose what your message is about.";

  if (!values.message) errors.message = "Please enter a message.";
  else if (values.message.length < 10)
    errors.message = "Please add a little more detail so we can help.";
  else if (values.message.length > 2000)
    errors.message = "Please keep your message under 2,000 characters.";

  return errors;
};
