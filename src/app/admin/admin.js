angular.module('crypteron.admin', [
    'ui.router',
    'chart.js',
    'form',
    'crypteron.resources'
])
.config(function config($stateProvider) {
    $stateProvider.state('admin', {
        url: '/admin',
        views: {
            "main": {
                controller: 'AdminCtrl',
                templateUrl: 'admin/admin.tpl.html'
            }
        },
        resolve: {
            security: function ($q, auth) {
                if (!auth.status.token || !auth.status.token.userRole.contains('SysAdmin')) {
                    return $q.reject("Not Authorized");
                }
            },
            users: function (Users) {
                return Users.query().$promise;
            }//,
            //reports: ['$http', 'APP_CONFIG', function ($http, APP_CONFIG) {
            //    return $http.get(APP_CONFIG.api_url + 'admin/users/reports').then(function (response) {
            //        return response.data;
            //    });
            //}]
        },
        data: { pageTitle: 'Admin' }
    });
})
.controller('AdminCtrl', function ($scope, $state, users, Users, /*reports,*/ localizedNotifications, $modal, DROPDOWN_PLANS) {
    $scope.users = users;
    $scope.userRemover = new Users();

    $scope.removeUser = function (user) {
        localizedNotifications.removeForCurrent();
        $modal.open({
            templateUrl: "app.confirm.tpl.html",
            controller: function ($scope) {
                $scope.confirmText = "You will not be able to recover this User!";
                $scope.confirmButton = "Yes, delete User!";
            }
        }).result.then(function () {
            $scope.userRemover.$remove({ id: user.UserId }).then(function () {
                localizedNotifications.addForNext('delete.success', 'success', { entityType: 'User' });
                $state.go("admin", null, { reload: true });
            });
        });
    };

    $scope.createUser = function () {
        localizedNotifications.removeForCurrent();
        $modal.open({
            templateUrl: "app.add.tpl.html",
            controller: 'FormCtrl'
        }).result.then(function () {
            $state.go("admin", null, { reload: true });
        });
    };

    $scope.PatientorderByField = 'LastName';
    $scope.PatientreverseSort = false;

    $scope.orderByField = 'LastName';
    $scope.reverseSort = false;

    $scope.PhysicianOrNurse = function (user) {
        return user.Roles == 'Nurse' || user.Roles == 'Physician';
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
});