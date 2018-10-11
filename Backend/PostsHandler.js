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
    const query = "SELECT * FROM posts WHERE postsID = ?;";

    db.get(query, [postID], function(error, post) {
        callback(error);

        if(error)
        {
            errorHandler.logError(__filename, error);
            return undefined;
        }
        else
        {
            return post;
        }
    });
}

exports.getPostTitle = function(postID, callback)
{
    post = this.getPost(postID, callback);

    if(post != undefined)
    {
        return post.title;
    }
}

exports.getPostBody = function(postID, callback)
{
    post = this.getPost(postID, callback);

    if(post != undefined)
    {
        return post.body;
    }
}

exports.getPostImageID = function(postID, callback)
{
    post = this.getPost(postID, callback);

    if(post != undefined)
    {
        return post.imageID;
    }
}
