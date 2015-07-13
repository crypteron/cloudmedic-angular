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
        reg.register($scope.registerData)
        .then(function (response) {
            // After registration, send them to login page
            $state.go('register');
        },
        function (err) {
            $scope.registerData.isSubmitting = false; // re-enable submit button
        });
    };
}
);