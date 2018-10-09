const imageHandler = require('./ImageHandler');
const errorHandler = require('./ErrorHandler');
const database = require('./Database');

const db = database.db;

exports.setup = function()
{
    const query = "CREATE TABLE IF NOT EXISTS posts \
    ( \
        id INTEGER PRIMARY KEY AUTOINCREMENT, \
        title TEXT NOT NULL, \
        body TEXT, \
        imageID INTEGER NOT NULL, \
        FOREIGN KEY (imageID) REFERENCES images(id) \
    );";

    db.run(query, function(error) {
        if(error)
            errorHandler.logError(__filename, error);
        else
            console.log("Successfully initialized table for posts!");
    });
}