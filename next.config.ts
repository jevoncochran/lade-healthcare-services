import type { NextConfig } from "next";

// Pages opened from emailed links carry a one-time token in the URL. Tell the
// browser never to send that URL to other sites (e.g. when following a link
// or loading a third-party resource).
const tokenPages = ["/verify-email", "/reset-password", "/admin/accept-invite"];

const nextConfig: NextConfig = {
  // A self-contained server (.next/standalone) for the Docker image that
  // runs on Google Cloud Run. See Dockerfile.
  output: "standalone",
  headers: async () =>
    tokenPages.map((source) => ({
      source,
      headers: [{ key: "Referrer-Policy", value: "no-referrer" }],
    })),
};

export default nextConfig;
