export const dynamic = "force-dynamic";

import sqlite3 from "sqlite3";
import { open, Database } from "sqlite";
import path from "path";

// Initialize a variable to hold the SQLite database connection
let db: Database | null = null;

async function connectDatabase(): Promise<Database> {
    if (!db) {
        try {
            const dbPath = path.join(process.cwd(), "databaseComponents", "contents.db");
            console.log("Connecting to database at:", dbPath);
            db = await open({
                filename: dbPath,
                driver: sqlite3.Database
            });
        } catch (error) {
            console.log("Error connecting to the database", error);
            throw error;
        }
    }
    return db;
}

export async function GET() {
    try {
        const dbConn = await connectDatabase();

        const paragraphs = await dbConn.all(`
            SELECT * FROM paragraphs 
                JOIN nodes ON nodes.nodeId = paragraphs.nodeId
        `);

        return new Response(JSON.stringify(paragraphs), {
            headers: { "Content-Type": "application/json" },
            status: 200
        });
    } catch (error) {
        console.error("Error fetching data from the database:", error);
        return new Response("Error fetching data from the database", { status: 500 });
    }
}