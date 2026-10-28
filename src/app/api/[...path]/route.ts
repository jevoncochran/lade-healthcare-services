import type { NextRequest } from "next/server";

// Forwards /api/* to the booking API (lade-hcs-server), so the browser only
// ever talks to this site's own address. That keeps the API's sign-in cookie
// a first-party cookie on any domain: on Google's temporary *.run.app
// addresses (which browsers treat as unrelated sites) and on ladehcs.com.
//
// API_URL is read when the site starts (e.g. http://localhost:4000 locally,
// the API's Cloud Run address in production), so one build works anywhere.
// Requests pass through unchanged: method, cookies, body bytes (Stripe
// verifies webhook signatures on them), Origin (the API's same-site check)
// and X-Forwarded-For (its per-visitor rate limits). Nothing is logged here:
// these requests carry patient information.

export const dynamic = "force-dynamic";

const UNREACHABLE = JSON.stringify({
  message:
    "We couldn't reach our booking system. Check your connection and try again.",
});

// Connection-specific headers that mustn't be passed on, plus ones fetch
// sets itself (the body is re-sent, and responses arrive decompressed).
const HOP_BY_HOP = new Set([
  "connection",
  "keep-alive",
  "proxy-authenticate",
  "proxy-authorization",
  "te",
  "trailer",
  "transfer-encoding",
  "upgrade",
  "host",
  "content-length",
  "content-encoding",
]);

const forward = async (request: NextRequest) => {
  const apiUrl = process.env.API_URL?.replace(/\/$/, "");
  if (!apiUrl) {
    return new Response(UNREACHABLE, {
      status: 503,
      headers: { "content-type": "application/json" },
    });
  }

  // "/api/bookings/123?x=1" → "<API_URL>/bookings/123?x=1". Joined as a
  // string (never resolved as a URL), so the target is always the API.
  const path = request.nextUrl.pathname.slice("/api".length);
  const target = `${apiUrl}${path}${request.nextUrl.search}`;

  const headers = new Headers();
  request.headers.forEach((value, name) => {
    if (!HOP_BY_HOP.has(name)) headers.set(name, value);
  });

  let upstream: Response;
  try {
    upstream = await fetch(target, {
      method: request.method,
      headers,
      body: ["GET", "HEAD"].includes(request.method)
        ? undefined
        : await request.arrayBuffer(),
      redirect: "manual",
      cache: "no-store",
      signal: AbortSignal.timeout(30_000),
    });
  } catch {
    return new Response(UNREACHABLE, {
      status: 502,
      headers: { "content-type": "application/json" },
    });
  }

  const responseHeaders = new Headers();
  upstream.headers.forEach((value, name) => {
    if (!HOP_BY_HOP.has(name) && name !== "set-cookie") {
      responseHeaders.set(name, value);
    }
  });
  // Several cookies can be set at once; each needs its own header.
  for (const cookie of upstream.headers.getSetCookie()) {
    responseHeaders.append("set-cookie", cookie);
  }

  return new Response(upstream.body, {
    status: upstream.status,
    headers: responseHeaders,
  });
};

export const GET = forward;
export const POST = forward;
export const PUT = forward;
export const PATCH = forward;
export const DELETE = forward;
