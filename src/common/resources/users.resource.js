angular.module('users.resource', ['ngResource'])
.provider('Users', function () {
    var provider = this;
    provider.apiUrl = '';
    provider.setApiUrl = function (apiUrl) {
        provider.apiUrl = apiUrl;
    };

    provider.$get = ['$resource', function ($resource) {
        var Users = $resource(provider.apiUrl + 'admin/users/:email', {}, {
            'query': { method: 'GET', isArray: true },
            remove: { method: 'DELETE', isArray: false, params: { email: "@Email" } }
        });
        return Users;
    }];
});