﻿angular.module('cloudmedic.prescriptions', [
    'ui.router',
    'ui.bootstrap',
    'ui.bootstrap.position',
    'chart.js',
    'cloudmedic.resources',
    'cloudmedic.dropdown.values'
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
                if (!auth.status.token || !auth.status.token.userRole.contains('Physician') && !auth.status.token.userRole.contains('Nurse')) {
                    return $q.reject("Not Authorized");
                }
            },
            prescriptions: function (Prescriptions, $q, auth) {
                if (auth.status.token.userRole.contains('Physician') || auth.status.token.userRole.contains('Nurse')) {
                    return Prescriptions.query({ providerId: auth.status.token.userId }).$promise;
                }
            }
        },
        data: { pageTitle: 'Prescriptions' }
    });
})
.controller('PrescriptionsCtrl', function ($scope, $state, prescriptions, Prescriptions, localizedNotifications, $modal) {
    // Initialize scope variables
    $scope.prescriptions = prescriptions;
    $scope.orderByField = 'MedicationCode';
    $scope.reverseSort = false;
    $scope.prescriptionsRemover = new Prescriptions();

    // Split the prescriptions into active and expired
    var today = new Date();
    $scope.expiredPrescriptions = [];
    $scope.activePrescriptions = [];
    for (var i = 0; i < $scope.prescriptions.length; i++) {
        if (Date.parse($scope.prescriptions[i].EndDate) < today) {
            $scope.expiredPrescriptions.push($scope.prescriptions[i]);
        }
        else {
            $scope.activePrescriptions.push($scope.prescriptions[i]);
        }
    }

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

    $scope.updatePrescription = function (Prescription) {
        $modal.open({
            templateUrl: "prescriptions/prescriptions.update.tpl.html",
            controller: 'UpdatePrescriptionsCtrl',
            resolve: {
                prescription: function () {
                    return Prescription;
                }
            }
        }).result.then(function () {
            $state.go("prescriptions", null, { reload: true });
        });
    };
})

