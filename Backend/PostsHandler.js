const imageHandler = require('./ImageHandler');

const errorHandler = require('./ErrorHandler');
const database = require('./Database');

const db = database.db;

exports.setup = function()
{
    const query = "CREATE TABLE IF NOT EXISTS posts \
    ( \
        postID INTEGER PRIMARY KEY AUTOINCREMENT, \
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

exports.createPost = function(title, body, imageID, callback)
{
    const query = "INSERT INTO posts (title, body, imageID) VALUES (?, ?, ?);";

    if(title == '' ||
        body == '' ||
        imageID == '' ||
        isNaN(imageID) ||
        !Number.isInteger(parseInt(imageID)) ||
        !(parseInt(imageID) > 0) 
    )
    {
        callback("All fields are required. ImageID has to be an integer.");
        return;
    }

    db.run(query, [title, body, imageID], function(error) {
        if(error)
            errorHandler.logError(__filename, error);
        else
            console.log("Successfully created a post!");
        
        callback(error);
    });
}

exports.getPosts = function(startID, count, callback)
{
    const query = "SELECT * \
                    FROM posts \
                    JOIN images ON images.id = posts.imageID \
                    WHERE posts.postID >= ? \
                    ORDER BY posts.postID \
                    LIMIT ?;";

    db.all(query, [startID, count], function(error, posts) {
        callback(error, posts);
    });
}

exports.getPost = function(postID, callback)
{
    const query = "SELECT * FROM posts WHERE postID = ?;";

    db.get(query, [postID], function(error, post) {

        if(error)
            errorHandler.logError(__filename, error);
            
        callback(error, post);
    });
}

exports.getPostWithImage = function(postID, callback)
{
    const query = "SELECT * \
                    FROM posts \
                    JOIN images ON images.id = posts.imageID \
                    WHERE postID = ?;";

    db.get(query, [postID], function(error, post) {

        if(error)
            errorHandler.logError(__filename, error);

        callback(error, post);
    });
}

exports.deletePost = function(postID, callback)
{
    const query = "DELETE FROM posts WHERE postID = ?;";

    db.run(query, [postID], function(error) {
        if(error)
            errorHandler.logError(__filename, error);

        callback(error);
    });
}

exports.editPost = function(postID, title, body, imageID, callback)
{
    const query = "UPDATE posts SET title = ?, body = ?, imageID = ? WHERE postID = ?;";

    db.run(query, [title, body, imageID, postID], function(error) {
        if(error)
            errorHandler.logError(__filename, error);

        callback(error);
    });
}
