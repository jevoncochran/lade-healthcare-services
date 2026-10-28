// Calls the Lade booking API (lade-hcs-server) from the browser.
//
// Requests go to this site's own /api/*, which forwards them to the API
// (src/app/api/[...path]/route.ts). So the API's sign-in session cookie
// (httpOnly: page scripts can't read it) is always first-party, on any
// domain. Only use this from Client Components.

const API_URL = "/api";

export type ApiResult<T> =
  | { ok: true; status: number; data: T }
  | { ok: false; status: number; message: string };

const FALLBACK_ERROR =
  "Something went wrong. Please try again, or call us if it keeps happening.";

// The API sends { message: string | string[] } on errors (a list for form
// validation problems). Turn that into one sentence for the page.
const errorMessage = (body: unknown, status: number) => {
  if (status === 429) {
    return "Too many attempts. Please wait a minute and try again.";
  }
  const message = (body as { message?: unknown } | null)?.message;
  if (Array.isArray(message)) return message.join(". ");
  if (typeof message === "string") return message;
  return FALLBACK_ERROR;
};

export const api = async <T = unknown>(
  path: string,
  init: { method?: "GET" | "POST"; body?: object } = {},
): Promise<ApiResult<T>> => {
  let response: Response;
  try {
    response = await fetch(`${API_URL}${path}`, {
      method: init.method ?? (init.body ? "POST" : "GET"),
      credentials: "include",
      headers: init.body ? { "Content-Type": "application/json" } : undefined,
      body: init.body ? JSON.stringify(init.body) : undefined,
    });
  } catch {
    return {
      ok: false,
      status: 0,
      message:
        "We couldn't reach our booking system. Check your connection and try again.",
    };
  }

  const body: unknown =
    response.status === 204 ? null : await response.json().catch(() => null);

  return response.ok
    ? { ok: true, status: response.status, data: body as T }
    : {
        ok: false,
        status: response.status,
        message: errorMessage(body, response.status),
      };
};

// ---------- Response shapes ----------

export type Customer = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  emailVerified: boolean;
};

export type Staff = {
  id: string;
  email: string;
  name: string;
  role: "ADMIN" | "DISPATCHER";
};

export type InviteSetup = {
  // "reset": an existing account getting a new password and phone code.
  kind: "invite" | "reset";
  name: string | null; // the account's current name, for a reset
  email: string;
  role: Staff["role"];
  otpauthUrl: string;
  qrCodeDataUrl: string;
  secret: string;
};

// Only allow redirects to pages on this site after signing in, never to
// another site (e.g. /login?next=https://evil.example).
export const safeNextPath = (next: string | null, fallback: string) =>
  next && next.startsWith("/") && !next.startsWith("//") ? next : fallback;
