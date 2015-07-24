angular.module('users.resource', ['ngResource'])
.provider('Users', function () {
    var provider = this;
    provider.apiUrl = '';
    provider.setApiUrl = function (apiUrl) {
        provider.apiUrl = apiUrl;
    };

    provider.$get = function ($resource) {
        var service = $resource(provider.apiUrl + 'users/:path', {}, {
            'query': { method: 'GET', isArray: true },
            'meds': { method: 'GET', isArray: true, params: { path: 'Prescriptions' } },
            'search': { method: 'GET', isArray: true, params: { path: 'Find' } },
            'remove': { method: 'DELETE', isArray: false },
            'create': { method: 'POST', isArray: false, params: { path: 'Add' } }
        });
        return service;
    };
});