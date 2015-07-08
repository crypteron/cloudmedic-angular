angular.module('profile.resource', ['ngResource'])
.provider('Profile', function () {
    var provider = this;
    provider.apiUrl = '';
    provider.setApiUrl = function (apiUrl) {
        provider.apiUrl = apiUrl;
    };

    provider.$get = ['$resource', '$cacheFactory', '$rootScope', function ($resource, $cacheFactory, $rootScope) {
        var _profileCache = $cacheFactory('profileCache');
        var _putInterceptor = {
            response: function (response) {                
                _profileCache.remove(response.config.url);
                _profileCache.put(response.config.url, response.resource);
                $rootScope.$broadcast('profile:updated', response.resource);
                return response;
            }
        };
        
        $rootScope.$on('authService:logout', function () {
            _profileCache.removeAll();
        });
        
        var Profile = $resource(provider.apiUrl + 'account/profile', {}, {
            get: { method: 'GET', isArray: false, cache: _profileCache },
            update: { method: 'PUT', isArray: false, interceptor: _putInterceptor }
        });
        
        return Profile;
    }];
});