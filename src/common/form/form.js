angular.module('form', [
    'ui.router',
    'ui.mask',
    'cloudmedic.resources',
    'cloudmedic.dropdown.values'
])
.controller('FormCtrl', function ($scope, $filter, Registration, Users, Password, $state, MONTHS, localizedNotifications) {
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
        PatientId: "",
        isSubmitting: false
    };
    $scope.supporter = false;
    $scope.creator = new Users();
    $scope.password = new Password();
    $scope.registration = new Registration();

    // Patient registration
    $scope.register = function () {
        $scope.data.isSubmitting = true;
        $scope.registration.UserName = $scope.data.UserName;
        $scope.registration.Email = $scope.data.Email;
        $scope.registration.Password = $scope.data.Password;
        $scope.registration.ConfirmPassword = $scope.data.ConfirmPassword;
        $scope.registration.FirstName = $scope.data.FirstName;
        $scope.registration.LastName = $scope.data.LastName;
        $scope.registration.Gender = $scope.data.Gender;
        $scope.registration.Specialty = $scope.data.Specialty;
        $scope.registration.DOB = document.getElementById('register-DOB').value.toString();
        $scope.registration.PhoneNumber = '(' + $scope.data.PhoneNumber.substr(0, 3) + ') ' + $scope.data.PhoneNumber.substr(3, 3) + '-' + $scope.data.PhoneNumber.substr(6, 4);
        if ($scope.supporter) {
            $scope.registration.PatientId = $scope.data.PatientId;
            $scope.registration.$supporter().then(function (response) {
                $state.go('login');
            }, function (err) {
                $scope.data.isSubmitting = false; // re-enable submit button
            });
        } else {
            $scope.registration.$register().then(function (response) {
                $state.go('login');
            },
            function (err) {
                $scope.data.isSubmitting = false;
            });
        }
    };

    // Provider creation
    $scope.create = function () {
        localizedNotifications.removeForCurrent();

        $scope.data.isSubmitting = true;
        // Bind scope values to creator resource
        $scope.creator.UserName = $scope.data.UserName;
        $scope.creator.Email = $scope.data.Email;
        $scope.creator.FirstName = $scope.data.FirstName;
        $scope.creator.LastName = $scope.data.LastName;
        $scope.creator.Gender = $scope.data.Gender;
        $scope.creator.Specialty = $scope.data.Specialty;
        $scope.creator.PhoneNumber = '(' + $scope.data.PhoneNumber.substr(0, 3) + ') ' + $scope.data.PhoneNumber.substr(3, 3) + '-' + $scope.data.PhoneNumber.substr(6, 4);
        $scope.creator.Roles = [$scope.data.Role];
        $scope.creator.DOB = $filter('date')($scope.dt, 'M/d/yyyy h:mm:ss a', '+000');

        $scope.creator.$create().then(function (response) {
            localizedNotifications.addForNext('create.success', 'success', { entityType: 'User' });
            $scope.$close();
        }, function (err) {
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

    // Date Picker    
    $scope.open = function ($event) {
        $event.preventDefault();
        $event.stopPropagation();

        $scope.opened = true;
    };

    $scope.format = 'yyyy-MM-dd';

    $scope.dateOptions = {
        showWeeks: false
    };

})
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
})
.filter('reverse', function () {
    return function (items) {
        return items.slice().reverse();
    };
});

function DateToUTC(date) {
    return new Date(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), date.getUTCHours(), date.getUTCMinutes(), date.getUTCSeconds());
}