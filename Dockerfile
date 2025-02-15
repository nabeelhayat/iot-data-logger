# Base stage for shared configurations
FROM node:23-alpine AS base
WORKDIR /usr/src/app
ENV NODE_ENV=production

# Dependencies stage for development
FROM base AS deps-dev
ENV NODE_ENV=development
COPY package.json yarn.lock ./
COPY prisma ./prisma/
RUN yarn install --frozen-lockfile

# Dependencies stage for production
# FROM base AS deps-prod
# COPY package*.json ./
# COPY prisma ./prisma/
# RUN yarn install --frozen-lockfile --production

# Development stage
FROM base AS development
ENV NODE_ENV=development
WORKDIR /usr/src/app

# Copy dependencies from deps-dev
COPY --from=deps-dev /usr/src/app/node_modules ./node_modules
COPY --from=deps-dev /usr/src/app/prisma ./prisma

# Copy source code
COPY . .

# Generate Prisma Client
RUN npx prisma generate

EXPOSE 4000

CMD ["yarn", "start:dev"]

# # Builder stage for production
# FROM base AS builder
# WORKDIR /usr/src/app

# # Copy dependencies and source code
# COPY --from=deps-prod /usr/src/app/node_modules ./node_modules
# COPY --from=deps-prod /usr/src/app/prisma ./prisma
# COPY . .

# # Generate Prisma Client and build
# RUN npx prisma generate
# RUN npm run build

# # Production stage
# FROM base AS production
# WORKDIR /usr/src/app

# # Copy only necessary files from builder
# COPY --from=builder /usr/src/app/dist ./dist
# COPY --from=builder /usr/src/app/node_modules ./node_modules
# COPY --from=builder /usr/src/app/package*.json ./
# COPY --from=builder /usr/src/app/prisma ./prisma

# EXPOSE 4000

# CMD ["npm", "run", "start:prod"]