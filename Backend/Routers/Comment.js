const express = require('express');

const commentHandler = require('../Handlers/CommentHandler');
const loginHandler = require('../Handlers/LoginHandler');
const errorHandler = require('../Handlers/ErrorHandler');

const router = express.Router();

router.post(
    '/create',
    function(request, response, next)
    {
        commentHandler.createComment(
            request.body.commenterName,
            request.body.commenterEmail,
            request.body.commentBody,
            request.body.postID,
            function(error) {
                if(error)
			errorHandler.setError(response, "Something went wrong when posting to the database, please try again later.");

                response.redirect('/portfolio/' + request.body.postID + "#comments");
            });
    }
)

router.post(
    '/delete',
    function(request, response, next)
    {
        if(!loginHandler.isLoggedIn(request))
        {
	    errorHandler.setError(response, "You need to be logged in as an admin.");
	    response.redirect('/portfolio/');
            return;
        }

        commentHandler.deleteComment(request.body.commentID, function(error) {
            if(error)
	        errorHandler.setError(response, "Something went wrong when deleting the comment from the database.");

            response.redirect('/portfolio/' + request.body.postID + "#comments");
        });
    }
)

router.post(
    '/edit',
    function(request, response, next)
    {
        if(!loginHandler.isLoggedIn(request))
        {
	    errorHandler.setError(response, "You need to be logged in as an admin.");
	    response.redirect('/portfolio');
            return;
        }

        commentHandler.editComment(
            request.body.commentID,
            request.body.commenterName,
            request.body.commenterEmail,
            request.body.commentBody,
            function(error) {
                if(error)
		    errorHandler.setError(response, "Something went wrong in the database when editing the comment.");

                response.redirect('/portfolio/' + request.body.postID + "#comments");
            });
    }
)

exports.router = router;
