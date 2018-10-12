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

app.post(
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

exports.router = router;
