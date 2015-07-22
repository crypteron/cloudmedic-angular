angular.module('form', [
    'ui.router',
    'reg',
    'crypteron.resources',
    'cloudmedic.dropdown.values'
])
.filter('reverse', function () {
    return function (items) {
        return items.slice().reverse();
    };
})
.controller('FormCtrl', function ($scope, reg, Users, Password, $state, MONTHS, localizedNotifications) {

    // Initialize scope variables
    $scope.data = {
        UserName: "",
        Email: "",
        Password: "",
        ConfirmPassword: "",
        FirstName: "",
        LastName: "",
        Gender: "",
        DOB: "",
        Role: "",
        Specialty: "",
        PhoneNumber: "",
        isSubmitting: false
    };
    $scope.creator = new Users();
    $scope.password = new Password();

    // User registration method
    $scope.register = function () {
        $scope.data.isSubmitting = true;
        $scope.data.DOB = $scope.SelectedYear + '-' + pad($scope.SelectedMonth, 2) + '-' + pad($scope.SelectedDay, 2);
        reg.register($scope.data)
        .then(function (response) {
            // After registration, send them to login page
            $state.go('login');
        },
        function (err) {
            $scope.data.isSubmitting = false; // re-enable submit button
        });
    };

    // User creation method
    $scope.create = function () {
        localizedNotifications.removeForCurrent();
        $scope.data.isSubmitting = true;
        // bind scope values to creator object
        $scope.creator.UserName = $scope.data.UserName;
        $scope.creator.Email = $scope.data.Email;
        $scope.creator.FirstName = $scope.data.FirstName;
        $scope.creator.LastName = $scope.data.LastName;
        $scope.creator.Gender = $scope.data.Gender;
        $scope.creator.Specialty = $scope.data.Specialty;
        $scope.creator.PhoneNumber = $scope.data.PhoneNumber;
        $scope.creator.Roles = [$scope.data.Role];
        $scope.creator.DOB = $scope.SelectedYear + '-' + pad($scope.SelectedMonth, 2) + '-' + pad($scope.SelectedDay, 2);

        $scope.creator.$create().then(function () {
            localizedNotifications.addForNext('create.success', 'success', { entityType: 'User' });
            $scope.$close();
        }, function () {
            $scope.data.isSubmitting = false;
        });
    };

    // Password update
    $scope.changePassword = function () {
        localizedNotifications.removeForCurrent();
        $scope.password.$update().then(function () {
            localizedNotifications.addForNext('update.success', 'success', { entityType: 'Password' });
            $scope.$close();
        }, function () {
            $scope.data.isSubmitting = false;
        });
    };

    // Date of Birth dropdown menu value generator
    var numberOfYears = (new Date()).getYear();
    var years = $.map($(Array(numberOfYears)), function (val, i) { return i + 1900; });
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

    // Username validation
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

    // Password validation
    $scope.Password_Valid = true;
    $scope.Password_Short = false;
    $scope.Password_Digit = true;
    $scope.Password_Upper = true;
    $scope.Password_Lower = true;
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
        if (document.getElementById("user-password").value.match('[a-z]') === null) {
            $scope.Password_Lower = false;
        } else {
            $scope.Password_Lower = true;
        }
        if (document.getElementById("user-password").value.match('[^A-Za-z0-9]') === null) {
            $scope.Password_Special = false;
        } else {
            $scope.Password_Special = true;
        }
        if ($scope.Password_Short || !$scope.Password_Digit || !$scope.Password_Upper || !$scope.Password_Lower || !$scope.Password_Special) {
            $scope.Password_Valid = false;
        } else {
            $scope.Password_Valid = true;
        }
    };

    // Password matching
    $scope.Passwords_Match = true;
    $scope.compare_passwords = function () {
        if (document.getElementById("user-password").value != (document.getElementById("user-confirmpassword").value)) {
            $scope.Passwords_Match = false;
        } else {
            $scope.Passwords_Match = true;
        }
    };

    // Name Validation
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

    //Phone Number Validation
    $scope.PhoneNumber_Valid = true;
    $scope.check_PhoneNumber = function () {
        if (document.getElementById("register-phonenumber").value.match(/^[1-9]\d{2}-\d{3}-\d{4}$/) != null) {
            $scope.PhoneNumber_Valid = true;
        }
        else {
            $scope.PhoneNumber_Valid = false;
        }
    };
})
 // call function on change even if input invalid
.directive('watchChange', function () {
    return {
        scope: {
            onchange: '&watchChange'
        },
        link: function (scope, element, attrs) {
            element.on('input', function () {
                scope.$apply(function () {
                    scope.onchange();
                });
            });
        }
    };
});
// adds leading zeroes
function pad(num, size) {
    var s = "00" + num;
    return s.substr(s.length - size);
}