const express = require('express');
const expressHandlebars = require('express-handlebars');
const database = require('./Database');
const imageHandler = require('./ImageHandler');
const postsHandler = require('./PostsHandler');
const multer = require('multer');
const fs = require('fs');

const app = express();

database.setup();
imageHandler.setup();
postsHandler.setup();

app.engine(
    'hbs', 
    expressHandlebars({
        defaultLayout: 'Main',
        extname: '.hbs'
    })
);

/* Set custom directories */
app.set('views', 'Views/');
app.set('layoutsDir', __dirname + 'Layouts/');
app.set('partialsDir', __dirname + 'Partials/');

app.use(express.static("Public/"));

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
        response.render('./Portfolio.hbs');
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