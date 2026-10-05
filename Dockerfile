FROM node:22-alpine AS build_client

WORKDIR /app/client

COPY client/package*.json ./
RUN npm ci

COPY client/ .

RUN npm run build


# Build
FROM node:22-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

RUN npm run build && npm prune --omit=dev

# Production
FROM node:22-alpine AS production

WORKDIR /app

ENV NODE_ENV=production

# Usuário não root.
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nestjs -u 1001 -G nodejs

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./
COPY --from=build_client /app/client/dist ./client/dist

# Muda para usuário não-root
USER nestjs

# Expõe a porta da aplicação
EXPOSE 3000

# Comando para iniciar a aplicação
CMD ["node", "dist/main.js"]
