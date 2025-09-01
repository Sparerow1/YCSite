FROM node:18-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install all dependencies (including dev dependencies)
RUN npm ci

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Production stage
FROM node:18-alpine AS production

WORKDIR /app

# Install only production dependencies
COPY package*.json ./
RUN npm ci --only=production

# Copy built application from builder stage
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/next.config.ts ./

# Copy database components
COPY databaseComponents/ ./databaseComponents/

# Create database directory and set permissions
RUN mkdir -p /app/databaseComponents && \
    chmod 755 /app/databaseComponents

# Expose port
EXPOSE 3000

# Create a simple startup script
RUN echo '#!/bin/sh\n\
echo "=== Starting Application ==="\n\
echo "Current directory: $(pwd)"\n\
echo "Database directory: $(ls -la databaseComponents/)"\n\
echo "\n=== Initializing Databases ==="\n\
node databaseComponents/db-manager.js\n\
if [ $? -eq 0 ]; then\n\
    echo "=== Database initialization successful ==="\n\
    echo "=== Starting Next.js application ==="\n\
    exec "$@"\n\
else\n\
    echo "=== Database initialization failed ==="\n\
    exit 1\n\
fi' > /start.sh && chmod +x /start.sh

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:3000 || exit 1

# Use the startup script
ENTRYPOINT ["/start.sh"]
CMD ["npm", "start"]