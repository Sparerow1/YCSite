#!/usr/bin/env node

const sqlite3 = require("sqlite3").verbose();
const path = require("path");
const fs = require("fs");

class DatabaseManager {
    constructor() {
        this.dbDir = path.join(process.cwd(), "databaseComponents");
        this.contentsPath = path.join(this.dbDir, "contents.db");
        this.projectsPath = path.join(this.dbDir, "projects.db");
        this.initialized = false;
    }

    // Ensure database directory exists
    ensureDirectory() {
        if (!fs.existsSync(this.dbDir)) {
            console.log("Creating database directory:", this.dbDir);
            fs.mkdirSync(this.dbDir, { recursive: true });
        }
        console.log("Database directory:", this.dbDir);
        console.log("Directory exists:", fs.existsSync(this.dbDir));
        console.log("Directory writable:", fs.accessSync(this.dbDir, fs.constants.W_OK) ? "Yes" : "No");
    }

    // Check if databases exist and are accessible
    checkDatabases() {
        console.log("\n--- Database Status Check ---");
        
        const contentsExists = fs.existsSync(this.contentsPath);
        const projectsExists = fs.existsSync(this.projectsPath);
        
        console.log("Contents DB exists:", contentsExists);
        console.log("Projects DB exists:", projectsExists);
        
        if (contentsExists) {
            try {
                const stats = fs.statSync(this.contentsPath);
                console.log("Contents DB size:", stats.size, "bytes");
                console.log("Contents DB writable:", fs.accessSync(this.contentsPath, fs.constants.W_OK) ? "Yes" : "No");
            } catch (error) {
                console.log("Contents DB stats error:", error.message);
            }
        }
        
        if (projectsExists) {
            try {
                const stats = fs.statSync(this.projectsPath);
                console.log("Projects DB size:", stats.size, "bytes");
                console.log("Projects DB writable:", fs.accessSync(this.projectsPath, fs.constants.W_OK) ? "Yes" : "No");
            } catch (error) {
                console.log("Projects DB stats error:", error.message);
            }
        }
        
        return { contentsExists, projectsExists };
    }

    // Initialize contents database
    async initContentsDB() {
        return new Promise((resolve, reject) => {
            console.log("\n--- Initializing Contents Database ---");
            console.log("Database path:", this.contentsPath);
            
            const db = new sqlite3.Database(this.contentsPath, sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE, (err) => {
                if (err) {
                    console.error("❌ Error connecting to contents database:", err.message);
                    reject(err);
                    return;
                }
                console.log("✅ Connected to contents database successfully");
                
                db.serialize(() => {
                    // Create tables
                    const createTables = [
                        `CREATE TABLE IF NOT EXISTS nodes (
                            nodeId tinyint primary key,
                            nodeTitle text
                        )`,
                        `CREATE TABLE IF NOT EXISTS imageLinks (
                            imgId tinyint primary key,
                            imgLink varchar(255),
                            nodeId tinyint,
                            foreign key (nodeId) references nodes(nodeId)
                        )`,
                        `CREATE TABLE IF NOT EXISTS paragraphs (
                            paraId tinyint primary key,
                            nodeId tinyint,
                            paraText text,
                            foreign key (nodeId) references nodes(nodeId)
                        )`
                    ];
                    
                    let tablesCreated = 0;
                    const totalTables = createTables.length;
                    
                    createTables.forEach((sql, index) => {
                        db.run(sql, (err) => {
                            if (err) {
                                console.error(`❌ Error creating table ${index + 1}:`, err.message);
                                reject(err);
                                return;
                            }
                            tablesCreated++;
                            console.log(`✅ Table ${index + 1} ready`);
                            
                            if (tablesCreated === totalTables) {
                                this.insertContentsData(db, resolve, reject);
                            }
                        });
                    });
                });
            });
        });
    }

