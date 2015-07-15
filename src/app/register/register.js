angular.module('crypteron.register', [
    'ui.router',
    'reg'
]).config(function ($stateProvider) {
    $stateProvider.state('register', {
        url: '/register',
        views: {
            "main": {
                controller: 'RegisterCtrl',
                templateUrl: 'register/register.tpl.html'
            }
        },
        data: {
            pageTitle: 'Register',
            hideNav: true,
            bodyClass: 'register',
            public: true
        }
    });
})
.controller('RegisterCtrl', function ($scope, reg, $state, userProfile) {

    // Initialize scope variables
    $scope.registerData = {
        UserName: "",
        Email: "",
        Password: "",
        ConfirmPassword: "",
        FirstName: "",
        LastName: "",
        Gender: "",
        DOB: "",
        Specialty: "",
        isSubmitting: true
    };

    // Register method
    $scope.register = function () {
        $scope.registerData.isSubmitting = true;

        $scope.registerData.DOB = $scope.SelectedYear + '-' + pad($scope.SelectedMonth, 2) + '-' + pad($scope.SelectedDay, 2);
        reg.register($scope.registerData)
        .then(function (response) {
            // After registration, send them to login page
            $state.go('login');
        },
        function (err) {
            $scope.registerData.isSubmitting = false; // re-enable submit button
        });
    };

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

    $scope.Username_Valid = true;

    $scope.check_username = function () {

        if (document.getElementById("register-username").value.length < 3) {
            $scope.Username_Valid = false;
        }
        else{
            $scope.Username_Valid = true;
        }
    };
});

function pad(num, size) {
    var s = "00" + num;
    return s.substr(s.length - size);
}