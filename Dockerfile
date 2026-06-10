# Multi-stage Dockerfile for Railway deployment
# - Stage 1: build the Vite React app with Node
# - Stage 2: serve the built `dist/` with Caddy (Caddyfile is embedded)
#
# Railway will set the $PORT environment variable at runtime. The embedded
# Caddyfile binds to :{$PORT:3000} so that it uses Railway's provided port
# (falls back to 3000 locally).
#
# To build locally:
#   cd cryptoinsighthub
#   docker build -t cryptoinsighthub:latest .
#
# To run locally (quick test):
#   docker run -e PORT=3000 -p 3000:3000 cryptoinsighthub:latest

########################################
# Stage 1: Build
########################################
FROM node:18-alpine AS builder

# Reduce unnecessary npm logs in build output
ENV NPM_CONFIG_UPDATE_NOTIFIER=false \
    NPM_CONFIG_FUND=false \
    NODE_ENV=production

WORKDIR /app

# Some packages require build tools; keep this minimal
RUN apk add --no-cache python3 make g++

# Copy package manifests first for caching; works whether package-lock.json exists or not
COPY package*.json ./

# Defensive check to surface missing package.json problems early
RUN [ -f package.json ] || (echo "package.json not found in build context" && exit 1)

# Install dependencies
RUN npm ci --silent

# Copy source and build
COPY . .

# Build the app (expects `vite build` to emit dist/)
RUN npm run build

########################################
# Stage 2: Production image with Caddy
########################################
FROM caddy:2-alpine AS runner

LABEL org.opencontainers.image.title="CryptoInsightHub" \
      org.opencontainers.image.description="Vite + React app served with Caddy (Railway-optimized)" \
      org.opencontainers.image.authors="maintainer"

# Where static files will live in the final image
WORKDIR /srv

# Create an embedded Caddyfile so the image build does not rely on COPY context
# The Caddyfile listens on :{$PORT:3000} (Railway sets $PORT at runtime).
RUN cat > /etc/caddy/Caddyfile <<'CADDY'
{
    admin off
    persist_config off
    auto_https off

    log {
        output stdout
        format json
    }

    servers {
        # trust common private ranges including carrier-grade NAT
        trusted_proxies static private_ranges 100.64.0.0/10
    }
}

:{$PORT:3000} {
    # JSON access logs to stdout
    log {
        output stdout
        format json
    }

    # Simple health endpoint for platform probes
    @health {
        path /health
    }
    handle @health {
        respond "ok" 200 {
            content_type text/plain
        }
    }

    # Serve files from the built dist directory
    root * /srv/dist

    # Compression
    encode gzip zstd

    # Cache fingerprinted assets long-term
    @hashedAssets {
        path_regexp hashedAssets \.(?:css|js|json|map|xml|txt|svg|woff2?|woff|ttf|eot)$
    }
    header @hashedAssets Cache-Control "public, max-age=31536000, immutable"

    # Ensure HTML is not aggressively cached so deployments update correctly
    @html {
        path_regexp htmlPaths \.html$
    }
    header @html Cache-Control "no-store, must-revalidate"

    # Basic security headers
    header * {
        X-Frame-Options "DENY"
        X-Content-Type-Options "nosniff"
        Referrer-Policy "no-referrer-when-downgrade"
        X-XSS-Protection "1; mode=block"
        Strict-Transport-Security "max-age=63072000; includeSubDomains; preload"
    }

    # Serve static files; SPA fallback to index.html
    file_server
    try_files {path} /index.html
}
CADDY

# Validate / format the Caddyfile (non-fatal)
RUN caddy fmt --overwrite /etc/caddy/Caddyfile || true

# Copy built static assets from the builder stage
COPY --from=builder /app/dist /srv/dist

# Default runtime port env var (Railway will override with its assigned port)
ENV PORT=3000
EXPOSE 3000

# Optional healthcheck to help platforms detect container health
HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
  CMD wget -qO- "http://127.0.0.1:${PORT:-3000}/health" || exit 1

# Run Caddy using the embedded Caddyfile
CMD ["caddy", "run", "--config", "/etc/caddy/Caddyfile", "--adapter", "caddyfile"]
