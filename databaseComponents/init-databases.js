#!/usr/bin/env node

const sqlite3 = require("sqlite3").verbose();
const path = require("path");
const fs = require("fs");

console.log("=== Database Initialization Script ===");
console.log("Current working directory:", process.cwd());
console.log("Script directory:", __dirname);

// Ensure database directory exists
const dbDir = path.join(__dirname);
if (!fs.existsSync(dbDir)) {
    console.log("Creating database directory:", dbDir);
    fs.mkdirSync(dbDir, { recursive: true });
}

// Initialize contents database
async function initContentsDB() {
    return new Promise((resolve, reject) => {
        const dbPath = path.join(dbDir, "contents.db");
        console.log("\n--- Initializing Contents Database ---");
        console.log("Database path:", dbPath);
        
        const db = new sqlite3.Database(dbPath, sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE, (err) => {
            if (err) {
                console.error("Error connecting to contents database:", err.message);
                reject(err);
                return;
            }
            console.log("Connected to contents database successfully");
            
            db.serialize(() => {
                // Create tables
                db.run(`CREATE TABLE IF NOT EXISTS nodes (
                    nodeId tinyint primary key,
                    nodeTitle text
                )`, (err) => {
                    if (err) {
                        console.error("Error creating nodes table:", err.message);
                        reject(err);
                        return;
                    }
                    console.log("Nodes table ready");
                });

                db.run(`CREATE TABLE IF NOT EXISTS imageLinks (
                    imgId tinyint primary key,
                    imgLink varchar(255),
                    nodeId tinyint,
                    foreign key (nodeId) references nodes(nodeId)
                )`, (err) => {
                    if (err) {
                        console.error("Error creating imageLinks table:", err.message);
                        reject(err);
                        return;
                    }
                    console.log("ImageLinks table ready");
                });

                db.run(`CREATE TABLE IF NOT EXISTS paragraphs (
                    paraId tinyint primary key,
                    nodeId tinyint,
                    paraText text,
                    foreign key (nodeId) references nodes(nodeId)
                )`, (err) => {
                    if (err) {
                        console.error("Error creating paragraphs table:", err.message);
                        reject(err);
                        return;
                    }
                    console.log("Paragraphs table ready");
                });

                // Clear existing data
                const tables = ["nodes", "imageLinks", "paragraphs"];
                tables.forEach((table) => {
                    db.run(`DELETE FROM ${table}`, (err) => {
                        if (err) {
                            console.error(`Error clearing ${table} table:`, err.message);
                        } else {
                            console.log(`Cleared ${table} table`);
                        }
                    });
                });

                // Insert sample data
                const nodesValues = [
                    [1, "About Me"],
                    [2, "Aspiration"],
                    [3, "Perseverance"],
                    [4, "Culture"],
                    [5, "University Life"],
                    [6, "Came From"],
                    [7, "Immigration"],
                    [8, "Education"]
                ];

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

                const imageLinksValues = [
                    [1, "https://example.com/image1.jpg", 1],
                    [2, "https://example.com/image2.jpg", 2],
                    [3, "https://example.com/image3.jpg", 3],
                    [4, "https://example.com/image4.jpg", 4],
                    [5, "https://example.com/image5.jpg", 5],
                    [6, "https://example.com/image6.jpg", 6],
                    [7, "https://example.com/image7.jpg", 7],
                    [8, "https://example.com/image8.jpg", 8]
                ];

                // Insert data
                const insertNodesSql = `INSERT INTO nodes (nodeId, nodeTitle) VALUES (?, ?)`;
                const insertParagraphsSql = `INSERT INTO paragraphs (paraId, nodeId, paraText) VALUES (?, ?, ?)`;
                const insertImageLinksSql = `INSERT INTO imageLinks (imgId, imgLink, nodeId) VALUES (?, ?, ?)`;

                nodesValues.forEach((value) => {
                    db.run(insertNodesSql, value, (err) => {
                        if (err) {
                            console.error("Error inserting node:", value, err.message);
                        } else {
                            console.log("Inserted node:", value[1]);
                        }
                    });
                });

                paragraphsValues.forEach((value) => {
                    db.run(insertParagraphsSql, value, (err) => {
                        if (err) {
                            console.error("Error inserting paragraph:", value, err.message);
                        } else {
                            console.log("Inserted paragraph for node:", value[1]);
                        }
                    });
                });

                imageLinksValues.forEach((value) => {
                    db.run(insertImageLinksSql, value, (err) => {
                        if (err) {
                            console.error("Error inserting image link:", value, err.message);
                        } else {
                            console.log("Inserted image link for node:", value[2]);
                        }
                    });
                });

                // Close database
                db.close((err) => {
                    if (err) {
                        console.error("Error closing contents database:", err.message);
                        reject(err);
                    } else {
                        console.log("Contents database initialized successfully");
                        resolve();
                    }
                });
            });
        });
    });
}

