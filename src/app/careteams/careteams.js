angular.module('cloudmedic.careteams', [
    'ui.router',
    'chart.js',
    'cloudmedic.resources',
    'form'
])
.config(['$stateProvider', function config($stateProvider) {
    $stateProvider.state('careteams', {
        url: '/careteams',
        views: {
            "main": {
                controller: 'CareTeamsCtrl',
                templateUrl: 'careteams/careteams.tpl.html'
            }
        },
        resolve: {
            security: ['$q', 'auth', function($q, auth) {
                if (!auth.status.token || (!auth.status.token.userRole.contains('SysAdmin') && !auth.status.token.userRole.contains('Physician') && !auth.status.token.userRole.contains('Nurse'))) {
                    return $q.reject("Not Authorized");
                }
            }],
            careteams: ['CareTeams', function (CareTeams) {
                //return CareTeams.query().$promise;
            }]
        },
        data: { pageTitle: 'CareTeams' }
    });
}])
.controller('CareTeamsCtrl', function ($scope, $state, careteams, CareTeams, localizedNotifications, $modal) {

    //$scope.medications = medications;
    //$scope.medicationsRemover = new Medications();
    //$scope.orderByField = 'GenericName';
    //$scope.reverseSort = false;
    //$scope.removeMedication = function (medication) {
    //    localizedNotifications.removeForCurrent();
     //   $modal.open({
       //     templateUrl: "app.confirm.tpl.html",
         //   controller: ['$scope', function ($scope) {
           //     $scope.confirmText = "You will not be able to recover this medication!";
             //   $scope.confirmButton = "Yes, delete medication!";
           // }]
        //}).result.then(function () {
          //  $scope.medicationsRemover.$remove({ id: medication.MedicationId }).then(function () {
            //    localizedNotifications.addForNext('delete.success', 'success', { entityType: 'Medication' });
              //  $state.go("medications", null, { reload: true });
            //});
        //});
    //};

    /*$scope.createMedication = function () {
        localizedNotifications.removeForCurrent();
        $modal.open({
            templateUrl: "medications/medications.add.tpl.html",
            controller: 'MedAddCtrl'
        }).result.then(function () {
            $state.go("medications", null, { reload: true });
        });
    };
    $scope.createPrescription = function (medication) {
        $scope.medication = medication;
        localizedNotifications.removeForCurrent();
        $modal.open({
            templateUrl: "prescriptions/prescriptions.add.tpl.html",
            controller: 'PreAddCtrl',
            resolve: {
                MedId: function () { return $scope.medication.MedicationId; },
                MedName: function () { return $scope.medication.GenericName; }
            }
        }).result.then(function () {
            $state.go("medications", null, { reload: true });
        });
    };*/
})
.controller('CareTeamAddCtrl', function ($scope, $state, $modalInstance, Medications, localizedNotifications) {
   /* $scope.medicationsData = {
        MedicationId: "",
        GenericName: "",
        Code: "",
        isSubmitting: false
    };
    $scope.medicationsCreator = new Medications();
    */
    // Medication creation method
    $scope.create = function () {
        localizedNotifications.removeForCurrent();
        $scope.medicationsData.isSubmitting = true;
        // bind scope values to creator object
        $scope.medicationsCreator.GenericName = $scope.medicationsData.GenericName;
        $scope.medicationsCreator.Code = $scope.medicationsData.Code;

        $scope.medicationsCreator.$create().then(function () {
            localizedNotifications.addForNext('create.success', 'success', { entityType: 'Medication' });
            $modalInstance.close();
        }, function () {
            $scope.medicationsData.isSubmitting = false;
        });
    };

    $scope.Code_Valid = true;

    $scope.check_Code = function () {

        if (document.getElementById("medication-code").value.match(/\D{1,5}/) != null) {
            $scope.Code_Valid = false;
            $scope.medicationsData.isSubmitting = true;
        }
        else {
            $scope.Code_Valid = true;
            $scope.medicationsData.isSubmitting = false;
        }
    };

    $scope.GenericName_Valid = true;

    $scope.check_GenericName = function () {
        if (document.getElementById("medication-genericname").value.match(/[^a-zA-Z]{1,}/) != null) {
            $scope.GenericName_Valid = false;
            $scope.medicationsData.isSubmitting = true;
        }
        else {
            $scope.GenericName_Valid = true;
            $scope.medicationsData.isSubmitting = false;
        }
    };
});