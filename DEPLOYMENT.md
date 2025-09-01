# Deployment Guide for Render

## Overview

This application uses SQLite databases for storing content and project information. When deploying to Render, the databases need to be properly initialized and configured.

## Database Architecture

- **Contents Database** (`contents.db`): Stores personal information, nodes, paragraphs, and image links
- **Projects Database** (`projects.db`): Stores project information and details

## Pre-deployment Setup

### 1. Local Database Initialization

Before deploying, ensure your local databases are working:

```bash
# Initialize databases locally
npm run db:init

# Test database connectivity
npm run db:test
```

### 2. Database Files

Ensure these files exist in your `databaseComponents/` directory:
- `contents.db` (will be created if missing)
- `projects.db` (will be created if missing)

## Render Deployment

### 1. Dockerfile Configuration

The Dockerfile automatically:
- Copies database components to the container
- Sets proper permissions for the `nextjs` user
- Initializes databases on container startup
- Starts the application after successful database initialization

### 2. Environment Variables

No additional environment variables are required for SQLite databases.

### 3. Build Command

```bash
# Render will automatically use the Dockerfile
# No build command needed
```

### 4. Start Command

```bash
# Render will automatically use the Dockerfile
# No start command needed
```

## Troubleshooting

### Database Not Working in Production

#### Check 1: Container Logs
View the container logs in Render dashboard to see:
- Database initialization messages
- Permission errors
- File path issues

#### Check 2: Database Initialization
Look for these log messages:
```
=== Starting Application ===
=== Initializing Databases ===
Database initialization successful!
```

#### Check 3: File Permissions
Ensure the container can write to the database directory:
```
Database directory contents:
drwxr-xr-x 2 nextjs nodejs 4096 ...
```

### Common Issues

#### Issue 1: Permission Denied
**Symptoms**: Database initialization fails with permission errors
**Solution**: The Dockerfile already handles permissions correctly

#### Issue 2: Database Files Not Found
**Symptoms**: API endpoints return 500 errors
**Solution**: Check if database initialization completed successfully

#### Issue 3: Container Restart Issues
**Symptoms**: Data disappears after container restart
**Solution**: This is expected with SQLite in containers. Consider migrating to Render's PostgreSQL service for persistent data.

## Alternative: Using Render PostgreSQL

For persistent data storage, consider using Render's PostgreSQL service:

### 1. Create PostgreSQL Service
- Go to Render dashboard
- Create new PostgreSQL service
- Note the connection details

### 2. Update Dependencies
```bash
npm install pg
npm install @types/pg --save-dev
```

### 3. Update Database Connection
Replace SQLite connections with PostgreSQL connections in your API routes.

### 4. Environment Variables
Set these in Render:
```
DATABASE_URL=postgresql://user:password@host:port/database
```

## Local Development

### Database Commands

```bash
# Initialize databases
npm run db:init

# Test database connectivity
npm run db:test

# Start development server
npm run dev
```

### Database Structure

#### Contents Database Tables
- `nodes`: Personal information nodes
- `paragraphs`: Text content for each node
- `imageLinks`: Image URLs associated with nodes

#### Projects Database Tables
- `project`: Project information (title, image, description, link)

## Monitoring

### Health Checks
The Dockerfile includes a health check that verifies the application is running on port 3000.

### Logs
Monitor these log patterns:
- ✅ Database initialization successful
- ✅ Connected to database successfully
- ❌ Error connecting to database
- ❌ Database initialization failed

## Support

If you continue to experience database issues:

1. Check Render container logs
2. Verify database initialization completed
3. Test API endpoints manually
4. Consider migrating to PostgreSQL for production use
