angular.module('cloudmedic.supporter', [
    'cloudmedic.supporter.invite',
    'cloudmedic.resources'
])
.config(function config($stateProvider) {
    $stateProvider.state('supporter', {
        url: '/supporter',
        views: {
            "main": {
                controller: 'SupporterCtrl',
                templateUrl: 'supporter/supporter.tpl.html'
            }
        },
        resolve: {
            security: function ($q, auth) {
                if (!auth.status.token || !auth.status.token.userRole.contains('Supporter')) {
                    return $q.reject("Not Authorized");
                }
            },
            prescriptions: function (Users, auth) {
                return Users.meds({ id: auth.status.token.userId }).$promise;
            }
        },
        data: { pageTitle: 'Supporter' }
    });
})
.controller('SupporterCtrl', function ($scope, $state, prescriptions, localizedNotifications) {
    $scope.prescriptions = prescriptions;
    $scope.orderByField = 'MedicationName';
    $scope.reverseSort = false;
});