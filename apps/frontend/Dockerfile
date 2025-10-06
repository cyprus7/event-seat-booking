# Stage: builder
FROM node:22-alpine AS builder
WORKDIR /app
ENV NODE_ENV=production

# Install dependencies
COPY package*.json ./
RUN npm ci

# Copy sources and build
COPY . .
RUN npm run build

# Stage: runner
FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

# Copy built assets and package.json
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/package*.json ./

# Install only production deps
RUN npm ci --only=production

EXPOSE 3000
# Use npm start (expects "start": "next start" in package.json)
CMD ["npm", "start"]
