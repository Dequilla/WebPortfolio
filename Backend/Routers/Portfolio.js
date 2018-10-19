const express = require('express');

const postsHandler = require('../Handlers/PostsHandler');
const commentHandler = require('../Handlers/CommentHandler');
const loginHandler = require('../Handlers/LoginHandler');
const errorHandler = require('../Handlers/ErrorHandler');

const router = express.Router();

router.get(
    '/',
    function(request, response)
    {
        // TODO: Add pagination
        postsHandler.getPosts(1, 25, function(error, posts) {
            if(error)
		errorHandler.setError(response, "Something went wrong when retrieving the posts from the database");

            const model = {
                posts: posts,
                isLoggedIn: loginHandler.isLoggedIn(request),
                error: errorHandler.getError(response, request),
                message: errorHandler.getMessage(response, request),
                csrfToken: request.csrfToken()
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
		errorHandler.setError(response, "Something went wrong when retrieving the post from the database");
                return;
            }

            commentHandler.getComments(request.params.id, function(error, comments) {
                if(error || comments == undefined)
                {
                    response.redirect('/portfolio');
		    errorHandler.setError(response, "Something when wrong while retriving comments from the database");
                    return;
                }

                // TODO: Use some sort of markup instead/clientside?
                post.body = post.body.replace(/(\r\n|\n|\r)/gm, '<br/>');

                const model = {
                    post: post,
                    comments: comments,
                    isLoggedIn: loginHandler.isLoggedIn(request),
                    error: errorHandler.getError(response, request),
                    message: errorHandler.getMessage(response, request),
                    csrfToken: request.csrfToken()
                }

                response.render('./Portfolio.hbs', model); 
            });
        });
    }
)

exports.router = router;
