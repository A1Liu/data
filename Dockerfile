# Stage 1: Build
# TODO: use docker hardened image
FROM node:20-slim AS builder
WORKDIR /app

# Install pnpm via corepack (built into Node 20)
RUN corepack enable && corepack prepare pnpm@latest --activate

# Copy package files first for layer caching
COPY package.json pnpm-lock.yaml ./

# Install all dependencies (including devDependencies for build)
RUN pnpm install --frozen-lockfile

# Copy the rest of the source code
COPY . .

# Build the application
RUN pnpm run build

# Stage 2: Production Runner
FROM node:20-slim AS app
WORKDIR /app

# Set production environment
ENV NODE_ENV=production
ENV PORT=3000
ENV HOST=0.0.0.0

# Copy the self-contained Nitro server output
COPY --from=builder /app/.output ./.output

EXPOSE 3000

# TanStack Start + Nitro outputs a standalone server entry
CMD ["node", ".output/server/index.mjs"]
