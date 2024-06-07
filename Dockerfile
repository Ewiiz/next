FROM node:20-alpine3.18 as base

RUN apk --no-cache add curl
RUN curl -sL https://unpkg.com/@pnpm/self-installer | node

# All deps stage
FROM base as deps
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --force

# Production only deps stage
FROM base as production-deps
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --prod

# Build stage
FROM base as build
WORKDIR /app
COPY --from=deps /app/node_modules /app/node_modules
COPY . .
# Construire l'application
RUN pnpm run build

# Production stage
FROM base
WORKDIR /app
COPY --from=production-deps /app/node_modules /app/node_modules
COPY --from=build /app /app
EXPOSE 3000
CMD ["pnpm", "start"]