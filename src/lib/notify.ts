import "server-only";

// Delivers form submissions to the business.
//
// TODO (launch blocker): connect an email service (e.g. Resend, Postmark or
// SendGrid) and send to the client's inbox. Until then submissions are only
// written to the server log, so nobody at Lade will see them.
export const sendInquiry = async (
  subject: string,
  fields: Record<string, string>,
) => {
  const body = Object.entries(fields)
    .map(([key, value]) => `${key}: ${value}`)
    .join("\n");

  console.info(`[inquiry] ${subject}\n${body}`);
};
