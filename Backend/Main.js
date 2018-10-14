const express = require('express');
const expressHandlebars = require('express-handlebars');
const database = require('./Database');
const imageHandler = require('./ImageHandler');
const postsHandler = require('./PostsHandler');
const errorHandler = require('./ErrorHandler');
const commentHandler = require('./Handlers/CommentHandler');

const images = require('./Routers/Images');
const posts = require('./Routers/Post');
const portfolio = require('./Routers/Portfolio');
const comment = require('./Routers/Comment');

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
commentHandler.setup();

/* Set custom directories */
app.set('views', 'Views/');
app.set('layoutsDir', __dirname + 'Layouts/');
app.set('partialsDir', __dirname + 'Partials/');

app.use(express.static("Public/"));
app.use(express.json());       // to support JSON-encoded bodies
app.use(express.urlencoded()); // to support URL-encoded bodies

app.use('/admin/images/', images.router);
app.use('/admin/post/', posts.router);
app.use('/portfolio', portfolio.router);
app.use('/comment/', comment.router);

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
