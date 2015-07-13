angular.module('reg.service', ['localizedNotifications', 'ui.router', 'LocalStorageModule'])
.provider('reg', function () {
    var provider = this;
    provider.apiUrl = '';
    provider.assumePublic = true;
    provider.excludeEndpoints = [];

    // Provider configuration
    // Set the URL of the Login API
    provider.setApiUrl = function (apiUrl) {
        provider.apiUrl = apiUrl;
    };

    // Set whether or not states are assumed to be public or not
    provider.setAssumePublic = function (assumePublic) {
        provider.assumePublic = assumePublic;
    };

    // Add an endpoint to those to exclude
    provider.AddExcludeEndpoint = function (excludeEndpoint) {
        provider.excludeEndpoints.push(excludeEndpoint);
    };

    // Remove an endpoint from those to exclude
    provider.RemoveExcludeEndpoint = function (endpoint) {
        var i = provider.excludeEndpoints.indexOf(endpoint);
        if (i > -1) {
            provider.excludeEndpoints.splice(i, 1);
        }
    };

    // Set all the provider options at once using JSON
    provider.setOptions = function (options) {
        options = angular.extend({
            apiUrl: '',
            assumePublic: true,
            excludeEndpoints: []
        }, options);

        provider.setApiUrl(options.apiUrl);
        provider.setAssumePublic(options.assumePublic);
        angular.forEach(options.excludeEndpoints, function (endpoint) {
            provider.AddExcludeEndpoint(endpoint);
        });
    };

    // Factory 
    provider.$get = function ($http, $q, $rootScope, localizedNotifications, $state, localStorageService) {
        // Properties
        var _status = {
            isRegistered: false
        };

        // Methods
        // Initialization
        var _init = function () {

        };

        // Register user
        var _register = function (registerData) {
            var data = registerData;

            var deferred = $q.defer();

            $http.post(provider.apiUrl, data, { headers: { 'Content-Type': 'application/json' } })
                .success(function (response) {
                    _status.isRegistered = true;
                    _updateStorage();
                    deferred.resolve(response);
                })
            .error(function (err, status) {
                deferred.reject(err);
            });

            return deferred.promise;
        };

        // Service API
        var service =
        {
            register: _register,
            apiUrl: provider.apiUrl,
            init: _init,
            excludeEndpoints: provider.excludeEndpoints
        };
        return service;
    };

});