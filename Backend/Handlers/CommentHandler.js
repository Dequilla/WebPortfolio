const errorHandler = require('../ErrorHandler');
const database = require('../Database');
const helpers = require('../Helpers');

const db = database.db;

exports.setup = function()
{
    const query = "CREATE TABLE IF NOT EXISTS comments \
                    ( \
	                    commentID INTEGER PRIMARY KEY AUTOINCREMENT, \
	                    commenterName TEXT NOT NULL, \
	                    commenterEmail TEXT, \
	                    commentBody TEXT NOT NULL, \
	                    postID INTEGER NOT NULL, \
	                    FOREIGN KEY (postID) REFERENCES posts(postID) \
                    );";

    db.run(query, function(error) {
        if(error)
            errorHandler.logError(__filename, error);
        else
            console.log("Successfully initialized table for comments!");
    });
}

exports.createComment = function(commenterName, commenterEmail, commentBody, postID, callback)
{
    const query = "INSERT INTO comments \
                    ( \
	                    commenterName, \
	                    commenterEmail, \
	                    commentBody, \
	                    postID \
                    ) \
                    VALUES \
                    ( \
	                    ?, \
	                    ?, \
	                    ?, \
	                    ? \
                    );";

   if(!helpers.verifyText(commenterName) ||
      !helpers.verifyText(commentBody))
    {
        callback("ERROR: Commenter name or comment body was empty");
        return;
    }

    db.run(query, [commenterName, commenterEmail, commentBody, postID], function(error) {
        callback(error);
    });
}

exports.getComments = function(postID, callback)
{
    const query = "SELECT * FROM comments WHERE postID = ?;";

    db.all(query, [postID], function(error, comments) {
        callback(error, comments);
    });
}
