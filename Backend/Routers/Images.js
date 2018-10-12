const express = require('express');

const imageHandler = require('../ImageHandler');

const router = express.Router();

router.get(
    '/view',
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

router.post(
    '/upload',
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

router.post(
    '/update',
    imageHandler.upload.single('image'),
    function(request, response, next)
    {
        imageHandler.updateImage(request, function(error) {
            if(error)
                console.log(error);

            response.redirect("/admin/images/view");
        });
    }
)

router.post(
    '/delete/:id',
    function(request, response)
    {
        imageHandler.deleteImage(request.params.id, function(error) {
            if(error)
                console.log(error);

            response.redirect("/admin/images/view");
        });
    }
)

exports.router = router;
