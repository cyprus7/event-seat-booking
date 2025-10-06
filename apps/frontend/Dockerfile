# Stage: builder
FROM node:22-alpine AS builder
WORKDIR /app
ENV NODE_ENV=production

# Accept build-time API URL (passed from CI) and expose as env for Next build
ARG NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL}

# Install dependencies (use npm install because package-lock.json may be absent in workspace)
COPY package*.json ./
RUN npm install --no-audit --no-fund

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
RUN npm install --only=production --no-audit --no-fund

EXPOSE 3000
# Use npm start (expects "start": "next start" in package.json)
CMD ["npm", "start"]
