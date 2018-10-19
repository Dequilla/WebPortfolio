const express = require('express');

const imageHandler = require('../Handlers/ImageHandler');
const loginHandler = require('../Handlers/LoginHandler');
const errorHandler = require('../Handlers/ErrorHandler');

const router = express.Router();

router.get(
    '/view',
    function(request, response, next)
    {
        if(!loginHandler.isLoggedIn(request))
        {
	    errorHandler.setError(response, "You need to be logged in to do this action.");
	    response.redirect('/login');
            return;
        }
    
        // TODO: Add pagination
        imageHandler.getImages(1, 25, function(error, images) {
            if(error)
		errorHandler.setError(response, "Something when wrong when retrieving images from the database");
            else
            {
                const model = {
                    images: images,
                    isLoggedIn: loginHandler.isLoggedIn(request),
                    error: errorHandler.getError(response, request),
                    message: errorHandler.getMessage(response, request)
                };

                response.render('./Images.hbs', model);
            }
        });
    }
)

router.post(
    '/upload',
    imageHandler.upload.single('image'),
    function(request, response)
    {
        if(!loginHandler.isLoggedIn(request))
        {
            response.redirect("/admin/images/view");
            errorHandler.setError("You need to be logged in as admin to upload images");
            return;
        }

        imageHandler.uploadImage(request, function(error) {
            if(error)
                errorHandler.setError("Database malfunction");

            response.redirect("/admin/images/view");
        });
    }
)

router.post(
    '/update',
    imageHandler.upload.single('image'),
    function(request, response, next)
    {
        if(!loginHandler.isLoggedIn(request))
        {
            errorHandler.setError("You need to be logged in as admin to update images");
            response.redirect("/admin/images/view");
            return;
        }

        imageHandler.updateImage(request, function(error) {
            if(error)
                errorHandler.setError("Database malfunction");

            response.redirect("/admin/images/view");
        });
    }
)

router.post(
    '/delete/:id',
    function(request, response, next)
    {
        if(!loginHandler.isLoggedIn(request))
        {
            errorHandler.setError("You need to be logged in as admin to delete images");
            response.redirect("/admin/images/view");
            return;
        }

        imageHandler.deleteImage(request.params.id, function(error) {
            if(error)
                errorHandler.setError("Database malfunction");

            response.redirect("/admin/images/view");
        });
    }
)

exports.router = router;
