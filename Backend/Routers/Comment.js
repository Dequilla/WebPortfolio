const express = require('express');

const commentHandler = require('../Handlers/CommentHandler');

const router = express.Router();

router.post(
    '/create',
    function(request, response)
    {
        commentHandler.createComment(
            request.body.commenterName,
            request.body.commenterEmail,
            request.body.commentBody,
            request.body.postID,
            function(error) {
                if(error)
                    console.log(error);

                response.redirect('/portfolio/' + request.body.postID + "#comments");
            });
    }
)

router.post(
    '/delete',
    function(request, response)
    {
        commentHandler.deleteComment(request.body.commentID, function(error) {
            if(error)
                console.log(error);

            response.redirect('/portfolio/' + request.body.postID + "#comments");
        });
    }
)

router.post(
    '/edit',
    function(request, response)
    {
        commentHandler.editComment(
            request.body.commentID,
            request.body.commenterName,
            request.body.commenterEmail,
            request.body.commentBody,
            function(error) {
                if(error)
                    console.log(error);

                response.redirect('/portfolio/' + request.body.postID + "#comments");
            });
    }
)

exports.router = router;
