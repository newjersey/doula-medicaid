# Use the official Node.js runtime as the builder image
FROM node:lts-alpine AS builder

WORKDIR /app

# Copy package files and install dependencies
COPY package.json package-lock.json* ./
RUN npm ci
COPY . .

ENV NEXT_TELEMETRY_DISABLED 1
RUN npm run build

# Production image
FROM node:lts-alpine AS runtime
WORKDIR /app
ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

# Build arguments
ARG BUILDTIME
ARG VERSION
ARG REVISION
ARG GITHUB_REPOSITORY="newjersey/doula-medicaid"

# OCI Labels for runtime stage
LABEL org.opencontainers.image.title="NJ Doula FamilyCare Tool"
LABEL org.opencontainers.image.description="A web application that helps doulas register with NJ FamilyCare"
LABEL org.opencontainers.image.version="${VERSION}"
LABEL org.opencontainers.image.created="${BUILDTIME}"
LABEL org.opencontainers.image.revision="${REVISION}"
LABEL org.opencontainers.image.source="https://github.com/${GITHUB_REPOSITORY}"
LABEL org.opencontainers.image.url="https://github.com/${GITHUB_REPOSITORY}"
LABEL org.opencontainers.image.documentation="https://github.com/${GITHUB_REPOSITORY}#readme"
LABEL org.opencontainers.image.licenses="MIT"
LABEL org.opencontainers.image.vendor="New Jersey State Office of Innovation"
LABEL org.opencontainers.image.base.name="node:lts-alpine"

# Additional metadata
LABEL maintainer="New Jersey State Office of Innovation <team@innovation.nj.gov>"
LABEL version="${VERSION}"
LABEL build.date="${BUILDTIME}"
LABEL build.revision="${REVISION}"

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Install curl for health check
RUN apk add --no-cache curl

# copy all the files and run next
COPY --from=builder /app/public ./public

# Set the correct permission for prerender cache
RUN mkdir .next
RUN chown nextjs:nodejs .next

# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

# Health check using curl
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:3000/api/health || exit 1

# server.js is created by next build from the standalone output
# https://nextjs.org/docs/pages/api-reference/next-config-js/output
CMD ["node", "server.js"]
