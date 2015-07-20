angular.module('cloudmedic.medications', [
    'ui.router',
    'chart.js',
    'crypteron.resources'
])
.config(['$stateProvider', function config($stateProvider) {
    $stateProvider.state('medications', {
        url: '/medications',
        views: {
            "main": {
                controller: 'MedicationsCtrl',
                templateUrl: 'medications/medication.tpl.html'
            }
        },
        resolve: {
            security: ['$q', 'auth', function($q, auth) {
                if (!auth.status.token || !auth.status.token.userRole.contains('SysAdmin') || !auth.status.token.userRole.contains('Physician') || !auth.status.token.userRole.contains('Nurse')) {
                    return $q.reject("Not Authorized");
                }
            }],
            medications: ['Medications', function (Medications) {
                return Medications.query().$promise;
            }]
        },
        data: { pageTitle: 'Medications' }
    });
}])
.controller('MedicationsCtrl', function ($scope, $state, medications, Medications, localizedNotifications, $modal) {

    $scope.medicationsData = {
        MedicationId: "",
        GenericName: "",
        Code: "",
        isSubmitting: false
    };

    $scope.medications = medications;
    $scope.medicationsRemover = new Medications();
    $scope.medicationsCreator = new Medications();

    $scope.removeMedication = function (medication) {
        localizedNotifications.removeForCurrent();
        $modal.open({
            templateUrl: "app.confirm.tpl.html",
            controller: ['$scope', function ($scope) {
                $scope.confirmText = "You will not be able to recover this medication!";
                $scope.confirmButton = "Yes, delete medication!";
            }]
        }).result.then(function () {
            $scope.medicationRemover.$remove({ medication: medication.Code }).then(function () {
                localizedNotifications.addForNext('delete.success', 'success', { entityType: 'Medication' });
                $state.go("medications", null, { reload: true });
            });
        });
    };

    $scope.createMedication = function () {
        localizedNotifications.removeForCurrent();
        $modal.open({
            templateUrl: "medications/medications.add.html",
            controller: 'MedicationsCtrl'
        }).result.then(function () {
            $state.go("medications", null, { reload: true });
        });
    };

    // Medication creation method
    $scope.create = function () {
        localizedNotifications.removeForCurrent();
        $scope.data.isSubmitting = true;
        // bind scope values to creator object
        $scope.medicationsCreator.GenericName = $scope.medicationsData.GenericName;
        $scope.medicationsCreator.Code = $scope.medicationsData.Code;

        $scope.medicationsCreator.$create().then(function () {
            localizedNotifications.addForNext('create.success', 'success', { entityType: 'Medication' });
            $scope.$close();
        }, function () {
            $scope.data.isSubmitting = false;
        });
    };
});