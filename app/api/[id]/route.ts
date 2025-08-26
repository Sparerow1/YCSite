import sqlite3 from "sqlite3";
import { open, Database } from "sqlite";

// Initialize a variable to hold the SQLite database connection
let db: Database | null = null;

async function connectDatabase() {
    if (!db) {
        try {
            db = await open({
                filename: "./databaseComponents/contents.db",
                driver: sqlite3.Database
            });
        } catch (error) {
            console.error("Error connecting to the database", error);
            throw error;
        }
    }
}

export async function GET(request: Request, context: any) {
    try {
        await connectDatabase();

        const id = context?.params?.id as string | undefined; // get the node id from the route params
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