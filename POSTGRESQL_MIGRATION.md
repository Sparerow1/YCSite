# PostgreSQL Migration Guide for Render

## Why PostgreSQL Instead of SQLite?

**SQLite is NOT suitable for production container deployments** because:
- Containers are ephemeral - all files (including SQLite databases) are lost on restart
- Render containers restart frequently for updates and scaling
- SQLite is file-based and doesn't handle concurrent access well
- No data persistence between deployments

**PostgreSQL is the proper solution** because:
- Persistent data storage managed by Render
- Handles concurrent access properly
- Automatic backups and scaling
- Industry standard for production applications

## Step 1: Create PostgreSQL Service on Render

1. Go to your Render dashboard
2. Click "New +" → "PostgreSQL"
3. Configure:
   - **Name**: `aboutme-db`
   - **Database**: `aboutme_production`
   - **User**: `aboutme_user`
   - **Region**: Same as your web service
4. Click "Create Database"
5. Note the connection details (you'll need these later)

## Step 2: Install PostgreSQL Dependencies

```bash
npm install pg
npm install @types/pg --save-dev
```

## Step 3: Create Database Schema

Create `databaseComponents/schema.sql`:

```sql
-- Contents database schema
CREATE TABLE IF NOT EXISTS nodes (
    nodeId SMALLINT PRIMARY KEY,
    nodeTitle TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS imageLinks (
    imgId SMALLINT PRIMARY KEY,
    imgLink VARCHAR(255),
    nodeId SMALLINT REFERENCES nodes(nodeId)
);

CREATE TABLE IF NOT EXISTS paragraphs (
    paraId SMALLINT PRIMARY KEY,
    nodeId SMALLINT REFERENCES nodes(nodeId),
    paraText TEXT NOT NULL
);

-- Projects database schema
CREATE TABLE IF NOT EXISTS project (
    proId SERIAL PRIMARY KEY,
    proTitle TEXT NOT NULL,
    proImage TEXT,
    proDescription TEXT,
    proLink TEXT
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_paragraphs_nodeid ON paragraphs(nodeId);
CREATE INDEX IF NOT EXISTS idx_imagelinks_nodeid ON imageLinks(nodeId);
```

## Step 4: Create PostgreSQL Database Manager

Create `databaseComponents/postgres-manager.js`:

```javascript
const { Pool } = require('pg');

class PostgresManager {
    constructor() {
        this.pool = null;
        this.initialized = false;
    }

    // Initialize database connection
    async initialize() {
        try {
            // Get connection details from environment
            const connectionString = process.env.DATABASE_URL;
            
            if (!connectionString) {
                throw new Error('DATABASE_URL environment variable is required');
            }

            this.pool = new Pool({
                connectionString,
                ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
            });

            // Test connection
            const client = await this.pool.connect();
            console.log('✅ Connected to PostgreSQL database');
            client.release();

            return true;
        } catch (error) {
            console.error('❌ Failed to connect to PostgreSQL:', error.message);
            throw error;
        }
    }

    // Initialize database schema and data
    async initializeDatabase() {
        try {
            console.log('=== Initializing PostgreSQL Database ===');
            
            // Create tables
            await this.createTables();
            
            // Insert initial data
            await this.insertInitialData();
            
            this.initialized = true;
            console.log('✅ Database initialization completed successfully');
            
            return true;
        } catch (error) {
            console.error('❌ Database initialization failed:', error.message);
            throw error;
        }
    }

    // Create database tables
    async createTables() {
        const client = await this.pool.connect();
        
        try {
            const schema = `
                -- Contents database schema
                CREATE TABLE IF NOT EXISTS nodes (
                    nodeId SMALLINT PRIMARY KEY,
                    nodeTitle TEXT NOT NULL
                );

                CREATE TABLE IF NOT EXISTS imageLinks (
                    imgId SMALLINT PRIMARY KEY,
                    imgLink VARCHAR(255),
                    nodeId SMALLINT REFERENCES nodes(nodeId)
                );

                CREATE TABLE IF NOT EXISTS paragraphs (
                    paraId SMALLINT PRIMARY KEY,
                    nodeId SMALLINT REFERENCES nodes(nodeId),
                    paraText TEXT NOT NULL
                );

                -- Projects database schema
                CREATE TABLE IF NOT EXISTS project (
                    proId SERIAL PRIMARY KEY,
                    proTitle TEXT NOT NULL,
                    proImage TEXT,
                    proDescription TEXT,
                    proLink TEXT
                );

                -- Create indexes for better performance
                CREATE INDEX IF NOT EXISTS idx_paragraphs_nodeid ON paragraphs(nodeId);
                CREATE INDEX IF NOT EXISTS idx_imagelinks_nodeid ON imageLinks(nodeId);
            `;
            
            await client.query(schema);
            console.log('✅ Database tables created successfully');
            
        } finally {
            client.release();
        }
    }

    // Insert initial data
    async insertInitialData() {
        const client = await this.pool.connect();
        
        try {
            // Clear existing data
            await client.query('DELETE FROM paragraphs');
            await client.query('DELETE FROM imageLinks');
            await client.query('DELETE FROM nodes');
            await client.query('DELETE FROM project');
            console.log('✅ Cleared existing data');

            // Insert nodes
            const nodesValues = [
                [1, "About Me"], [2, "Aspiration"], [3, "Perseverance"], [4, "Culture"],
                [5, "University Life"], [6, "Came From"], [7, "Immigration"], [8, "Education"]
            ];
            
            for (const [id, title] of nodesValues) {
                await client.query('INSERT INTO nodes (nodeId, nodeTitle) VALUES ($1, $2)', [id, title]);
            }
            console.log('✅ Inserted nodes data');

            // Insert paragraphs
            const paragraphsValues = [
                [1, 1, "Hello! I'm Yan Chen, a passionate developer who enjoys solving problems and building useful applications."],
                [2, 1, "My journey in technology began with curiosity and has grown into a lifelong pursuit of learning."],
                [3, 1, "I believe in continuous improvement and always strive to expand my skillset and knowledge."],
                [4, 2, "My aspiration is to become a software engineer who creates impactful solutions for real-world problems."],
                [5, 2, "I am driven by the desire to make technology accessible and beneficial to everyone."],
                [6, 2, "I hope to contribute to projects that inspire and empower others."],
                [7, 3, "Perseverance has been a key part of my journey, helping me overcome challenges and setbacks."],
                [8, 3, "I believe that persistence and resilience are essential traits for personal and professional growth."],
                [9, 3, "Every obstacle is an opportunity to learn and become stronger."],
                [10, 4, "Growing up in a multicultural environment has shaped my worldview and appreciation for diversity."]
            ];
            
            for (const [id, nodeId, text] of paragraphsValues) {
                await client.query('INSERT INTO paragraphs (paraId, nodeId, paraText) VALUES ($1, $2, $3)', [id, nodeId, text]);
            }
            console.log('✅ Inserted paragraphs data');

            // Insert image links
            const imageLinksValues = [
                [1, "https://example.com/image1.jpg", 1], [2, "https://example.com/image2.jpg", 2],
                [3, "https://example.com/image3.jpg", 3], [4, "https://example.com/image4.jpg", 4],
                [5, "https://example.com/image5.jpg", 5], [6, "https://example.com/image6.jpg", 6],
                [7, "https://example.com/image7.jpg", 7], [8, "https://example.com/image8.jpg", 8]
            ];
            
            for (const [id, link, nodeId] of imageLinksValues) {
                await client.query('INSERT INTO imageLinks (imgId, imgLink, nodeId) VALUES ($1, $2, $3)', [id, link, nodeId]);
            }
            console.log('✅ Inserted image links data');

            // Insert projects
            const projectValues = [
                ["Bible-Assistant", "https://via.placeholder.com/150", "A Bible study assistant.", "https://github.com/Sparerow1/bible-study-assistant"],
                ["Kyckflix", "https://via.placeholder.com/150", "A project about movies and tv shows.", "https://github.com/grammerjam/team-kyck"],
                ["Yan's YouTube", "https://via.placeholder.com/150", "My version of YouTube.", "https://github.com/Sparerow1/YouTube_Clone"],
                ["Support Squad", "https://via.placeholder.com/150", "A project to help homeless people.", "https://github.com/Sparerow1/Support_Squad"],
                ["Database Projects", "https://via.placeholder.com/150", "Projects for my database", "https://bitbucket.org/yanheng_chen/lis3781/src/master/"]
            ];
            
            for (const [title, image, description, link] of projectValues) {
                await client.query('INSERT INTO project (proTitle, proImage, proDescription, proLink) VALUES ($1, $2, $3, $4)', [title, image, description, link]);
            }
            console.log('✅ Inserted projects data');
            
        } finally {
            client.release();
        }
    }

    // Get database connection pool
    getPool() {
        if (!this.pool) {
            throw new Error('Database not initialized. Call initialize() first.');
        }
        return this.pool;
    }

    // Close database connections
    async close() {
        if (this.pool) {
            await this.pool.end();
            console.log('✅ Database connections closed');
        }
    }
}

module.exports = PostgresManager;

// Run if called directly
if (require.main === module) {
    const manager = new PostgresManager();
    manager.initialize()
        .then(() => manager.initializeDatabase())
        .then(() => manager.close())
        .then(() => {
            console.log('Database setup completed successfully');
            process.exit(0);
        })
        .catch((error) => {
            console.error('Database setup failed:', error);
            process.exit(1);
        });
}
```

## Step 5: Update API Routes

### Update `app/api/route.ts`:

```typescript
export const dynamic = "force-dynamic";

import { Pool } from "pg";

// Initialize database connection
let pool: Pool | null = null;

async function getDatabase(): Promise<Pool> {
    if (!pool) {
        const connectionString = process.env.DATABASE_URL;
        if (!connectionString) {
            throw new Error('DATABASE_URL environment variable is required');
        }
        
        pool = new Pool({
            connectionString,
            ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
        });
    }
    return pool;
}

export async function GET() {
    try {
        const db = await getDatabase();
        const result = await db.query(`
            SELECT * FROM paragraphs 
            JOIN nodes ON nodes.nodeId = paragraphs.nodeId
        `);
        
        return new Response(JSON.stringify(result.rows), {
            headers: { "Content-Type": "application/json" },
            status: 200
        });
    } catch (error) {
        console.error("Error fetching data from the database:", error);
        return new Response("Error fetching data from the database", { status: 500 });
    }
}
```

### Update `app/api/projects/route.ts`:

```typescript
export const dynamic = "force-dynamic";

import { Pool } from "pg";

// Initialize database connection
let pool: Pool | null = null;

async function getDatabase(): Promise<Pool> {
    if (!pool) {
        const connectionString = process.env.DATABASE_URL;
        if (!connectionString) {
            throw new Error('DATABASE_URL environment variable is required');
        }
        
        pool = new Pool({
            connectionString,
            ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
        });
    }
    return pool;
}

export async function GET() {
    try {
        const db = await getDatabase();
        const result = await db.query('SELECT * FROM project');
        
        return new Response(JSON.stringify(result.rows), {
            status: 200,
            headers: { "Content-Type": "application/json" }
        });
    } catch (error) {
        console.error("Error fetching data from the database", error);
        return new Response(JSON.stringify({ error: "Error fetching data from the database" }), { status: 500 });
    }
}
```

### Update `app/api/[id]/route.ts`:

```typescript
export const dynamic = "force-dynamic";

import { Pool } from "pg";

// Initialize database connection
let pool: Pool | null = null;

async function getDatabase(): Promise<Pool> {
    if (!pool) {
        const connectionString = process.env.DATABASE_URL;
        if (!connectionString) {
            throw new Error('DATABASE_URL environment variable is required');
        }
        
        pool = new Pool({
            connectionString,
            ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
        });
    }
    return pool;
}

export async function GET(request: Request, context: unknown) {
    try {
        const db = await getDatabase();
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');
        
        if (!id) {
            return new Response("ID parameter is required", { status: 400 });
        }
        
        const result = await db.query(`
            SELECT * FROM paragraphs 
            JOIN nodes ON nodes.nodeId = paragraphs.nodeId 
            WHERE nodes.nodeId = $1
        `, [id]);
        
        if (result.rows.length === 0) {
            return new Response("No data found for this ID", { status: 404 });
        }
        
        return new Response(JSON.stringify(result.rows), {
            headers: { "Content-Type": "application/json" },
            status: 200
        });
    } catch (error) {
        console.error("Error fetching data from the database:", error);
        return new Response("Error fetching data from the database", { status: 500 });
    }
}
```

## Step 6: Update Dockerfile

```dockerfile
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
COPY --from=builder /from=builder /app/next.config.ts ./

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:3000 || exit 1

# Start the application
CMD ["npm", "start"]
```

## Step 7: Environment Variables

In your Render web service, add this environment variable:

```
DATABASE_URL=postgresql://aboutme_user:password@host:port/aboutme_production
```

Get the exact connection string from your PostgreSQL service dashboard.

## Step 8: Update Package.json Scripts

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "db:init": "node databaseComponents/postgres-manager.js",
    "db:test": "node scripts/test-postgres.js"
  }
}
```

## Step 9: Test Locally

1. Set up local PostgreSQL or use a service like Supabase
2. Set `DATABASE_URL` environment variable
3. Run `npm run db:init`
4. Start your app with `npm run dev`

## Benefits of This Approach

✅ **Persistent Data**: Data survives container restarts
✅ **Scalability**: Can handle multiple concurrent users
✅ **Reliability**: Professional database service with backups
✅ **Performance**: Optimized for production workloads
✅ **Monitoring**: Built-in metrics and logging

## Migration Steps Summary

1. Create PostgreSQL service on Render
2. Install `pg` package
3. Replace SQLite code with PostgreSQL code
4. Update environment variables
5. Deploy and test

This approach will solve your database persistence issues permanently and provide a production-ready solution.
