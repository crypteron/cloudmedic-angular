angular.module('crypteron.register', [
    'ui.router',
    'reg',
    'localizedNotifications'
]).config(['$stateProvider', function ($stateProvider) {
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
    })
    //.state('register.verify', {
    //    url: '/verify'
    //})
    //.state('register.verify.success', {
    //    url: '/success',
    //    data: {
    //        notification: {
    //            message: 'register.verify.success',
    //            type: 'success'
    //        }
    //    }
    //})
    //.state('register.verify.error', {
    //    url: '/error',
    //    data: {
    //        notification: {
    //            message: 'register.verify.error',
    //            type: 'danger'
    //        }
    //    }
    //})
    ;
}])
.controller('RegisterCtrl', function ($scope, reg, $state, localizedNotifications, userProfile) {

    // Initialize scope variables
    $scope.authError = null;

    $scope.registerData = {
        username: "",
        password: "",
        confirmpassword: "",
        first: "",
        last: "",
        gender: "",
        DOB: "",
        specialty: "",
        isSubmitting: false
    };

    // Register method
    $scope.register = function () {
        $scope.registerData.isSubmitting = true;
        localizedNotifications.removeForCurrent();
        reg.register($scope.registerData)
        .then(function (response) {
            // After registration, send them to login page
            $state.go('login');
        },
        function (err) {
            $scope.registerData.isSubmitting = false; // re-enable submit button
        });
    };
}
);