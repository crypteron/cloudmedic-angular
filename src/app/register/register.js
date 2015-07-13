angular.module('crypteron.register', [
    'ui.router',
    'auth',
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
    .state('register.verify', {
        url: '/verify'
    })
    .state('register.verify.success', {
        url: '/success',
        data: {
            notification: {
                message: 'register.verify.success',
                type: 'success'
            }
        }
    })
    .state('register.verify.error', {
        url: '/error',
        data: {
            notification: {
                message: 'register.verify.error',
                type: 'danger'
            }
        }
    });
}])
.controller('RegisterCtrl', function ($scope, auth, $state, localizedNotifications, userProfile) {

    // If user is already logged in, navigate to apps state
    if (auth.status.isLoggedIn) {
        $state.go('apps.list');
    }

    // Initialize scope variables
    $scope.authError = null;
    $scope.loginData = {
        username: "",
        password: "",
        isSubmitting: false
    };
    $scope.ssoProviders = auth.ssoProviders;

    $scope.notification = $state.current.data.notification;
    if ($scope.notification) {
        localizedNotifications.addForCurrent($scope.notification.message, $scope.notification.type);
    }

    // Login method
    $scope.login = function () {
        $scope.loginData.isSubmitting = true;
        localizedNotifications.removeForCurrent();
        auth.login($scope.loginData)
        .then(function (response) {

            // After login, if user hasn't completed profile, send them to profile page
            var profile = userProfile.get();
            profile.$promise.then(function () {
                if (profile.UserMetaData.CompletedProfile === false) {
                    $state.go('profile');
                } else {
                    // Otherwise redirect them to the Apps state or to whichever state they were attempting to load
                    auth.redirectAfterLogin('apps.list', {});
                }
            });
        },
        function (err) {
            $scope.loginData.isSubmitting = false; // re-enable submit button
        });
    };
}
);