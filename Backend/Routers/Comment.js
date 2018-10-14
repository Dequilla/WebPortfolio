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

                response.redirect('/portfolio/' + request.body.postID);
            });
    }
)

exports.router = router;
