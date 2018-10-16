const express = require('express');

const postsHandler = require('../Handlers/PostsHandler.js');
const loginHandler = require('../Handlers/LoginHandler');
const errorHandler = require('../Handlers/ErrorHandler');

const router = express.Router();

router.get(
    '/create',
    function(request, response, next)
    {
        if(!loginHandler.isLoggedIn(request))
        {
            next("You need to be logged in as an admin to access this page");
            return;
        }
        
        const model = {
            isLoggedIn: loginHandler.isLoggedIn(request),
            error: errorHandler.getError(response, request),
            message: errorHandler.getMessage(response, request)
        }

        response.render('./Post.hbs', model);
    }
)

router.post(
    '/create',
    function(request, response, next)
    {
        if(!loginHandler.isLoggedIn(request))
        {
            next("You need to be logged in as an admin to create posts");
            return;
        }

        postsHandler.createPost(request.body.title, request.body.body, request.body.imageID, function(error)
        {
            if(error)
                console.log(__filename + " -> " + error);
            
            response.redirect('/admin/post/create');
        });
    }
)

router.post(
    '/delete',
    function(request, response, next)
    {
        if(!loginHandler.isLoggedIn(request))
        {
            next("You need to be logged in as an admin to delete posts");
            return;
        }

        postsHandler.deletePost(request.body.postID, function(error) {
            if(error)
                console.log(error);
        });

        response.redirect('/portfolio');  
    }
)

router.get(
    '/edit/:postID',
    function(request, response)
    {
        if(!loginHandler.isLoggedIn(request))
        {
            next("You need to be logged in as an admin to edit posts");
            return;
        }

        postsHandler.getPost(request.params.postID, function(error, post) {

            const model = {
                post: post,
                postID: request.params.postID,
                isLoggedIn: loginHandler.isLoggedIn(request),
                error: errorHandler.getError(response, request),
                message: errorHandler.getMessage(response, request)
            }

            response.render('EditPost.hbs', model);
        
        });
    }
)

router.post(
    '/edit',
    function(request, response)
    {
        if(!loginHandler.isLoggedIn(request))
        {
            next("You need to be logged in as an admin to edit posts");
            return;
        }

        postsHandler.editPost(request.body.postID, request.body.title, request.body.body, request.body.imageID, function(error) {
            if(error)
                console.log(__filename + " -> " + error);

            const redirectURI = '/portfolio/' + request.body.postID;
            response.redirect(redirectURI);
        });
    }
)

exports.router = router;
