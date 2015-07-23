﻿angular.module('crypteron.register', [
    'ui.router',
    'ui.mask',
    'reg',
    'form',
    'cloudmedic.dropdown.values'
]).config(function ($stateProvider) {
    $stateProvider.state('register', {
        url: '/register',
        views: {
            "main": {
                controller: 'FormCtrl',
                templateUrl: 'register/register.tpl.html'
            }
        },
        data: {
            pageTitle: 'Register',
            hideNav: true,
            bodyClass: 'register',
            public: true
        }
    });
});