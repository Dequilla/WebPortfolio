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
                console.log(__filename + " -> " + error);
            
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
    '/edit/:postID',
    function(request, response)
    {
        postsHandler.getPost(request.params.postID, function(error, post) {

            const model = {
                post: post,
                postID: request.params.postID
            }

            response.render('EditPost.hbs', model);
        
        });
    }
)

router.post(
    '/edit',
    function(request, response)
    {
        postsHandler.editPost(request.body.postID, request.body.title, request.body.body, request.body.imageID, function(error) {
            if(error)
                console.log(__filename + " -> " + error);

            const redirectURI = '/portfolio/' + request.body.postID;
            response.redirect(redirectURI);
        });
    }
)

exports.router = router;
