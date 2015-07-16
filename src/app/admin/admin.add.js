angular.module('crypteron.admin.add', ['ui.router', 'crypteron.resources', 'ui.bootstrap'])
.config(['$stateProvider', function config($stateProvider) {
    $stateProvider
    .state("admin.addPhysician", {
        url: "/admin/add",
        onEnter: ['$modal', function ($modal) {
            $modal.open({
                templateUrl: "admin/admin.add.tpl.html",
                controller: 'AddCtrl'
            });
        }]
    });
}])
.controller('AddCtrl', function ($scope, localizedNotifications, Password, $state, $stateParams, $modalInstance) {
        $scope.physicianData = {
            UserName: "",
            Email: "",
            FirstName: "",
            LastName: "",
            Gender: "",
            DOB: "",
            Type: "",
            Specialty: "",
            isSubmitting: true
        };

        $scope.password = new Password();

        $scope.changePassword = function () {
            localizedNotifications.removeForCurrent();
            $scope.password.$update().then(function () {
                localizedNotifications.addForNext('update.success', 'success', { entityType: 'Password' });
                $modalInstance.close();
            }, function () {
                $scope.data.isSubmitting = false;
            });
        };

        $modalInstance.result.then(function () {
            $state.go("profile", $stateParams);
        }, function () {
            return $state.go("profile", $stateParams);
        });

    //Stuff from Register


    //Date of Birth dropdown menu value generator
        var numberOfYears = (new Date()).getYear();
        var years = $.map($(Array(numberOfYears)), function (val, i) { return i + 1900; });
        var months = $.map($(Array(12)), function (val, i) { return i + 1; });
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
        $scope.Months = months;

        $scope.Username_Valid_length = true;
        $scope.Username_Valid_symbol = true;

        $scope.check_username_symbol = function () {

            if (document.getElementById("register-username").value.match(/[^0-9a-zA-Z]/) != null) {
                $scope.Username_Valid_symbol = false;
            }
            else {
                $scope.Username_Valid_symbol = true;
            }
        };

        $scope.check_username_length = function () {
            if (document.getElementById("register-username").value.length < 3 || document.getElementById("register-username").value.length > 20) {
                $scope.Username_Valid_length = false;
            }
            else {
                $scope.Username_Valid_length = true;
            }
        };

        $scope.Firstname_Valid = true;
        $scope.Lastname_Valid = true;

        $scope.check_firstName = function () {
            if (document.getElementById("user-first").value.match(/[^a-zA-Z]/) != null) {
                $scope.Firstname_Valid = false;
            }
            else {
                $scope.Firstname_Valid = true;
            }
        };

        $scope.check_lastName = function () {
            if (document.getElementById("user-last").value.match(/[^a-zA-Z]/) != null) {
                $scope.Lastname_Valid = false;
            }
            else {
                $scope.Lastname_Valid = true;
            }
        };
});

function pad(num, size) {
    var s = "00" + num;
    return s.substr(s.length - size);
}