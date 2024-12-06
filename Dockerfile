FROM oven/bun:1 AS base

# ---------

FROM base AS deps
WORKDIR /app

COPY package.json bun.lockb ./

RUN bun install --frozen-lockfile

# ---------

FROM base AS prod-deps
WORKDIR /app

COPY package.json bun.lockb ./

RUN bun install --production --frozen-lockfile

# ---------

FROM base AS builder

WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

RUN bun run build

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
COPY --from=builder --chown=api:nodejs /app/dist ./

USER api

EXPOSE 3333

ENV PORT=3333
ENV HOSTNAME="0.0.0.0"

ENTRYPOINT ["bun", "http/server.js"]