.controller('PreAddCtrl', function ($scope, $modalInstance, $filter, auth, Prescriptions, Users, Candidates,localizedNotifications, MedId, MedName, MONTHS) {
    $scope.prescriptionsData = {
        MedicationId: MedId,
        MedicationName: MedName,
        Frequency: "",
        Dosage: "",
        Notes: "",
        Duration: 0,
        Units: 1,
        PatientId: "",
        PatientName: "",
        isSubmitting: false
    };
    $scope.Candidates = angular.copy(Candidates);
    $scope.Creator = new Prescriptions();
    $scope.AITab = true;
    $scope.JQTab = false;
    $scope.RZTab = false;

    // Default date placeholders
    var today = new Date();
    $scope.dt = today.getFullYear() + '-' + (pad((today.getMonth() + 1), 2)) + '-' + today.getDate();

    // Add a number of days to a given date
    Date.prototype.addDays = function (days) {
        var date = new Date(this.valueOf());
        date.setDate(date.getDate() + days);
        return date;
    };

    // Sort the patients into 3 tabs for simplified viewing
    $scope.sort = function () {
        $scope.CandidatesAI = [];
        $scope.CandidatesJQ = [];
        $scope.CandidatesRZ = [];
        for (var i = 0; i < $scope.Candidates.length; i++) {
            if ($scope.Candidates[i].LastName.charCodeAt(0) <= 73) {
                $scope.CandidatesAI.push($scope.Candidates[i]);
            } else if ($scope.Candidates[i].LastName.charCodeAt(0) <= 80) {
                $scope.CandidatesJQ.push($scope.Candidates[i]);
            } else {
                $scope.CandidatesRZ.push($scope.Candidates[i]);
            }
        }
    };
    $scope.filter = function () {
        $scope.Candidates=angular.copy(Candidates);
        for (var i = 0; i < $scope.Candidates.length;i++){
            var name = $scope.Candidates[i].FirstName + " " + $scope.Candidates[i].LastName;
            name = name.toLowerCase();
            var patientname = "";
            if ($scope.prescriptionsData.PatientName != null) {
                patientname = $scope.prescriptionsData.PatientName.toLowerCase();
            }
            if (name.indexOf(patientname) == -1) {
                $scope.Candidates.splice(i, 1);
            }
        }
        $scope.sort();
    };
    $scope.Creator = new Prescriptions();
    // Prescription creation method
    $scope.create = function () {
        localizedNotifications.removeForCurrent();
        $scope.prescriptionsData.isSubmitting = true;

        $scope.Creator.MedicationId = $scope.prescriptionsData.MedicationId;
        $scope.Creator.PatientId = $scope.prescriptionsData.PatientId[0];
        $scope.Creator.Frequency = $scope.prescriptionsData.Frequency;
        $scope.Creator.Dosage = $scope.prescriptionsData.Dosage;
        $scope.Creator.Notes = $scope.prescriptionsData.Notes;
        $scope.Creator.StartDate = new Date($scope.dt);
        $scope.Creator.EndDate = $scope.Creator.StartDate.addDays($scope.prescriptionsData.Duration * $scope.prescriptionsData.Units);
        console.log($scope.prescriptionsData.Duration + '*' + $scope.prescriptionsData.Units);
        console.log($scope.Creator.StartDate + ', ' + $scope.Creator.EndDate, (new Date($scope.Creator.StartDate)));

        $scope.Creator.$create().then(function () {
            localizedNotifications.addForNext('create.success', 'success', { entityType: 'Prescription' });
            $modalInstance.close();
        }, function () {
            $scope.prescriptionsData.isSubmitting = false;
        });
    };

    $scope.Periods = $.map($(Array(100)), function (val, i) { return i + 1; });
    $scope.Units = [
        Days = 1,
        Weeks = 7,
        Months = 31
    ];

    // Date Picker    
    $scope.open = function ($event) {
        $event.preventDefault();
        $event.stopPropagation();

        $scope.opened = true;
    };

    $scope.format = 'yyyy-MM-dd';

    $scope.dateOptions = {
        'showWeeks': false
    };


})

.controller('UpdatePrescriptionsCtrl', function ($scope, $modalInstance, $filter, Prescriptions, prescription, MONTHS, localizedNotifications) {
    // initialize scope variables
    $scope.prescription = angular.copy(prescription);
    $scope.original = angular.copy($scope.prescription);
    $scope.data = {
        isSubmitting: false
    };
    $scope.Updater = new Prescriptions();

    $scope.updatePrescription = function () {
        localizedNotifications.removeForCurrent();
        $scope.Updater.PrescriptionId = $scope.prescription.PrescriptionId;
        $scope.Updater.Notes = $scope.prescription.Notes;
        $scope.Updater.EndDate = document.getElementById('prescription-date').value.toString();
        $scope.Updater.$update().then(function () {
            localizedNotifications.addForNext('update.success', 'success', { entityType: 'Prescription' });
            $modalInstance.close();
        }, function () {
            $scope.data.isSubmitting = false;
        });
    };

    $scope.resetPrescription = function () {
        $scope.dt = $filter('date')(Date($scope.prescription.EndDate), 'yyyy-MM-dd');
        $scope.form.$setPristine();
    };

    $scope.dt = $scope.prescription.EndDate;
    // Date Picker    
    $scope.open = function ($event) {
        $event.preventDefault();
        $event.stopPropagation();

        $scope.opened = true;
    };

    $scope.format = 'yyyy-MM-dd';

    $scope.dateOptions = {
        'min-date': $scope.minDate,
        'showWeeks': false
    };

    $scope.minDate = $scope.minDate ? null : new Date();

});
// adds leading zeroes
function pad(num, size) {
    var s = "00" + num;
    return s.substr(s.length - size);
}
