angular.module('users.resource', ['ngResource'])
.provider('Users', function () {
    var provider = this;
    provider.apiUrl = '';
    provider.setApiUrl = function (apiUrl) {
        provider.apiUrl = apiUrl;
    };

    provider.$get = function ($resource) {
        var service = $resource(provider.apiUrl + 'users/:path', {}, {
            'query': { method: 'GET', isArray: false },
            'providers': { method: 'GET', isArray: false, params: { path: 'Providers' } },
            'supporters': { method: 'GET', isArray: false, params: { path: 'Supporters' } },
            'meds': { method: 'GET', isArray: true, params: { path: 'Prescriptions' } },
            'prTeams': { method: 'GET', isArray: true, params: { path: 'Provider' } },
            'sTeams': {method: 'GET', isArray: true, params: {path: 'CareTeams'} },
            'paTeams': { method: 'GET', isArray: true, params: { path: 'Patient' } },
            'patients': { method: 'GET', isArray: true, params: { path: 'Patients' } },
            'remove': { method: 'DELETE', isArray: false },
            'create': { method: 'POST', isArray: false, params: { path: 'Add' } }

        });
        return service;
    };
});