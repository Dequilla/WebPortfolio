const multer = require('multer');

const fs = require('fs');

const errorHandler = require('./ErrorHandler')

const database = require('../Database');
const db = database.db;

const imagesFolder = __dirname + "/../../Public/images/";

var upload = multer({ 
    dest: __dirname + '/../../Public/upload/',
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

exports.getImageURI = function(imageID, callback)
{
    const query = "SELECT imageName, fileExtension FROM images WHERE id = ?";

    db.get(query, [imageID], function(error, image) {
        if(error || image == undefined)
        {
            errorHandler.logError(__filename, error);
            callback(error, undefined);
            return;
        }
        else
        {
            callback(error, imagesFolder + image.imageName + "." + image.fileExtension);
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
    if(request.file == undefined || 
        request.file == null ||
        request.file.size <= 0)
    {
        callback("No file was uploaded");
        return;
    }

    const oldPath = request.file.destination;
    const newPath = imagesFolder;
    const name = request.file.filename;

    // Check file type
    if(request.file.mimetype.indexOf("image/") != -1)
    {   
        // Might not work for all filetypes, but png, jpeg, gif and bmp is fine
        const ext =  request.file.mimetype.replace("image/", "");
        
        fs.rename(oldPath + name, newPath + name + "." + ext, function(error) {
            if(error)
            {
                callback(error);
                return;
            }
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
            const errorString = "ERROR: Something other than an image was uploaded.";

            if(error)
                callback(errorString + " FS Error(Couldn't remove file): " + error);
            else
                callback(errorString);

            return;
        });
    }
}

exports.updateImage = function(request, callback)
{
    if(request.file == undefined ||
        request.file == null ||
        request.file.size <= 0)
    {
        callback("No file was uploaded");
        return;
    }

    const oldPath = request.file.destination;
    const newPath = imagesFolder;
    const name = request.file.filename;

    if(request.body.imageID === undefined ||
        request.body.imageID === null
    )
    {
        callback("No imageID sent to the server, image can't be updated.");
        return;
    }
    const imageID = request.body.imageID;
    
    var query = "SELECT imageName, fileExtension FROM images WHERE id = ?;"; 
    
    db.get(query, [imageID], function(error, image) {
        if(error ||
        image == undefined ||
        image == null)
        {
            callback(error);
            return;
        }

        // Remove old picture
        fs.unlink(newPath + image.imageName + '.' + image.fileExtension, function(error) {
            // Check file type
            if(request.file.mimetype.indexOf("image/") != -1)
            {   
                // Might not work for all filetypes, but png, jpeg, gif and bmp is fine
                const ext =  request.file.mimetype.replace("image/", "");
        
                fs.rename(oldPath + name, newPath + name + "." + ext, function(error) {
                    if(error)
                    {
                        callback(error);
                        return;
                    }
                });

                query = "UPDATE images SET imageName = ?, fileExtension = ? WHERE id = ?;";
       console.log("FN: " + name + " EXT: " + ext + " ImageID: " + imageID ); 
                db.run(query, [name, ext, imageID], function(error) {
                    callback(error);
                });
            }
            else
            {
                // Delete from upload folder
                fs.unlink(oldPath + name, function(error) {
                    const errorString = "ERROR: Something other than an image was uploaded.";

                    if(error)
                        callback(errorString + " FS Error(Couldn't remove file): " + error);
                    else
                        callback(errorString);

                    return;
                });
            }
        });
    }); 
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
