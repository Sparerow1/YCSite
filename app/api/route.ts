import sqlite3 from "sqlite3";
import { open, Database } from "sqlite";
import { NextApiRequest, NextApiResponse } from 'next';

// Initialize a variable to hold the SQLite database connection
// we will initilize it as null, but we will assign the connection later on
let db: Database | null = null;

async function connectDatabase(res: NextApiResponse) {
    if (!db) {
        try {
            db = await open({
                filename: "./databaseComponents/contents.db",
                driver: sqlite3.Database
            });
        } catch (error) {
            console.log("Error connecting to the database", error);
            return res.status(500).send("Error connecting to the database");
        }
    }
}

export async function GET(req: NextApiRequest, res: NextApiResponse) {
    await connectDatabase(res);

    const paragraphs = await db!.all(`
        SELECT * FROM paragraphs 
            join nodes on nodes.nodeId = paragraphs.nodeId`);
    
    try {
            return new Response(JSON.stringify(paragraphs), {
                headers: {
                "Content-Type": "application/json"},
                status: 200
            });
    } catch (error) {    
        return res.status(500).send("Error fetching data from the database: " + error);
    }
}