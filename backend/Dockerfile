# ── Stage 1: Install production dependencies ─────────
FROM node:20-alpine AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

# ── Stage 2: Production runtime ──────────────────────
FROM node:20-alpine
RUN addgroup -S appgrp && adduser -S appuser -G appgrp
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Security: run as non-root
USER appuser

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=5s --retries=3 --start-period=10s \
  CMD wget -qO- http://localhost:3000/health || exit 1

CMD ["node", "src/server.js"]
