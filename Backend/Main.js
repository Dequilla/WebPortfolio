const express = require('express');
const expressHandlebars = require('express-handlebars');
const database = require('./Database');
const imageHandler = require('./ImageHandler');
const multer = require('multer');
const fs = require('fs');

const app = express();

database.setup();
imageHandler.setup();

var upload = multer({ 
    dest: __dirname + '/../Public/upload/',
    onError: function(error, next)
    {
        console.log(error);
        next(error);
    }
});

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
    '/admin/upload_file',
    function(request, response)
    {
        response.render('./UploadFile.hbs');
    }
)

app.get(
    '/admin/view_images',
    function(request, response)
    {
        const query = "SELECT * FROM images;";

        database.db.all(query, function(error, images)
        {
            const model = {
                images: images
            }

            response.render('./ViewImages.hbs', model);
        });
    }
)

app.post(
    '/admin/upload_file',
    upload.single('image'),
    function(request, response, next)
    {
        const path = request.file.destination + request.file.filename;
        const name = request.file.filename;
        const ext =  request.file.mimetype.replace("image/", "");

        fs.rename(path, path + "." + ext);

        const query = "INSERT INTO images (imageName, fileExtension) VALUES (?, ?);";

        database.db.run(query, [name, ext], function(error)
        {
            if(error)
                console.log(error);
            else
                response.redirect("/admin/upload_file");
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