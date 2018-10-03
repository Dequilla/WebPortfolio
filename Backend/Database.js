const sqlite = require('sqlite3');
const errorHandler = require('./ErrorHandler')

const database = new sqlite.Database(".database.sqlite");

exports.setup = function()
{
    database.run("CREATE TABLE IF NOT EXISTS images (id INTEGER PRIMARY KEY AUTOINCREMENT, imageName TEXT NOT NULL, fileExtension TEXT NOT NULL)", function(error) {
        if(error)
            errorHandler.logError(__filename, error);
        else
            console.log("Successfully created table for images!");
    });
}

exports.getImageURI = function(imageID)
{
    const query = "SELECT * FROM images WHERE id = ?";
    database.get(query, [imageID], function(error, image) {
        console.log("ID: " + image.id + " name: " + image.imageName + "." + image.fileExtension);
    });
}
