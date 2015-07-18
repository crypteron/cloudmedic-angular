angular.module('crypteron.profile.update', [
    'ui.router',
    'crypteron.resources',
    'cloudmedic.dropdown.values',
    'form'
])
.config(['$stateProvider', function config($stateProvider) {
    $stateProvider.state('profile', {
        url: '/profile',
        views: {
            "main": {
                controller: 'FormCtrl',
                templateUrl: 'profile/profile.update.tpl.html'
            }
        },
        data: {
            pageTitle: 'Profile'
        },
        resolve: {
            profile: function (Profile) {
                return Profile.get().$promise;
            }
        }
    });
}]);