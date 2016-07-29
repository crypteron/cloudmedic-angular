angular.module('careteams.resource', ['ngResource'])
.provider('CareTeams', function () {
    var self = this;
    self.apiUrl = '';
    self.setApiUrl = function (apiUrl) {
        self.apiUrl = apiUrl;
    };

    self.$get = function ($resource) {
        var service = $resource(self.apiUrl + 'careteams/:path', {}, {
            'query': { method: 'GET', isArray: true },
            'update': { method: 'POST', isArray: false, params: { path: 'update' } },
            'remove': { method: 'DELETE', isArray: false },
            'create': { method: 'POST', isArray: false, params: { path: 'add' } },
            'activate': { method: 'POST', isArray: false, params: { path: 'activate' } }

        });
        return service;
    };
});