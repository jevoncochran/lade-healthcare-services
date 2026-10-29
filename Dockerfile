# The website's container for Google Cloud Run.
#
# Built by Google Cloud Build from this folder (no Docker needed locally):
#   gcloud run deploy lade-website --source . --region us-east1
#
# Runs the self-contained Next.js server (output: "standalone" in
# next.config.ts). Settings like API_URL are read when the container starts,
# so the same image works for testing and production.

# 1. Dependencies, from the lockfile exactly. .npmrc comes along: it sets
#    legacy-peer-deps, the way the lockfile was made.
FROM node:22-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json .npmrc ./
RUN npm ci --no-audit --no-fund

# 2. Build.
FROM node:22-alpine AS build
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ENV NEXT_TELEMETRY_DISABLED=1
RUN npm run build

# 3. The image that runs: only the standalone server, static files and
#    public assets, as an unprivileged user.
FROM node:22-alpine AS run
WORKDIR /app
ENV NODE_ENV=production \
    NEXT_TELEMETRY_DISABLED=1 \
    HOSTNAME=0.0.0.0 \
    PORT=8080
COPY --from=build --chown=node:node /app/.next/standalone ./
COPY --from=build --chown=node:node /app/.next/static ./.next/static
COPY --from=build --chown=node:node /app/public ./public
USER node
EXPOSE 8080
CMD ["node", "server.js"]
