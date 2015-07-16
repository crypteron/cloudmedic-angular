angular.module('crypteron.profile.password', ['ui.router', 'crypteron.resources', 'ui.bootstrap'])
.config(['$stateProvider', function config($stateProvider) {
    $stateProvider
    .state("profile.changePassword", {
        url: "/changepassword",
        onEnter: ['$modal', function ($modal) {
            $modal.open({
                templateUrl: "profile/profile.password.tpl.html",
                controller: 'ChangePasswordCtrl'
            });
        }]
    });
}])
.controller('ChangePasswordCtrl', ['$scope', 'localizedNotifications', 'Password', '$state', '$stateParams', '$modalInstance',
    function ($scope, localizedNotifications, Password, $state, $stateParams, $modalInstance) {
        $scope.data = {
            isSubmitting: false
        };

        $scope.password = new Password();
        $scope.changePassword = function () {
            localizedNotifications.removeForCurrent();
            $scope.password.$update().then(function () {
                localizedNotifications.addForNext('update.success', 'success', { entityType: 'Password' });
                $modalInstance.close();
            }, function () {
                $scope.data.isSubmitting = false;
            });
        };

        $modalInstance.result.then(function () {
            $state.go("profile", $stateParams);
        }, function () {
            return $state.go("profile", $stateParams);
        });
    }
]);