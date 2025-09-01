#!/usr/bin/env node

const sqlite3 = require("sqlite3").verbose();
const path = require("path");
const fs = require("fs");

console.log("=== Database Connection Test ===");

// Test database paths
const contentsPath = path.join(process.cwd(), "databaseComponents", "contents.db");
const projectsPath = path.join(process.cwd(), "databaseComponents", "projects.db");

console.log("Contents database path:", contentsPath);
console.log("Projects database path:", projectsPath);

// Check if database files exist
console.log("\n--- File Existence Check ---");
console.log("Contents DB exists:", fs.existsSync(contentsPath));
console.log("Projects DB exists:", fs.existsSync(projectsPath));

// Test contents database connection
function testContentsDB() {
    return new Promise((resolve, reject) => {
        console.log("\n--- Testing Contents Database ---");
        
        const db = new sqlite3.Database(contentsPath, sqlite3.OPEN_READONLY, (err) => {
            if (err) {
                console.error("❌ Error connecting to contents database:", err.message);
                reject(err);
                return;
            }
            console.log("✅ Connected to contents database successfully");
            
            // Test a simple query
            db.get("SELECT COUNT(*) as count FROM nodes", (err, row) => {
                if (err) {
                    console.error("❌ Error querying nodes table:", err.message);
                    reject(err);
                } else {
                    console.log("✅ Nodes table query successful, count:", row.count);
                }
                
                db.close((err) => {
                    if (err) {
                        console.error("❌ Error closing contents database:", err.message);
                        reject(err);
                    } else {
                        console.log("✅ Contents database closed successfully");
                        resolve();
                    }
                });
            });
        });
    });
}

// Test projects database connection
function testProjectsDB() {
    return new Promise((resolve, reject) => {
        console.log("\n--- Testing Projects Database ---");
        
        const db = new sqlite3.Database(projectsPath, sqlite3.OPEN_READONLY, (err) => {
            if (err) {
                console.error("❌ Error connecting to projects database:", err.message);
                reject(err);
                return;
            }
            console.log("✅ Connected to projects database successfully");
            
            // Test a simple query
            db.get("SELECT COUNT(*) as count FROM project", (err, row) => {
                if (err) {
                    console.error("❌ Error querying project table:", err.message);
                    reject(err);
                } else {
                    console.log("✅ Project table query successful, count:", row.count);
                }
                
                db.close((err) => {
                    if (err) {
                        console.error("❌ Error closing projects database:", err.message);
                        reject(err);
                    } else {
                        console.log("✅ Projects database closed successfully");
                        resolve();
                    }
                });
            });
        });
    });
}

// Test API endpoints
async function testAPIEndpoints() {
    console.log("\n--- Testing API Endpoints ---");
    
    try {
        // Test if the app is running
        const response = await fetch("http://localhost:3000/api");
        if (response.ok) {
            const data = await response.json();
            console.log("✅ API endpoint /api working, data length:", data.length);
        } else {
            console.log("❌ API endpoint /api failed with status:", response.status);
        }
    } catch (error) {
        console.log("❌ API endpoint /api error:", error.message);
    }
    
    try {
        const response = await fetch("http://localhost:3000/api/projects");
        if (response.ok) {
            const data = await response.json();
            console.log("✅ API endpoint /api/projects working, data length:", data.length);
        } else {
            console.log("❌ API endpoint /api/projects failed with status:", response.status);
        }
    } catch (error) {
        console.log("❌ API endpoint /api/projects error:", error.message);
    }
}

// Main execution
async function main() {
    try {
        await testContentsDB();
        await testProjectsDB();
        
        // Only test API if fetch is available (Node 18+)
        if (typeof fetch !== 'undefined') {
            await testAPIEndpoints();
        } else {
            console.log("\n--- Skipping API tests (fetch not available) ---");
        }
        
        console.log("\n=== All database tests completed successfully! ===");
        process.exit(0);
    } catch (error) {
        console.error("\n=== Database tests failed! ===");
        console.error("Error:", error);
        process.exit(1);
    }
}

// Run if called directly
if (require.main === module) {
    main();
}

module.exports = { testContentsDB, testProjectsDB, testAPIEndpoints };
