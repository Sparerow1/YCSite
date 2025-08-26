export const dynamic = "force-dynamic";

import sqlite3 from "sqlite3";
import { open, Database } from "sqlite";

// Initialize a variable to hold the SQLite database connection
// we will initilize it as null, but we will assign the connection later on
let db: Database | null = null;

async function connectDatabase(): Promise<Database> {
    if (!db) {
        db = await open({
            filename: "./databaseComponents/projects.db",
            driver: sqlite3.Database
        });
    }
    return db;
}

export async function GET() {
    try {
        const database = await connectDatabase();
        const projects = await database.all(`SELECT * FROM project`);
        return new Response(JSON.stringify(projects), {
            status: 200,
            headers: { "Content-Type": "application/json" }
        });
    } catch (error) {
        console.error("Error fetching data from the database", error);
        return new Response(JSON.stringify({ error: "Error fetching data from the database" }), { status: 500 });
    }
}