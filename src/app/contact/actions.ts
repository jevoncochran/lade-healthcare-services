"use server";

import {
  contactTopics,
  validateContact,
  type ContactFormState,
  type ContactValues,
} from "@/lib/contact";
import { sendInquiry } from "@/lib/notify";

const text = (formData: FormData, key: string) =>
  String(formData.get(key) ?? "").trim();

export const sendContactMessage = async (
  _prevState: ContactFormState,
  formData: FormData,
): Promise<ContactFormState> => {
  // Honeypot: real visitors never see or fill this field; bots usually do.
  // Pretend it worked so the bot moves on.
  if (text(formData, "company")) return { status: "success" };

  const values: ContactValues = {
    name: text(formData, "name"),
    email: text(formData, "email"),
    phone: text(formData, "phone"),
    topic: text(formData, "topic"),
    message: text(formData, "message"),
  };

  const errors = validateContact(values);
  if (Object.keys(errors).length > 0) {
    return {
      status: "error",
      message: "Please fix the highlighted fields and try again.",
      errors,
    };
  }

  try {
    const topicLabel =
      contactTopics.find((topic) => topic.value === values.topic)?.label ??
      values.topic;
    await sendInquiry(`Website message from ${values.name}`, {
      Name: values.name,
      Email: values.email,
      Phone: values.phone || "Not provided",
      Topic: topicLabel,
      Message: values.message,
    });
  } catch (error) {
    console.error("[contact] failed to send message", error);
    return {
      status: "error",
      message:
        "Sorry, we couldn't send your message. Please call us or try again in a few minutes.",
    };
  }

  return { status: "success" };
};
