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

    $scope.Password_Valid = true;
    $scope.Password_Short = false;
    $scope.Password_Digit = true;
    $scope.Password_Upper = true;
    $scope.Password_Special = true;

    $scope.check_password = function () {
        if (document.getElementById("user-password").value.length < 6) {
            $scope.Password_Short = true;
        } else {
            $scope.Password_Short = false;
        }
        if (document.getElementById("user-password").value.match('[0-9]') === null) {
            $scope.Password_Digit = false;
        } else {
            $scope.Password_Digit = true;
        }
        if (document.getElementById("user-password").value.match('[A-Z]') === null) {
            $scope.Password_Upper = false;
        } else {
            $scope.Password_Upper = true;
        }
        if (document.getElementById("user-password").value.match('[^A-Za-z0-9]') === null) {
            $scope.Password_Special = false;
        } else {
            $scope.Password_Special = true;
        }
        if ($scope.Password_Short || !$scope.Password_Digit || !$scope.Password_Upper || !$scope.Password_Special) {
            $scope.Password_Valid = false;
        } else {
            $scope.Password_Valid = true;
        }
    };

    $scope.Passwords_Match = true;
    $scope.compare_passwords = function () {
        if (document.getElementById("user-password").value != (document.getElementById("user-confirmpassword").value)) {
            $scope.Passwords_Match = false;
        } else {
            $scope.Passwords_Match = true;
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