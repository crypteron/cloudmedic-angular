angular.module('cloudmedic.prescriptions', [
    'ui.router',
    'chart.js',
    'crypteron.resources'
])
.config(function config($stateProvider) {
    $stateProvider.state('prescriptions', {
        url: '/prescriptions',
        views: {
            "main": {
                controller: 'PrescriptionsCtrl',
                templateUrl: 'prescriptions/prescriptions.tpl.html'
            }
        },
        resolve: {
            security: function ($q, auth) {
                if (!auth.status.token || !auth.status.token.userRole.contains('SysAdmin') && !auth.status.token.userRole.contains('Physician') && !auth.status.token.userRole.contains('Nurse')) {
                    return $q.reject("Not Authorized");
                }
            },
            prescriptions: function (Prescriptions) {
                return Prescriptions.query().$promise;
            }
        },
        data: { pageTitle: 'Prescriptions' }
    });
})
.controller('PrescriptionsCtrl', function ($scope, $window, $state, prescriptions, Prescriptions, localizedNotifications, $modal) {   
    $scope.prescriptions = prescriptions;
    $scope.prescriptionsRemover = new Prescriptions();

    $scope.orderByField = 'MedicationCode';
    $scope.reverseSort = false;


    $scope.removePrescription = function (prescription) {
        localizedNotifications.removeForCurrent();
        $modal.open({
            templateUrl: "app.confirm.tpl.html",
            controller: function ($scope) {
                $scope.confirmText = "You will not be able to recover this prescription!";
                $scope.confirmButton = "Yes, delete prescription!";
            }
        }).result.then(function () {
            $scope.prescriptionsRemover.$remove({ id: prescription.PrescriptionId }).then(function () {
                localizedNotifications.addForNext('delete.success', 'success', { entityType: 'Prescription' });
                $state.go("prescriptions", null, { reload: true });
            });
        });
    };
})
.controller('PreAddCtrl', function ($scope, $state, $http,$modalInstance, Prescriptions, Users, localizedNotifications, MedId, MedName) {
    $scope.prescriptionsData = {
        MedicationId: MedId,
        MedicationName: MedName,
        Frequency: "",
        Dosage: "",
        Notes:"",
        isSubmitting: false,
        PatientId: "",
        PatientName:""
    };

    $scope.search = function () {
        $scope.Candidates = Users.search({ Name: $scope.prescriptionsData.PatientName });
    };
    $scope.prescriptionsCreator = new Prescriptions();

    // Prescription creation method
    $scope.create = function () {
        localizedNotifications.removeForCurrent();
        $scope.prescriptionsData.isSubmitting = true;
        $scope.prescriptionsCreator.MedicationId = $scope.prescriptionsData.MedicationId;
        $scope.prescriptionsCreator.PatientId = $scope.prescriptionsData.PatientId[0];
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