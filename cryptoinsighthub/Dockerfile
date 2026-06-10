# Multi-stage Dockerfile for Railway deployment
# - Stage 1: build the Vite React app with Node
# - Stage 2: serve the built `dist/` with Caddy (uses the Caddyfile that reads $PORT)
#
# Railway will set the $PORT environment variable at runtime. The Caddyfile
# included in the repo should reference that ($PORT) so Caddy listens on the
# assigned port (example Caddyfile uses :{$PORT:3000}).
#
# To build locally:
#   docker build -t cryptoinsighthub:latest .
# To run locally (quick test):
#   docker run -e PORT=3000 -p 3000:3000 cryptoinsighthub:latest
#
# The image expects that `npm run build` produces a `dist/` directory (Vite default).

############################
# Stage 1: Build
############################
FROM node:18-alpine AS builder

# Reduce unnecessary npm logs in build output
ENV NPM_CONFIG_UPDATE_NOTIFIER=false \
    NPM_CONFIG_FUND=false \
    NODE_ENV=production

WORKDIR /app

# Install build tools used by some packages (kept minimal)
RUN apk add --no-cache python3 make g++

# Copy package manifests first to leverage Docker cache
COPY package.json package-lock.json ./

# Install deps (full install for build)
RUN npm ci --silent

# Copy the rest of the source and build
COPY . .

# Ensure the TypeScript build (if present) and Vite build run
# The project's package.json should provide suitable "build" script
RUN npm run build

############################
# Stage 2: Production image with Caddy
############################
FROM caddy:2-alpine

# Helpful metadata
LABEL org.opencontainers.image.title="CryptoInsightHub" \
      org.opencontainers.image.description="Vite + React app served with Caddy (Railway-optimized)" \
      org.opencontainers.image.authors="(maintainer)"

# Default workdir where we'll place the static files
WORKDIR /srv

# Copy the Caddyfile from the build context to Caddy's default config location.
# The project's Caddyfile should be configured to listen on :{$PORT:3000}
# so Railway's provided $PORT is used at runtime.
COPY Caddyfile /etc/caddy/Caddyfile

# Format the Caddyfile to validate it and normalize whitespace (non-fatal)
# If `caddy fmt` isn't available for some reason, the command failing should not
# break the build – that's why `|| true` is used.
RUN caddy fmt --overwrite /etc/caddy/Caddyfile || true

# Copy built static assets from the builder stage
COPY --from=builder /app/dist /srv/dist

# Expose a reasonable default port (Railway will override via $PORT env).
# The Caddyfile should bind to the env var; exposing this port here documents intent.
ENV PORT=3000
EXPOSE 3000

# Use Caddy to run with the provided Caddyfile.
# The Caddyfile is expected to bind to :{$PORT:3000} so Railway's $PORT works.
CMD ["caddy", "run", "--config", "/etc/caddy/Caddyfile", "--adapter", "caddyfile"]
