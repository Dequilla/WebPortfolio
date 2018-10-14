const express = require('express');

const postsHandler = require('../PostsHandler');
const commentHandler = require('../Handlers/CommentHandler');

const router = express.Router();

router.get(
    '/',
    function(request, response)
    {
        postsHandler.getPosts(1, 25, function(error, posts) {
            if(error)
                console.log(__filename + error);

            const model = {
                posts: posts
            };

            response.render('./Portfolio.hbs', model);
        });
    }
)

router.get(
    '/:id',
    function(request, response)
    {
        postsHandler.getPostWithImage(request.params.id, function(error, post)
        {
            if(error || post == undefined)
            {
                response.redirect('/portfolio');
                console.log(__filename + error);
                return;
            }

            commentHandler.getComments(request.params.id, function(error, comments) {
                if(error || comments == undefined)
                {
                    response.redirect('/portfolio');
                    console.log(__filename + error);
                    return;
                }

                // TODO: Use some sort of markup instead/clientside?
                post.body = post.body.replace(/(\r\n|\n|\r)/gm, '<br/>');

                const model = {
                    post: post,
                    comments: comments
                }

                response.render('./Portfolio.hbs', model); 
            });
        });
    }
)

exports.router = router;
