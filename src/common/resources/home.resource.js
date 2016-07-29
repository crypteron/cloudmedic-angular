angular.module('users.resource', ['ngResource'])
.provider('Users', function () {
    var self = this;
    self.apiUrl = '';
    self.setApiUrl = function (apiUrl) {
        self.apiUrl = apiUrl;
    };

    self.$get = function ($resource) {
        var service = $resource(self.apiUrl + 'users', {}, {
            'query': { method: 'GET', isArray: true },
            'get': { method: 'GET', isArray: false },
            'save': { method: 'PUT', isArray: false, params: { id: "@UserId" } },
            'remove': { method: 'DELETE', isArray: false, params: { id: "@UserId" } },
            'create': { method: 'POST', isArray: false }
        });
        return service;
    };
});