angular.module('users.resource', ['ngResource'])
.provider('Users', function () {
    var provider = this;
    provider.apiUrl = '';
    provider.setApiUrl = function (apiUrl) {
        provider.apiUrl = apiUrl;
    };

    provider.$get = function ($resource) {
        var service = $resource(provider.apiUrl + 'users/:Email', {}, {
            'query': { method: 'GET', isArray: true },
            'remove': { method: 'DELETE', isArray: false, params: { Email: "@Email" } }
        });
        return service;
    };
});