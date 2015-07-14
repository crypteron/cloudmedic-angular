angular.module('crypteron.admin', [
    'ui.router',
    'chart.js',
    'crypteron.resources'
])
.config(['$stateProvider', function config($stateProvider) {
    $stateProvider.state('admin', {
        url: '/admin',
        views: {
            "main": {
                controller: 'AdminCtrl',
                templateUrl: 'admin/admin.tpl.html'
            }
        },
        resolve: {
            security: ['$q', 'auth', function($q, auth) {
                if(!auth.status.token) {
                    return $q.reject("Not Authorized");
                }
            }],
            users: ['Users', function (Users) {
                return Users.query().$promise;
            }]
        },
        data: { pageTitle: 'Admin' }
    });
}])
.controller('AdminCtrl', ['$scope', '$state', 'users', 'localizedNotifications', '$modal', 'DROPDOWN_PLANS',
    function ($scope, $state, users, reports, localizedNotifications, $modal, DROPDOWN_PLANS) {
    $scope.users = users;

    $scope.removeUser = function (user) {
        localizedNotifications.removeForCurrent();
        $modal.open({
            templateUrl: "app.confirm.tpl.html",
            controller: ['$scope', function ($scope) {
                $scope.confirmText = "You will not be able to recover this User!";
                $scope.confirmButton = "Yes, delete User!";
            }]
        }).result.then(function () {
            user.$remove().then(function () {
                localizedNotifications.addForNext('delete.success', 'success', { entityType: 'User' });
                $state.go("admin", null, { reload: true });
            }, function () {
                $scope.data.isSubmitting = false;
            });
        });
    };

    //$scope.signupsPastWeek = reports.SignupsPastWeek;

    //$scope.productTierLabels = [];
    //$scope.productTierData = [];
    //angular.forEach(reports.ProductsByTier, function (productTier) {
    //    $scope.productTierLabels.push(productTier.Label);
    //    $scope.productTierData.push(productTier.Value);
    //});

    //$scope.channelsLabels = [];
    //$scope.channelsData = [];
    //angular.forEach(reports.UsersByChannel, function (userChannel) {
    //    $scope.channelsLabels.push(userChannel.Label);
    //    $scope.channelsData.push(userChannel.Value);
    //});
}]);