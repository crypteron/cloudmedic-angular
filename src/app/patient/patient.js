angular.module('cloudmedic.patient', [
    'ui.router',
    'chart.js',
    'cloudmedic.resources',
    'form'
])
.config(function config($stateProvider) {
    $stateProvider.state('patient', {
        url: '/users',
        views: {
            "main": {  
                controller: 'PatientCtrl',
                templateUrl: 'patient/patient.tpl.html'
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
        data: { pageTitle: 'Patient' }
    });
})
.controller('PatientCtrl', function ($scope, $state, prescriptions, localizedNotifications) {
    $scope.prescriptions = prescriptions;
    $scope.orderByField = 'MedicationName';
    $scope.reverseSort = false;
});