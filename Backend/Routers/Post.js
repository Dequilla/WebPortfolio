const express = require('express');

const postsHandler = require('../PostsHandler.js');

const router = express.Router();

router.get(
    '/create',
    function(request, response)
    {
        response.render('./Post.hbs');
    }
)

router.post(
    '/create',
    function(request, response)
    {
        postsHandler.createPost(request.body.title, request.body.body, request.body.imageID, function(error)
        {
            if(error)
                errorHandler.logError(__filename, error);
            else
                response.redirect('/admin/post/create');
        });
    }
)

router.post(
    '/delete',
    function(request, response)
    {
        postsHandler.deletePost(request.body.postID, function(error) {
            if(error)
                console.log(error);
        });

        response.redirect('/portfolio');  
    }
)

router.get(
    '/edit',
    function(request, response)
    {
        response.render('EditPost.hbs');
    }
)

router.post(
    '/edit',
    function(request, response)
    {
        const redirectURI = '/portfolio/' + request.body.postID;
        response.redirect(redirectURI);
    }
)

exports.router = router;
