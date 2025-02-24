const sqlite3 = require("sqlite3").verbose();

const db = new sqlite3.Database( // connect to the database if exists, if not create it
    "./contents.db",
    sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE,
    (err) => {
        if (err) {
            console.error(err.message);
        } else {
            console.log("Connected to the contents SQLite database.");
        }
    }
);

// serialize the database so the queries are executed in order
db.serialize(() => { 
    db.run( // create the nodes table if not exists
        `CREATE TABLE IF NOT EXISTS nodes (
            nodeId tinyint primary key)`,
        (err) => {
            if (err) {
                return console.error("Error creating nodes table: " + err.message);
            } else {console.log("Created nodes table.");}
        }
    );
    

    db.run( // create the imageLinks table if not exists
        `CREATE TABLE IF NOT EXISTS imageLinks (
            imgId tinyint primary key,
            imgLink varchar(255),
            nodeId tinyint,
            foreign key (nodeId) references nodes(nodeId))`,
        (err) => {
            if (err) {
                return console.error("Error creating imageLinks table: " + err.message);
            }
            else {console.log("Created imageLinks table.");}
        }
    );


    db.run( // create the paragraphs table if not exists
        `CREATE TABLE IF NOT EXISTS paragraphs (
            paraId tinyint primary key,
            nodeId tinyint,
            paraText text,
            foreign key (nodeId) references nodes(nodeId))`,
            (err) => {
                if (err) {
                    return console.error("Error creating paragraphs table: " + err.message);
                } else {console.log("Created paragraphs table.");}
            }
    );

    // clear the existing data
    const tables = ["nodes", "imageLinks", "paragraphs"];

    tables.forEach((table) => {
        db.run(`DELETE FROM ${table}`,
            (err) => {
                if (err) {
                    return console.error("Error deleting data from " + table + " table: " + err.message);
                }
                else {console.log("Deleted data from " + table + " table.");}
            }
        )
        
    });

    // database values and insert statements
    const nodesValues = [
        [1],[2],[3],[4],[5],[6],[7],[8]
    ];
    const paragraphsValues = [
        [1, 1, "This is the first paragraph for node 1."],
        [2, 1, "This is the second paragraph for node 1."],
        [3, 1, "This is the third paragraph for node 1."],
        [4, 2, "This is the first paragraph for node 2."],
        [5, 2, "This is the second paragraph for node 2."],
        [6, 2, "This is the third paragraph for node 2."],
        [7, 3, "This is the first paragraph for node 3."],
        [8, 3, "This is the second paragraph for node 3."],
        [9, 3, "This is the third paragraph for node 3."],
        [10, 4, "This is the first paragraph for node 4."],
        [11, 4, "This is the second paragraph for node 4."],
        [12, 4, "This is the third paragraph for node 4."],
        [13, 5, "This is the first paragraph for node 5."],
        [14, 5, "This is the second paragraph for node 5."],
        [15, 5, "This is the third paragraph for node 5."],
        [16, 6, "This is the first paragraph for node 6."],
        [17, 6, "This is the second paragraph for node 6."],
        [18, 6, "This is the third paragraph for node 6."],
        [19, 7, "This is the first paragraph for node 7."],
        [20, 7, "This is the second paragraph for node 7."],
        [21, 7, "This is the third paragraph for node 7."],
        [22, 8, "This is the first paragraph for node 8."],
        [23, 8, "This is the second paragraph for node 8."],
        [24, 8, "This is the third paragraph for node 8."]
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
    const insertNodesSql = 
        `INSERT INTO nodes (nodeId) VALUES (?)`;
    const insertParagraphsSql =
        `INSERT INTO paragraphs (paraId, nodeId, paraText) VALUES (?, ?, ?)`;
    const insertImageLinksSql =
        `INSERT INTO imageLinks (imgId, imgLink, nodeId) VALUES (?, ?, ?)`;
    // inserting the values
    nodesValues.forEach((value) => {
        db.run(insertNodesSql, value, (err) => {
            if (err) {
                return console.error("Error inserting nodes: " + value + err.message);
            } else {console.log("Inserted nodeId " + value + " into nodes table.");}
        });
    })
    
    paragraphsValues.forEach((value) => {
        db.run(insertParagraphsSql, value, (err) => {
            if (err) {
                return console.error("Error inserting paragraphs: " + value + err.message);
            } else {console.log("Inserted paragraph " + value + " into paragraphs table.");}
        }); 
        
    })

    imageLinksValues.forEach((value) => {
        db.run(insertImageLinksSql, value, (err) => {
            if (err) {
                return console.error("Error inserting imageLinks: " + value + err.message);
            } else {console.log("Inserted image link " + value + " into imageLinks table.");}
        });
    })
    
    db.close((err) => {
        if (err) {
            return console.error("Error occured when closing the database connection: " + err.message);
        } else {console.log("Closed the database connection.");}
    })
})