    // Insert contents data
    insertContentsData(db, resolve, reject) {
        console.log("Inserting contents data...");
        
        // Clear existing data
        const tables = ["nodes", "imageLinks", "paragraphs"];
        let clearedTables = 0;
        
        tables.forEach((table) => {
            db.run(`DELETE FROM ${table}`, (err) => {
                if (err) {
                    console.error(`❌ Error clearing ${table} table:`, err.message);
                } else {
                    console.log(`✅ Cleared ${table} table`);
                }
                clearedTables++;
                
                if (clearedTables === tables.length) {
                    this.insertContentsValues(db, resolve, reject);
                }
            });
        });
    }

    // Insert contents values
    insertContentsValues(db, resolve, reject) {
        const nodesValues = [
            [1, "About Me"], [2, "Aspiration"], [3, "Perseverance"], [4, "Culture"],
            [5, "University Life"], [6, "Came From"], [7, "Immigration"], [8, "Education"]
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
            [1, "https://example.com/image1.jpg", 1], [2, "https://example.com/image2.jpg", 2],
            [3, "https://example.com/image3.jpg", 3], [4, "https://example.com/image4.jpg", 4],
            [5, "https://example.com/image5.jpg", 5], [6, "https://example.com/image6.jpg", 6],
            [7, "https://example.com/image7.jpg", 7], [8, "https://example.com/image8.jpg", 8]
        ];
        
        // Insert data
        const insertNodesSql = `INSERT INTO nodes (nodeId, nodeTitle) VALUES (?, ?)`;
        const insertParagraphsSql = `INSERT INTO paragraphs (paraId, nodeId, paraText) VALUES (?, ?, ?)`;
        const insertImageLinksSql = `INSERT INTO imageLinks (imgId, imgLink, nodeId) VALUES (?, ?, ?)`;
        
        let insertedNodes = 0, insertedParagraphs = 0, insertedImageLinks = 0;
        const totalInserts = nodesValues.length + paragraphsValues.length + imageLinksValues.length;
        
        // Insert nodes
        nodesValues.forEach((value) => {
            db.run(insertNodesSql, value, (err) => {
                if (err) {
                    console.error("❌ Error inserting node:", value, err.message);
                } else {
                    console.log("✅ Inserted node:", value[1]);
                }
                insertedNodes++;
                if (insertedNodes + insertedParagraphs + insertedImageLinks === totalInserts) {
                    db.close((err) => {
                        if (err) {
                            console.error("❌ Error closing contents database:", err.message);
                            reject(err);
                        } else {
                            console.log("✅ Contents database initialized successfully");
                            resolve();
                        }
                    });
                }
            });
        });
        
        // Insert paragraphs
        paragraphsValues.forEach((value) => {
            db.run(insertParagraphsSql, value, (err) => {
                if (err) {
                    console.error("❌ Error inserting paragraph:", value, err.message);
                } else {
                    console.log("✅ Inserted paragraph for node:", value[1]);
                }
                insertedParagraphs++;
                if (insertedNodes + insertedParagraphs + insertedImageLinks === totalInserts) {
                    db.close((err) => {
                        if (err) {
                            console.error("❌ Error closing contents database:", err.message);
                            reject(err);
                        } else {
                            console.log("✅ Contents database initialized successfully");
                            resolve();
                        }
                    });
                }
            });
        });
        
        // Insert image links
        imageLinksValues.forEach((value) => {
            db.run(insertImageLinksSql, value, (err) => {
                if (err) {
                    console.error("❌ Error inserting image link:", value, err.message);
                } else {
                    console.log("✅ Inserted image link for node:", value[2]);
                }
                insertedImageLinks++;
                if (insertedNodes + insertedParagraphs + insertedImageLinks === totalInserts) {
                    db.close((err) => {
                        if (err) {
                            console.error("❌ Error closing contents database:", err.message);
                            reject(err);
                        } else {
                            console.log("✅ Contents database initialized successfully");
                            resolve();
                        }
                    });
                }
            });
        });
    }

