const sqlite3 = require("sqlite3").verbose();

const db = new sqlite3.Database( // connect to the database if exists, if not create it
    "./projects.db",
    sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE,
    (err) => {
        if (err) {
            console.error(err.message);
        } else {
            console.log("Connected to the contents SQLite database.");
        }
    }
);

db.serialize(() => {
    db.run(
        `CREATE TABLE IF NOT EXISTS project(
        proId INTEGER PRIMARY KEY autoincrement, 
        proTitle TEXT, 
        proImage TEXT, 
        proDescription TEXT,
        proLink TEXT
        )`,
    );

    db.run(`DELETE FROM project`,
        (err) => {
            if (err) {
                return console.error("Error deleting data from project" + " table: " + err.message);
            }
            else {console.log("Deleted data from project" + " table.");}
        }
    )
    projectValues = [
        ["Yan's YouTube", "https://via.placeholder.com/150", "My version of YouTube.", "https://github.com/Sparerow1/YouTube_Clone"],
        ["Support Squad", "https://via.placeholder.com/150", "A project to help homeless people.", "https://github.com/Sparerow1/Support_Squad"],
        ["Database Projects", "https://via.placeholder.com/150", "Projects for my database", "https://bitbucket.org/yanheng_chen/lis3781/src/master/"],
    ];
    const insertIntoProjectSql = `
        INSERT INTO project (proTitle, proImage, proDescription, proLink) values (?, ?, ?, ?)`

    projectValues.forEach((value) => {db.run(
        insertIntoProjectSql,
        value,
        (err) => {
            if (err) {
                return console.error("Error inserting data into project " + " table: " + err.message);
            }
            else {console.log("Inserted data into project " + " table.");}
        }
    );});

    db.close((err) => {
        if (err) {
            return console.error("Error occured when closing the database connection: " + err.message);
        } else {console.log("Closed the database connection.");}
    })
});