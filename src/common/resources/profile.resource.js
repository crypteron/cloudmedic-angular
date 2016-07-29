angular.module('profile.resource', ['ngResource'])
.provider('Profile', function () {
    var self = this;
    self.apiUrl = '';
    self.setApiUrl = function (apiUrl) {
        self.apiUrl = apiUrl;
    };

    self.$get = ['$resource','$rootScope', function ($resource, $rootScope) {

        var _putInterceptor = {
            response: function (response) {                
                $rootScope.$broadcast('profile:post', response.resource);
                return response;
            }
        };
        $rootScope.$on('authServic:logout', function () {
        });
        
        var Profile = $resource(self.apiUrl + 'account/profile', {}, {
            get: { method: 'GET', isArray: false},
            post: { method: 'POST', isArray: false, interceptor: _putInterceptor }
        });
        
        return Profile;
    }];
});