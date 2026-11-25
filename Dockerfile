# syntax=docker/dockerfile:1

FROM node:24.11.1-bookworm-slim AS base
ENV PNPM_HOME=/pnpm
ENV PATH=$PNPM_HOME:$PATH
ENV NEXT_TELEMETRY_DISABLED=1
RUN corepack enable
WORKDIR /app

FROM base AS prune
COPY . .
RUN pnpm dlx turbo@2.10.12 prune lender --docker

FROM base AS build
COPY --from=prune /app/out/json/ .
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile
COPY --from=prune /app/out/full/ .
ARG NEXT_PUBLIC_FEATURE_VERIFY_BUSINESS=false
ENV NEXT_PUBLIC_FEATURE_VERIFY_BUSINESS=$NEXT_PUBLIC_FEATURE_VERIFY_BUSINESS
RUN pnpm --filter lender build

FROM node:24.11.1-bookworm-slim AS runtime
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME=0.0.0.0
WORKDIR /app
COPY --from=build --chown=node:node /app/apps/lender/.next/standalone ./
COPY --from=build --chown=node:node /app/apps/lender/.next/static ./apps/lender/.next/static
COPY --from=build --chown=node:node /app/apps/lender/public ./apps/lender/public
USER node
EXPOSE 3000
CMD ["node", "apps/lender/server.js"]
