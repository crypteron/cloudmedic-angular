angular.module('cloudmedic.profile.update', [
    'ui.router',
    'cloudmedic.resources',
    'cloudmedic.dropdown.values',
    'form'
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
            profile: function (userProfile) {
                return userProfile.get().$promise;
            }
        }
    });
}])
.controller('ProfileCtrl', function ($scope, $state, profile, localizedNotifications) {
    $scope.data = {
        Email: "",
        FirstName: "",
        LastName: "",
        isSubmitting: false
    };
    $scope.profile = profile;
    $scope.original = angular.copy($scope.profile);

    // Profile update
    $scope.updateProfile = function () {
        localizedNotifications.removeForCurrent();
        $scope.data.isSubmitting = true;
        $scope.profile.$post().then(function () {
            localizedNotifications.addForNext('update.success', 'success', { entityType: 'Profile' });
            $scope.data.isSubmitting = false;
            $scope.form.$setPristine();
            $state.go('user');
        }, function () {
            $scope.data.isSubmitting = false;
        });
    };
    $scope.resetProfile = function () {
        $scope.profile.Email = $scope.original.Email;
        $scope.profile.LastName = $scope.original.LastName;
        $scope.profile.FirstName = $scope.original.FirstName;
        $scope.form.$setPristine();
        $scope.Firstname_Valid = true;
        $scope.Lastname_Valid = true;
    };

    // Name validation
    $scope.Firstname_Valid = true;
    $scope.Lastname_Valid = true;

});