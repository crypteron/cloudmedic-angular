﻿angular.module('cloudmedic.prescriptions', [
    'ui.router',
    'chart.js',
    'crypteron.resources'
])
.config(['$stateProvider', function config($stateProvider) {
    $stateProvider.state('prescriptions', {
        url: '/prescriptions',
        views: {
            "main": {
                controller: 'PrescriptionsCtrl',
                templateUrl: 'prescriptions/prescriptions.tpl.html'
            }
        },
        resolve: {
            prescriptions: ['Prescriptions', function (Prescriptions) {
                return Prescriptions.query().$promise;
            }]
        },
        data: { pageTitle: 'Prescriptions' }
    });
}])
.controller('PrescriptionsCtrl', function ($scope, $state, prescriptions, Prescriptions, localizedNotifications, $modal) {

    $scope.prescriptions = prescriptions;
    $scope.prescriptionsRemover = new Prescriptions();

    $scope.removePrescription = function (prescription) {
        localizedNotifications.removeForCurrent();
        $modal.open({
            templateUrl: "app.confirm.tpl.html",
            controller: ['$scope', function ($scope) {
                $scope.confirmText = "You will not be able to recover this prescription!";
                $scope.confirmButton = "Yes, delete prescription!";
            }]
        }).result.then(function () {
            $scope.prescriptionsRemover.$remove({ id: prescription.PrescriptionId }).then(function () {
                localizedNotifications.addForNext('delete.success', 'success', { entityType: 'Prescription' });
                $state.go("prescriptions", null, { reload: true });
            });
        });
    };

    $scope.createPrescription = function (Med) {     
        localizedNotifications.removeForCurrent();
        $modal.open({
            templateUrl: "prescriptions/prescriptions.add.tpl.html",
            controller: 'PreAddCtrl'
        }).result.then(function () {
            $state.go("medications", null, { reload: true });
        });
    };
})
.controller('PreAddCtrl', function ($scope, $state, $modalInstance, Prescriptions, localizedNotifications, MedId) {
    $scope.prescriptionsData = {
        MedicationId:MedId,
        Frequency: "",
        Dosage: "",
        Notes:"",
        isSubmitting: false
    };    
    $scope.prescriptionsCreator = new Prescriptions();
    // Prescription creation method
    $scope.create = function () {
        localizedNotifications.removeForCurrent();
        $scope.prescriptionsData.isSubmitting = true;
        // bind scope values to creator object
        $scope.prescriptionsCreator.PrescriptionId = $scope.prescriptionsData.PrescriptionId;
        $scope.prescriptionsCreator.MedicationId = $scope.prescriptionsData.MedicationId;
        $scope.prescriptionsCreator.Frequency = $scope.prescriptionsData.Frequency;
        $scope.prescriptionsCreator.Dosage = $scope.prescriptionsData.Dosage;
        $scope.prescriptionsCreator.Notes = $scope.prescriptionsData.Notes;

        $scope.prescriptionsCreator.$create().then(function () {
            localizedNotifications.addForNext('create.success', 'success', { entityType: 'Prescription' });
            $modalInstance.close();
        }, function () {
            $scope.prescriptionsData.isSubmitting = false;
        });
    };
});