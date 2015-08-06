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
            sTeams: function (Users, $q, auth) {
                if (auth.status.token.userRole.contains('Supporter')) {
                    return Users.sTeams({ id: auth.status.token.userId }).$promise;
                }
            }
        },
        data: { pageTitle: 'Supporter' }
    });
})
.controller('SupporterCtrl', function ($scope, $state, $modal, $filter, sTeams, localizedNotifications) {
    $scope.sTeams = sTeams;

    $scope.orderByField = 'Name';
    $scope.reverseSort = false;

    $scope.medicationHistory = function (patient) {
        $modal.open({
            templateUrl: "supporter/supporter.meds.tpl.html",
            controller: 'HistoryCtrl',
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
.controller('HistoryCtrl', function ($scope, $modalInstance, patient, prescriptions, Users) {
    $scope.patient = patient;
    $scope.prescriptions = prescriptions;
    $scope.today = new Date();

    $scope.orderByField = 'MedicationName';
    $scope.reverseSort = false;

    $scope.isActive = function (prescription) {
        return (Date.parse(prescription.EndDate) >= $scope.today);
    };
});