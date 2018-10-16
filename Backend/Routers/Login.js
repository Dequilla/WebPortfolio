const express = require('express');

const loginHandler = require('../Handlers/LoginHandler');

const router = express.Router();

router.get(
    '/login',
    function(request, response)
    {
        const model = {
            isLoggedIn: loginHandler.isLoggedIn(request)
        }

        if(model.isLoggedIn)
            response.redirect('/');
        else
            response.render('./Login.hbs', model);
    }
)

router.post(
    '/login',
    function(request, response)
    {
        if(loginHandler.checkLogin(
            request.body.username,
            request.body.password,
            request)
        )
        {
            response.redirect('/');
        }
        else
        {
            response.redirect('/login');
        }
    }
)

router.get(
    '/logout',
    function(request, response)
    {
        loginHandler.logout(request);
        response.redirect('/');
    }
)

exports.router = router;
