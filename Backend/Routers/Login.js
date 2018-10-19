const express = require('express');

const loginHandler = require('../Handlers/LoginHandler');
const errorHandler = require('../Handlers/ErrorHandler');

const router = express.Router();

router.get(
    '/login',
    function(request, response)
    {
        const model = {
            isLoggedIn: loginHandler.isLoggedIn(request),
            error: errorHandler.getError(response, request),
            message: errorHandler.getMessage(response, request),
            csrfToken: request.csrfToken()
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
            errorHandler.setMessage(response, "You successfully logged in!");
            response.redirect('/');
        }
        else
        {
            errorHandler.setError(response, "The username or password you entered was wrong!");
            response.redirect('/login');
        }
    }
)

router.get(
    '/logout',
    function(request, response)
    {
        loginHandler.logout(request);
        errorHandler.setMessage(response, "You successfully logged out!");
        response.redirect('/');
    }
)

exports.router = router;
