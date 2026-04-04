# Build stage
FROM node:22-alpine AS builder

WORKDIR /app

# Copy package files
COPY package.json package-lock.json* ./

# Install dependencies
RUN npm install

ARG MONGODB_URI
ENV MONGODB_URI=$MONGODB_URI

# Copy source
COPY . .
# Build Next.js app
RUN npm run build

# Production stage
FROM node:22-alpine AS runner

WORKDIR /app

# Create non-root user
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy built artifacts
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/public ./public
COPY --from=builder /app/app ./app
COPY --from=builder /app/lib ./lib

# Set environment
ENV NODE_ENV=production
ENV PATH=/app/node_modules/.bin:$PATH

USER nextjs

# Expose port
EXPOSE 3000

# Start
CMD ["node", "node_modules/next/dist/bin/next"]
