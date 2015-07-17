angular.module('crypteron.profile.update', [
    'ui.router',
    'crypteron.resources',
    'crypteron.dropdown.values'
])
.config(['$stateProvider', function config($stateProvider) {
    $stateProvider.state('profile', {
        url: '/profile',
        views: {
            "main": {
                controller: 'ProfileCtrl',
                templateUrl: 'profile/profile.update.tpl.html'
            }
        },
        data: {
            pageTitle: 'Profile'
        },
        resolve: {
            profile: ['userProfile', function (userProfile) {                
                return userProfile.get().$promise;
            }]
        }
    });
}])
.controller('ProfileCtrl', 
    function ($scope, localizedNotifications, profile, $state, auth) {            
        
        $scope.profile = angular.copy(profile);
        $scope.data = {
            isSubmitting: false
        };
        $scope.authStatus = auth.status;
        $scope.updateProfile = function () {            
            localizedNotifications.removeForCurrent();
            $scope.data.isSubmitting = true;          
            $scope.profile.$post().then(function () {
                localizedNotifications.addForNext('update.success', 'success', { entityType: 'Profile' });
                $scope.data.isSubmitting = false;
                angular.copy($scope.profile, profile);
                $scope.profileForm.$setPristine();
                $state.go('users');
                
                
            }, function () {
                $scope.data.isSubmitting = false;
            });
            
        };
        
        $scope.resetProfile = function () {
            $scope.profile = angular.copy(profile);
            $scope.profileForm.$setPristine();
        };
    }
);