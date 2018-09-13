const express = require('express');
const expressHandlebars = require('express-handlebars');

const app = express();

app.engine
(
    'hbs', 
    expressHandlebars({
        defaultLayout: '../../Layouts/Main',
        extname: '.hbs'
    })
);

app.get(
    '/', 
    function(request, response) {
        response.render('./Test-page.hbs');
        response.status(200);
    }
);

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