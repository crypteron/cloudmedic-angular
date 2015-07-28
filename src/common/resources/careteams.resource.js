angular.module('careteams.resource', ['ngResource'])
.provider('CareTeams', function () {
    var provider = this;
    provider.apiUrl = '';
    provider.setApiUrl = function (apiUrl) {
        provider.apiUrl = apiUrl;
    };

    provider.$get = function ($resource) {
        var service = $resource(provider.apiUrl + 'careteams/:path', {}, {
            'query': { method: 'GET', isArray: true },
            'remove': { method: 'DELETE', isArray: false },
            'create': { method: 'POST', isArray: false, params: { path: 'Add' } }
        });
        return service;
    };
});