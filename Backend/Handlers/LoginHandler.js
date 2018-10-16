const express = require('express');
const session = require('express-session');

const username = 'username';
const password = 'password';

exports.setup = function(app)
{
    app.use( session({
        secret: 'laiewnfmsudvvpewnvcm',
        resave: false,
        saveUninitialized: false
    }));
}

exports.checkLogin = function(user, pass, request)
{
    if(user == username && pass == password)
        request.session.isLoggedIn = true;

    return request.session.isLoggedIn;
}

exports.logout = function(request)
{
    request.session.isLoggedIn = false;
}

exports.isLoggedIn = function(request)
{
    if(request.session != null &&
        request.session != undefined)
        return request.session.isLoggedIn;
    else
        return null;
}