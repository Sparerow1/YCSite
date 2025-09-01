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

# Copy database files and initialization scripts
COPY databaseComponents/ ./databaseComponents/

# Create non-root user for security
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001

# Create database directory with proper permissions
RUN mkdir -p /app/databaseComponents && \
    chown -R nextjs:nodejs /app/databaseComponents

# Change ownership of the app directory
RUN chown -R nextjs:nodejs /app

# Expose port
EXPOSE 3000

# Create an entrypoint script to initialize database and start the app
RUN echo '#!/bin/sh\n\
echo "=== Starting Application ==="\n\
echo "Current user: $(whoami)"\n\
echo "Current directory: $(pwd)"\n\
echo "Database directory contents:"\n\
ls -la databaseComponents/\n\
echo "\n=== Initializing Databases ==="\n\
cd /app\n\
echo "Running database initialization..."\n\
node databaseComponents/init-databases.js\n\
if [ $? -eq 0 ]; then\n\
    echo "Database initialization successful!"\n\
    echo "Final database directory contents:"\n\
    ls -la databaseComponents/\n\
    echo "\n=== Starting Application ==="\n\
    exec "$@"\n\
else\n\
    echo "Database initialization failed!"\n\
    exit 1\n\
fi' > /docker-entrypoint.sh && \
chmod +x /docker-entrypoint.sh

# Health check (simplified to avoid dependency on missing endpoint)
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:3000 || exit 1

# Use entrypoint to initialize database before starting
ENTRYPOINT ["/docker-entrypoint.sh"]

# Start the application
CMD ["npm", "start"]