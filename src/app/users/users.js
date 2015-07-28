angular.module('cloudmedic.user', [
    'ui.router',
    'chart.js',
    'cloudmedic.resources',
    'form'
])
.config(function config($stateProvider) {
    $stateProvider.state('user', {
        url: '/user',
        views: {
            "main": {
                controller: 'UserCtrl',
                templateUrl: 'users/users.tpl.html'
            }
        },
        resolve: {
            security: function ($q, auth) {
                if (!auth.status.token || !auth.status.token.userRole.contains('Patient')) {
                    return $q.reject("Not Authorized");
                }
            },
            prescriptions: function (Users, auth) {
                return Users.meds({ id: auth.status.token.userId }).$promise;
            }
        },
        data: { pageTitle: 'User' }
    });
})
.controller('UserCtrl', function ($scope, $state, prescriptions, localizedNotifications) {
    $scope.prescriptions = prescriptions;
    $scope.orderByField = 'MedicationName';
    $scope.reverseSort = false;
});