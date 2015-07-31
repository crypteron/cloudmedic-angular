angular.module('cloudmedic.provider', [
    'ui.router',
    'chart.js',
    'cloudmedic.resources',
    'form'
])
.config(function config($stateProvider) {
    $stateProvider.state('provider', {
        url: '/provider',
        views: {
            "main": {
                controller: 'ProviderCtrl',
                templateUrl: 'provider/provider.tpl.html'
            }
        },
        resolve: {
            security: function ($q, auth) {
                if (!auth.status.token || !auth.status.token.userRole.contains('Physician') && !auth.status.token.userRole.contains('Nurse')) {
                    return $q.reject("Not Authorized");
                }
            },
            careTeams: function (Users, $q, auth) {
                if (auth.status.token.userRole.contains('Physician') || auth.status.token.userRole.contains('Nurse')) {
                    return Users.prTeams({ id: auth.status.token.userId }).$promise;
                }
            }
        },
        data: { pageTitle: 'Provider' }
    });
})
.controller('ProviderCtrl', function ($scope, $state, $modal, careTeams, localizedNotifications) {
    $scope.careTeams = careTeams;
    $scope.orderByField = 'Name';
    $scope.reverseSort = false;
    $scope.medicationHistory = function (patient) {
        $modal.open({
            templateUrl: "provider/history.tpl.html",
            controller: 'MedicationsHistoryCtrl',
            resolve: {
                patient: function () {
                    return patient;
                },
                prescriptions: function (Users) {
                    return Users.meds({ id: patient.UserId }).$promise;
                }
            }
        });
    };
})
.controller('MedicationsHistoryCtrl', function ($scope, $modalInstance, patient, prescriptions, Users) {
    $scope.patient = patient;
    $scope.prescriptions = prescriptions;
});