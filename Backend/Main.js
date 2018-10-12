const express = require('express');
const expressHandlebars = require('express-handlebars');
const database = require('./Database');
const imageHandler = require('./ImageHandler');
const postsHandler = require('./PostsHandler');
const errorHandler = require('./ErrorHandler');

const app = express();
app.engine('hbs', expressHandlebars({
    defaultLayout: 'Main',
    extname: '.hbs',
    helpers: {
        getImageURI: function(imageID) {
            imageHandler.getImageURI(imageID, function(error, imageURI) {
                return imageURI;
            });
        }
    }
}));

database.setup();
imageHandler.setup();
postsHandler.setup();

/* Set custom directories */
app.set('views', 'Views/');
app.set('layoutsDir', __dirname + 'Layouts/');
app.set('partialsDir', __dirname + 'Partials/');

app.use(express.static("Public/"));
app.use(express.json());       // to support JSON-encoded bodies
app.use(express.urlencoded()); // to support URL-encoded bodies

app.get(
    '/', 
    function(request, response) 
    {
        response.redirect("/about");
    }
);

app.get(
    '/about', 
    function(request, response) 
    {
        response.render('./About.hbs');
    }
);

app.get(
    '/contact',
    function(request, response)
    {
        response.render('./Contact.hbs');
    }
)

app.get(
    '/portfolio',
    function(request, response)
    {
        postsHandler.getPosts(1, 25, function(error, posts) {
            if(error)
                errorHandler.logError(__filename, error);

            const model = {
                posts: posts
            };

            response.render('./Portfolio.hbs', model);
        });
    }
)

app.get(
    '/portfolio/:id',
    function(request, response)
    {
        postsHandler.getPostWithImage(request.params.id, function(error, post)
        {
            if(error)
                errorHandler.logError(__filename, error);

            // TODO: Use some sort of markup instead/clientside?
            post.body = post.body.replace(/(\r\n|\n|\r)/gm, '<br/>');

            const model = {
                post: post
            }

            response.render('./Portfolio.hbs', model); 
        });
    }
)

app.get(
    '/admin/post/create',
    function(request, response)
    {
        response.render('./Post.hbs');
    }
)

app.post(
    '/admin/post/create',
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

app.get(
    '/admin/images/view',
    function(request, response)
    {
        imageHandler.getImages(1, 25, function(error, images) {
            if(error)
                console.log(error);
            else
            {
                const model = {
                    images: images
                };

                response.render('./Images.hbs', model);
            }
        });
    }
)

app.post(
    '/admin/images/upload',
    imageHandler.upload.single('image'),
    function(request, response, next)
    {
        imageHandler.uploadImage(request, function(error) {
            if(error)
                console.log(error);

            response.redirect("/admin/images/view");
        });
    }
)

app.post(
    '/admin/images/delete/:id',
    function(request, response)
    {
        imageHandler.deleteImage(request.params.id, function(error) {
            if(error)
                console.log(error);

            response.redirect("/admin/images/view");            
        });
    }
)   

app.use(
    function(request, response, next)
    {
        response.status(404);

        if (request.accepts('html'))
        {
            response.render('./404.hbs');
        }
        else
        {
            response.send('404 Not found!');
        }
    }
)

app.listen(8080);