// Initialize projects database
async function initProjectsDB() {
    return new Promise((resolve, reject) => {
        const dbPath = path.join(dbDir, "projects.db");
        console.log("\n--- Initializing Projects Database ---");
        console.log("Database path:", dbPath);
        
        const db = new sqlite3.Database(dbPath, sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE, (err) => {
            if (err) {
                console.error("Error connecting to projects database:", err.message);
                reject(err);
                return;
            }
            console.log("Connected to projects database successfully");
            
            db.serialize(() => {
                db.run(`CREATE TABLE IF NOT EXISTS project(
                    proId INTEGER PRIMARY KEY autoincrement, 
                    proTitle TEXT, 
                    proImage TEXT, 
                    proDescription TEXT,
                    proLink TEXT
                )`, (err) => {
                    if (err) {
                        console.error("Error creating project table:", err.message);
                        reject(err);
                        return;
                    }
                    console.log("Project table ready");
                });

                db.run(`DELETE FROM project`, (err) => {
                    if (err) {
                        console.error("Error clearing project table:", err.message);
                    } else {
                        console.log("Cleared project table");
                    }
                });

                const projectValues = [
                    ["Bible-Assistant", "https://via.placeholder.com/150", "A Bible study assistant.", "https://github.com/Sparerow1/bible-study-assistant"],
                    ["Kyckflix", "https://via.placeholder.com/150", "A project about movies and tv shows.", "https://github.com/grammerjam/team-kyck"],
                    ["Yan's YouTube", "https://via.placeholder.com/150", "My version of YouTube.", "https://github.com/Sparerow1/YouTube_Clone"],
                    ["Support Squad", "https://via.placeholder.com/150", "A project to help homeless people.", "https://github.com/Sparerow1/Support_Squad"],
                    ["Database Projects", "https://via.placeholder.com/150", "Projects for my database", "https://bitbucket.org/yanheng_chen/lis3781/src/master/"]
                ];

                const insertIntoProjectSql = `INSERT INTO project (proTitle, proImage, proDescription, proLink) values (?, ?, ?, ?)`;

                projectValues.forEach((value) => {
                    db.run(insertIntoProjectSql, value, (err) => {
                        if (err) {
                            console.error("Error inserting project:", value[0], err.message);
                        } else {
                            console.log("Inserted project:", value[0]);
                        }
                    });
                });

                db.close((err) => {
                    if (err) {
                        console.error("Error closing projects database:", err.message);
                        reject(err);
                    } else {
                        console.log("Projects database initialized successfully");
                        resolve();
                    }
                });
            });
        });
    });
}

// Main execution
async function main() {
    try {
        await initContentsDB();
        await initProjectsDB();
        console.log("\n=== All databases initialized successfully! ===");
        process.exit(0);
    } catch (error) {
        console.error("\n=== Database initialization failed! ===");
        console.error("Error:", error);
        process.exit(1);
    }
}

// Run if called directly
if (require.main === module) {
    main();
}

module.exports = { initContentsDB, initProjectsDB };
