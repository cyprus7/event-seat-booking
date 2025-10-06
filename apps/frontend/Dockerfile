# Stage: builder (context = repo root)
FROM node:22-alpine AS builder
WORKDIR /app
ENV NODE_ENV=production

# Accept build-time API URL (passed from CI) and expose as env for Next build
ARG NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL}

# Copy root package files and frontend package.json so npm can resolve workspaces
COPY package*.json ./
COPY apps/frontend/package*.json ./apps/frontend/

# Install dependencies for the frontend workspace (including dev deps needed for build)
RUN npm install --workspace=apps/frontend --include=dev --no-audit --no-fund

# Copy full repository (needed for workspace sources, shared packages, and the frontend sources)
COPY . .

# Build only the frontend workspace
RUN npm --workspace=apps/frontend run build

# Stage: runner
FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

# Copy node_modules and built frontend into runner
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/apps/frontend ./

EXPOSE 3000
# Start frontend from workspace package.json (expects "start": "next start")
CMD ["npm", "start"]
