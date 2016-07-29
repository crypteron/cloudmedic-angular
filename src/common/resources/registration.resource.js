angular.module('registration.resource', ['ngResource'])
.provider('Registration', function () {
    var self = this;
    self.apiUrl = '';
    self.setApiUrl = function (apiUrl) {
        self.apiUrl = apiUrl;
    };

    self.$get = function ($resource) {
        var service = $resource(self.apiUrl + 'Account/:path', {}, {
            'register': { method: 'POST', isArray: false, params: { path: 'Register' } },
            'supporter': { method: 'POST', isArray: false, params: { path: 'Supporter' } }
        });
        return service;
    };
});