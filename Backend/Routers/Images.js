const express = require('express');

const imageHandler = require('../ImageHandler');
const loginHandler = require('../Handlers/LoginHandler');

const router = express.Router();

router.get(
    '/view',
    function(request, response, next)
    {
        if(!loginHandler.isLoggedIn(request))
        {
            next("You need to be logged in to access this page")
            return;
        }
    
        // TODO: Add pagination
        imageHandler.getImages(1, 25, function(error, images) {
            if(error)
                console.log(error);
            else
            {
                const model = {
                    images: images,
                    isLoggedIn: loginHandler.isLoggedIn(request)
                };

                response.render('./Images.hbs', model);
            }
        });
    }
)

router.post(
    '/upload',
    imageHandler.upload.single('image'),
    function(request, response, next)
    {
        if(!loginHandler.isLoggedIn(request))
        {
            next("You need to be logged in as admin to upload images");
            return;
        }

        imageHandler.uploadImage(request, function(error) {
            if(error)
                console.log(error);

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
            next("You need to be logged in as admin to update images");
            return;
        }

        imageHandler.updateImage(request, function(error) {
            if(error)
                console.log(error);

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
            next("You need to be logged in as admin to delete images");
            return;
        }

        imageHandler.deleteImage(request.params.id, function(error) {
            if(error)
                console.log(error);

            response.redirect("/admin/images/view");
        });
    }
)

exports.router = router;
