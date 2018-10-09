const multer = require('multer');
const fs = require('fs');

const errorHandler = require('./ErrorHandler')

const database = require('./Database');
const db = database.db;

const imagesFolder = __dirname + "/../Public/images/";

var upload = multer({ 
    dest: __dirname + '/../Public/upload/',
    onError: function(error, next)
    {
        console.log(error);
        next(error);
    }
});
exports.upload = upload;

exports.setup = function()
{
    const query = "CREATE TABLE IF NOT EXISTS images (id INTEGER PRIMARY KEY AUTOINCREMENT, imageName TEXT NOT NULL, fileExtension TEXT NOT NULL);";

    db.run(query, function(error) {
        if(error)
            errorHandler.logError(__filename, error);
        else
            console.log("Successfully initialized table for images!");
    });
}

exports.getImageURI = function(imageID)
{
    const query = "SELECT imageName, fileExtension FROM images WHERE id = ?";

    db.get(query, [imageID], function(error, image) {
        if(error)
        {
            errorHandler.logError(__filename, error);
            return undefined;
        }
        else
        {
            return imagesFolder + image.imageName + "." + image.fileExtension;
        }
    });
}

exports.getImages = function(startID, count, callback)
{
    const query = "SELECT * FROM images WHERE id >= ? LIMIT ?;";

    db.all(query, [startID, count], function(error, images) {
        callback(error, images);
    });
}

exports.uploadImage = function(request, callback)
{
    const oldPath = request.file.destination;
    const newPath = imagesFolder;
    const name = request.file.filename;

    // Check file type
    if(request.file.mimetype.indexOf("image/") != -1)
    {   
        // Might not work for all filetypes, but png, jpeg, gif and bmp is fine
        const ext =  request.file.mimetype.replace("image/", "");
        
        fs.rename(oldPath + name, newPath + name + "." + ext, function(error) {
            //callback(error);
        });

        const query = "INSERT INTO images (imageName, fileExtension) VALUES (?, ?);";
        
        db.run(query, [name, ext], function(error) {
            callback(error);
        });
    }
    else
    {
        // Delete from upload folder
        fs.unlink(oldPath + name, function(error) {
            callback("ERROR: Something other than an image was uploaded.");
        });
    }
}

exports.deleteImage = function(id, callback)
{
    var query = "SELECT imageName, fileExtension FROM images WHERE id = ?;";
    
    db.get(query, [id], function(error, image) {
        var imageURI = image.imageName + "." + image.fileExtension;
        
        fs.unlink(imagesFolder + imageURI, function(error) {
            query = "DELETE from images WHERE id = ?;";
            
            db.run(query, [id], function(error) {
                callback(error);
            });
        })
    });
}