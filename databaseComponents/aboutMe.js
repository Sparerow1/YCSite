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
            nodeId tinyint primary key,
            nodeTitle text)`,
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
        // Node 1: About Me
        [1, 1, "Hello! I'm Yan Chen, a passionate developer who enjoys solving problems and building useful applications."],
        [2, 1, "My journey in technology began with curiosity and has grown into a lifelong pursuit of learning."],
        [3, 1, "I believe in continuous improvement and always strive to expand my skillset and knowledge."],

        // Node 2: Aspiration
        [4, 2, "My aspiration is to become a software engineer who creates impactful solutions for real-world problems."],
        [5, 2, "I am driven by the desire to make technology accessible and beneficial to everyone."],
        [6, 2, "I hope to contribute to projects that inspire and empower others."],

        // Node 3: Perseverance
        [7, 3, "Perseverance has been a key part of my journey, helping me overcome challenges and setbacks."],
        [8, 3, "I believe that persistence and resilience are essential traits for personal and professional growth."],
        [9, 3, "Every obstacle is an opportunity to learn and become stronger."],

        // Node 4: Culture
        [10, 4, "Growing up in a multicultural environment has shaped my worldview and appreciation for diversity."],
        [11, 4, "I value open-mindedness and enjoy learning about different cultures and perspectives."],
        [12, 4, "Cultural diversity enriches both my personal life and my approach to teamwork."],

        // Node 5: University Life
        [13, 5, "University life has been a time of growth, learning, and forming lasting friendships."],
        [14, 5, "I have enjoyed collaborating with peers on projects and participating in campus activities."],
        [15, 5, "The academic challenges have prepared me for a career in technology."],

        // Node 6: Came From
        [16, 6, "I come from a background that values hard work, curiosity, and resilience."],
        [17, 6, "My family and community have always encouraged me to pursue my dreams."],
        [18, 6, "These roots have given me a strong foundation for my personal and professional journey."],

        // Node 7: Immigration
        [19, 7, "Immigrating to a new country taught me adaptability and the importance of embracing change."],
        [20, 7, "The experience has made me more resilient and open to new opportunities."],
        [21, 7, "I am grateful for the challenges and growth that came with this transition."],

        // Node 8: Education
        [22, 8, "Education has always been a priority for me, driving my pursuit of knowledge."],
        [23, 8, "I am committed to lifelong learning and staying updated with the latest in technology."],
        [24, 8, "My educational journey has equipped me with the skills to tackle complex problems."]
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
        `INSERT INTO nodes (nodeId, nodeTitle) VALUES (?, ?)`;
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
