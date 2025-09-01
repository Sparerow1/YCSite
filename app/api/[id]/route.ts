export const dynamic = "force-dynamic";

import sqlite3 from "sqlite3";
import { open, Database } from "sqlite";
import path from "path";

// Initialize a variable to hold the SQLite database connection
let db: Database | null = null;

async function connectDatabase() {
    if (!db) {
        try {
            const dbPath = path.join(process.cwd(), "databaseComponents", "contents.db");
            console.log("Connecting to database at:", dbPath);
            db = await open({
                filename: dbPath,
                driver: sqlite3.Database
            });
        } catch (error) {
            console.error("Error connecting to the database", error);
            throw error;
        }
    }
    return db;
}

export async function GET(request: Request, context: unknown) {
    try {
        await connectDatabase();

        const id = (context as { params?: { id?: string } })?.params?.id; // get the node id from the route params
        if (!id) {
            return new Response("Missing id parameter", { status: 400 });
        }

        const paragraphs = await db!.all(
            `SELECT * FROM paragraphs 
                JOIN nodes ON paragraphs.nodeId = nodes.nodeId
                WHERE paragraphs.nodeId = ?`, 
            [id]
        );

        return new Response(JSON.stringify(paragraphs), {
            headers: { "Content-Type": "application/json" },
            status: 200
        });
    } catch (error) {
        console.error("Error fetching data from the database:", error);
        return new Response("Error fetching data from the database", { status: 500 });
    }
}