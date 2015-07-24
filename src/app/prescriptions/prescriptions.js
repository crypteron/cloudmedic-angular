angular.module('cloudmedic.prescriptions', [
    'ui.router',
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
})
.controller('PreAddCtrl', function ($scope, $state, $http, $modalInstance, Prescriptions, Users, localizedNotifications, MedId, MedName, MONTHS) {
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
        $scope.Creator.StartDate = new Date();
        $scope.Creator.EndDate = $scope.SelectedYear + '-' + pad($scope.SelectedMonth, 2) + '-' + pad($scope.SelectedDay, 2);
        $scope.Creator.$create().then(function () {
            localizedNotifications.addForNext('create.success', 'success', { entityType: 'Prescription' });
            $modalInstance.close();
        }, function () {
            $scope.prescriptionsData.isSubmitting = false;
        });
    };

    // Date of Birth dropdown menu value generator
    var CurrrentYear = new Date().getFullYear();
    $scope.CurrrentYear = CurrrentYear;
    var years = $.map($(Array(10)), function (val, i) { return i + CurrrentYear; });
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