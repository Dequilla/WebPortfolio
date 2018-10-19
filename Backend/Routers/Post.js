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
	        errorHandler.setError(response, "You need to be logged in as an admin to do that.");
	        response.redirect('/login');
            return;
        }
        
        const model = {
            isLoggedIn: loginHandler.isLoggedIn(request),
            error: errorHandler.getError(response, request),
            message: errorHandler.getMessage(response, request),
            csrfToken: request.csrfToken()
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
            errorHandler.setError(response, "You need to be logged in as an admin to do that.");
	        response.redirect('/login');
            return;
        }

        postsHandler.createPost(request.body.title, request.body.body, request.body.imageID, function(error)
        {
            if(error)
           	    errorHandler.setError(response, "Something went wrong when adding the post to the database.");

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
            errorHandler.setError(response, "You need to be logged in as an admin to do that.");
	        response.redirect('/login');
            return;
        }

        postsHandler.deletePost(request.body.postID, function(error) {
            if(error)
        	    errorHandler.setError(response, "Something went wrong when trying to delete the post from the database.");        
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
            errorHandler.setError(response, "You need to be logged in as an admin to do that.");
	        response.redirect('/login');
            return;
        }

        postsHandler.getPost(request.params.postID, function(error, post) {
	    if(error || post === undefined)
		    errorHandler.setError(response, "Something went wrong when retrieving the post to edit.");

            const model = {
                post: post,
                postID: request.params.postID,
                isLoggedIn: loginHandler.isLoggedIn(request),
                error: errorHandler.getError(response, request),
                message: errorHandler.getMessage(response, request),
                csrfToken: request.csrfToken()
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
            errorHandler.setError(response, "You need to be logged in as an admin to do that.");
	        response.redirect('/login');
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