    // Initialize projects database
    async initProjectsDB() {
        return new Promise((resolve, reject) => {
            console.log("\n--- Initializing Projects Database ---");
            console.log("Database path:", this.projectsPath);
            
            const db = new sqlite3.Database(this.projectsPath, sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE, (err) => {
                if (err) {
                    console.error("❌ Error connecting to projects database:", err.message);
                    reject(err);
                    return;
                }
                console.log("✅ Connected to projects database successfully");
                
                db.serialize(() => {
                    db.run(`CREATE TABLE IF NOT EXISTS project(
                        proId INTEGER PRIMARY KEY autoincrement, 
                        proTitle TEXT, 
                        proImage TEXT, 
                        proDescription TEXT,
                        proLink TEXT
                    )`, (err) => {
                        if (err) {
                            console.error("❌ Error creating project table:", err.message);
                            reject(err);
                            return;
                        }
                        console.log("✅ Project table ready");
                        
                        // Clear existing data
                        db.run(`DELETE FROM project`, (err) => {
                            if (err) {
                                console.error("❌ Error clearing project table:", err.message);
                            } else {
                                console.log("✅ Cleared project table");
                            }
                            
                            // Insert project data
                            const projectValues = [
                                ["Bible-Assistant", "https://via.placeholder.com/150", "A Bible study assistant.", "https://github.com/Sparerow1/bible-study-assistant"],
                                ["Kyckflix", "https://via.placeholder.com/150", "A project about movies and tv shows.", "https://github.com/grammerjam/team-kyck"],
                                ["Yan's YouTube", "https://via.placeholder.com/150", "My version of YouTube.", "https://github.com/Sparerow1/YouTube_Clone"],
                                ["Support Squad", "https://via.placeholder.com/150", "A project to help homeless people.", "https://github.com/Sparerow1/Support_Squad"],
                                ["Database Projects", "https://via.placeholder.com/150", "Projects for my database", "https://bitbucket.org/yanheng_chen/lis3781/src/master/"]
                            ];
                            
                            const insertIntoProjectSql = `INSERT INTO project (proTitle, proImage, proDescription, proLink) values (?, ?, ?, ?)`;
                            let insertedProjects = 0;
                            
                            projectValues.forEach((value) => {
                                db.run(insertIntoProjectSql, value, (err) => {
                                    if (err) {
                                        console.error("❌ Error inserting project:", value[0], err.message);
                                    } else {
                                        console.log("✅ Inserted project:", value[0]);
                                    }
                                    insertedProjects++;
                                    
                                    if (insertedProjects === projectValues.length) {
                                        db.close((err) => {
                                            if (err) {
                                                console.error("❌ Error closing projects database:", err.message);
                                                reject(err);
                                            } else {
                                                console.log("✅ Projects database initialized successfully");
                                                resolve();
                                            }
                                        });
                                    }
                                });
                            });
                        });
                    });
                });
            });
        });
    }

    // Initialize all databases
    async initializeAll() {
        try {
            console.log("=== Database Manager Starting ===");
            this.ensureDirectory();
            
            const { contentsExists, projectsExists } = this.checkDatabases();
            
            // Always reinitialize in container environment
            console.log("\n=== Initializing Databases ===");
            await this.initContentsDB();
            await this.initProjectsDB();
            
            this.initialized = true;
            console.log("\n=== All databases initialized successfully! ===");
            
            // Final status check
            this.checkDatabases();
            
            return true;
        } catch (error) {
            console.error("\n=== Database initialization failed! ===");
            console.error("Error:", error);
            throw error;
        }
    }

    // Get database paths for API routes
    getDatabasePaths() {
        return {
            contents: this.contentsPath,
            projects: this.projectsPath
        };
    }
}

// Export for use in other modules
module.exports = DatabaseManager;

// Run if called directly
if (require.main === module) {
    const manager = new DatabaseManager();
    manager.initializeAll()
        .then(() => {
            console.log("Database initialization completed successfully");
            process.exit(0);
        })
        .catch((error) => {
            console.error("Database initialization failed:", error);
            process.exit(1);
        });
}
