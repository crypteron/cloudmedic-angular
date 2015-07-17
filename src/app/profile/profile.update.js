angular.module('crypteron.profile.update', [
    'ui.router',
    'crypteron.resources',
    'cloudmedic.dropdown.values'
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
    function ($scope, localizedNotifications, profile, DROPDOWN_COMPANY_SIZES, DROPDOWN_INDUSTRY_VERTICALS, $state, auth) {            
        $scope.companySizes = DROPDOWN_COMPANY_SIZES;
        $scope.industryVerticals = DROPDOWN_INDUSTRY_VERTICALS;
        $scope.profile = angular.copy(profile);
        $scope.data = {
            isSubmitting: false
        };
        $scope.authStatus = auth.status;

        var newProfile = false;        
        if ($scope.profile.UserMetaData.CompletedProfile === false) {
            localizedNotifications.addForCurrent('profile.required', 'info', {}, { disableClose: true });            
            newProfile = true;
        }

        $scope.updateProfile = function () {            
            localizedNotifications.removeForCurrent();
            if ($scope.profile.IndustryVertical === 0) {
                localizedNotifications.addForCurrent('field.required', 'danger', { field: 'Industry' });
                return;
            }
            if ($scope.profile.CompanySize === 0) {
                localizedNotifications.addForCurrent('field.required', 'danger', { field: 'Company Size' });
                return;
            }
            $scope.data.isSubmitting = true;
            
            $scope.profile.$update().then(function () {
                localizedNotifications.addForNext('update.success', 'success', { entityType: 'Profile' });
                $scope.data.isSubmitting = false;
                angular.copy($scope.profile, profile);
                $scope.profileForm.$setPristine();
                $state.go('apps.list');
                
                
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