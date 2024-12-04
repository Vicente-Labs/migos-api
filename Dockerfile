FROM node:20-alpine AS base

# ---------

FROM base AS deps
WORKDIR /app

# Copy workspace files and root package.json
COPY ../../pnpm-workspace.yaml ./
COPY ../../package.json ./package.json

# Copy all package.json files maintaining workspace structure
COPY ../../packages/auth/package.json ./packages/auth/
COPY ../../config/eslint-config/package.json ./config/eslint-config/
COPY ../../config/prettier/package.json ./config/prettier/
COPY ../../config/typescript-config/package.json ./config/typescript-config/
COPY package.json ./apps/api/package.json
COPY ../../apps/web/package.json ./apps/web/package.json
COPY ../../pnpm-lock.yaml ./

# Install dependencies
RUN corepack enable && pnpm install --frozen-lockfile

# ---------

FROM base AS prod-deps
WORKDIR /app

# Copy workspace files and root package.json
COPY ../../pnpm-workspace.yaml ./
COPY ../../package.json ./package.json

# Copy all package.json files maintaining workspace structure
COPY ../../packages/auth/package.json ./packages/auth/
COPY ../../config/eslint-config/package.json ./config/eslint-config/
COPY ../../config/prettier/package.json ./config/prettier/
COPY ../../config/typescript-config/package.json ./config/typescript-config/
COPY package.json ./apps/api/package.json
COPY ../../apps/web/package.json ./apps/web/package.json
COPY ../../pnpm-lock.yaml ./

# Install production dependencies
RUN corepack enable && pnpm install --prod --frozen-lockfile

# ---------

FROM base AS builder
WORKDIR /app

# Copy source files maintaining workspace structure
COPY ../../packages ./packages
COPY ../../config ./config
COPY . ./apps/api
COPY ../../pnpm-workspace.yaml ./
COPY ../../package.json ./

# Copy dependencies
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/apps/api/node_modules ./apps/api/node_modules

# Build
WORKDIR /app/apps/api
RUN corepack enable pnpm && pnpm build

# ---------

FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 api

RUN mkdir dist
RUN chown api:nodejs dist
RUN chown api:nodejs .

COPY --chown=api:nodejs package.json ./
COPY --from=prod-deps /app/node_modules ./node_modules
COPY --from=builder --chown=api:nodejs /app/apps/api/dist ./dist

USER api

EXPOSE 3333

ENV PORT=3333
ENV HOSTNAME="0.0.0.0"

ENTRYPOINT ["node", "dist/http/server.js"]