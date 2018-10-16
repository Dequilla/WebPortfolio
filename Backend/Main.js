const express = require('express');
const expressHandlebars = require('express-handlebars');
const database = require('./Database');
const imageHandler = require('./Handlers/ImageHandler');
const postsHandler = require('./Handlers/PostsHandler');
const errorHandler = require('./Handlers/ErrorHandler');
const commentHandler = require('./Handlers/CommentHandler');
const loginHandler = require('./Handlers/LoginHandler');

const images = require('./Routers/Images');
const posts = require('./Routers/Post');
const portfolio = require('./Routers/Portfolio');
const comment = require('./Routers/Comment');
const login = require('./Routers/Login');

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

loginHandler.setup(app);

app.use('/admin/images/', images.router);
app.use('/admin/post/', posts.router);
app.use('/portfolio', portfolio.router);
app.use('/comment/', comment.router);
app.use('/', login.router);

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
        const model = {
            isLoggedIn: loginHandler.isLoggedIn(request)
        }

        response.render('./About.hbs', model);
    }
);

app.get(
    '/contact',
    function(request, response)
    {
        const model = {
            isLoggedIn: loginHandler.isLoggedIn(request)
        }

        response.render('./Contact.hbs', model);
    }
)

app.use(
    function(request, response, next)
    {
        response.status(404);

        if (request.accepts('html'))
        {
            const model = {
                isLoggedIn: loginHandler.isLoggedIn(request)
            }

            response.render('./404.hbs', model);
        }
        else
        {
            response.send('404 Not found!');
        }
    }
)

app.listen(8080);
