angular.module('prescriptions.resource', ['ngResource'])
.provider('Prescriptions', function () {
    var self = this;
    self.apiUrl = '';
    self.setApiUrl = function (apiUrl) {
        self.apiUrl = apiUrl;
    };

    self.$get = function ($resource) {
        var service = $resource(self.apiUrl + 'prescriptions/:path', {}, {
            'query': { method: 'GET', isArray: true },
            'remove': { method: 'DELETE', isArray: false },
            'create': { method: 'POST', isArray: false, params: { path: 'Add' } },
            'update': { method: 'POST', isArray: false, params: { path: 'Update' } }
        });
        return service;
    };
});