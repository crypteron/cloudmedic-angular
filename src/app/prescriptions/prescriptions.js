angular.module('cloudmedic.prescriptions', [
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
.controller('PreAddCtrl', function ($scope, $state, $modalInstance, Prescriptions, Users, localizedNotifications, MedId, MedName, MONTHS) {
    $scope.prescriptionsData = {
        MedicationId: MedId,
        MedicationName: MedName,
        Frequency: "",
        Dosage: "",
        Notes: "",
        Duration: 0,
        Units: 1,
        PatientId: "",
        PatientName:"",
        isSubmitting: false
    };

    // Default date placeholders
    var today = new Date();
    $scope.SelectedMonth = today.getMonth() + 1;
    $scope.SelectedDay = today.getDate();
    $scope.SelectedYear = today.getFullYear();

    // creates a function to add the duration
    Date.prototype.addDays = function (days) {
        var dat = new Date(this.valueOf());
        dat.setDate(dat.getDate() + days);
        return dat;
    };

    $scope.search = function () {
        $scope.Candidates = Users.search({ Name: $scope.prescriptionsData.PatientName });
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
        $scope.Creator.StartDate = new Date($scope.SelectedYear + '-' + pad($scope.SelectedMonth, 2) + '-' + pad($scope.SelectedDay, 2));
        $scope.Creator.EndDate = $scope.Creator.StartDate.addDays($scope.prescriptionsData.Duration * $scope.prescriptionsData.Units);
        $scope.Creator.$create().then(function () {
            localizedNotifications.addForNext('create.success', 'success', { entityType: 'Prescription' });
            $modalInstance.close();
        }, function () {
            $scope.prescriptionsData.isSubmitting = false;
        });
    };

    // Date dropdown menu value generator
    var CurrentYear = new Date().getFullYear();
    $scope.CurrentYear = CurrentYear;
    var years = $.map($(Array(10)), function (val, i) { return i + CurrentYear; });
    var days = $.map($(Array(31)), function (val, i) { return i + 1; });
    var isLeapYear = function () {
        var year = $scope.SelectedYear || 0;
        return ((year % 400 === 0 || year % 100 !== 0) && (year % 4 === 0)) ? 1 : 0;
    };
    var getNumberOfDaysInMonth = function () {
        var selectedMonth = $scope.SelectedMonth || 0;
        return 31 - ((selectedMonth === 2) ? (3 - isLeapYear()) : ((selectedMonth - 1) % 7 % 2));
    };

    $scope.UpdateNumberOfDays = function () {
        $scope.NumberOfDays = getNumberOfDaysInMonth();
    };
    $scope.NumberOfDays = 31;
    $scope.Years = years;
    $scope.Days = days;
    $scope.Months = MONTHS;
    $scope.Periods = $.map($(Array(100)), function (val, i) { return i + 1; });
    $scope.Units = [
        Days = 1,
        Weeks = 7,
        Months = 31
    ];
})
.controller('UpdatePrescriptionsCtrl', function ($scope, $state, $modalInstance, Prescriptions, prescription, MONTHS, localizedNotifications) {
    $scope.prescription = angular.copy(prescription);
    $scope.original = angular.copy($scope.prescription);
    $scope.data = {
        isSubmitting: false
    };
    var origDate = new Date($scope.prescription.EndDate);
    $scope.SelectedMonth = origDate.getMonth() + 1;
    $scope.SelectedDay = origDate.getDate();
    $scope.SelectedYear = origDate.getFullYear();

    $scope.Updater = new Prescriptions();

    $scope.updatePrescription = function () {
        localizedNotifications.removeForCurrent();
        $scope.Updater.PrescriptionId = $scope.prescription.PrescriptionId;
        $scope.Updater.Notes = $scope.prescription.Notes;
        $scope.Updater.EndDate = new Date($scope.SelectedYear + '-' + pad($scope.SelectedMonth, 2) + '-' + pad($scope.SelectedDay + 1, 2));
        $scope.Updater.$update().then(function () {
            localizedNotifications.addForNext('update.success', 'success', { entityType: 'Prescription' });
            $modalInstance.close();
        }, function () {
            $scope.data.isSubmitting = false;
        });
    };
    $scope.resetPrescription = function () {
        $scope.prescription.Notes = $scope.original.Notes;
        $scope.SelectedMonth = origDate.getMonth() + 1;
        $scope.SelectedDay = origDate.getDate();
        $scope.SelectedYear = origDate.getFullYear();
        $scope.form.$setPristine();
    };

    // Date dropdown menu value generator
    var CurrentYear = new Date().getFullYear();
    $scope.CurrentYear = CurrentYear;
    var years = $.map($(Array(10)), function (val, i) { return i + CurrentYear; });
    var days = $.map($(Array(31)), function (val, i) { return i + 1; });
    var isLeapYear = function () {
        var year = $scope.SelectedYear || 0;
        return ((year % 400 === 0 || year % 100 !== 0) && (year % 4 === 0)) ? 1 : 0;
    };
    var getNumberOfDaysInMonth = function () {
        var selectedMonth = $scope.SelectedMonth || 0;
        return 31 - ((selectedMonth === 2) ? (3 - isLeapYear()) : ((selectedMonth - 1) % 7 % 2));
    };

    $scope.UpdateNumberOfDays = function () {
        $scope.NumberOfDays = getNumberOfDaysInMonth();
    };
    $scope.NumberOfDays = 31;
    $scope.Years = years;
    $scope.Days = days;
    $scope.Months = MONTHS;
});
// adds leading zeroes
function pad(num, size) {
    var s = "00" + num;
    return s.substr(s.length - size);
}
