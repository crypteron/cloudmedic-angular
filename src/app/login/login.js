angular.module('crypteron.login', [
    'crypteron.login.forgot',
    'crypteron.login.resetPassword',
    'crypteron.login.resendVerify',
    'ui.router',
    'auth',
    'localizedNotifications'
]).config(['$stateProvider', function ($stateProvider) {
    $stateProvider.state('login', {
        url: '/login',
        views: {
            "main": {
                controller: 'LoginCtrl',
                templateUrl: 'login/login.tpl.html'
            }
        },
        data: {
            pageTitle: 'Login',
            hideNav: true,
            bodyClass: 'login',
            public: true
        }
    })
    .state('login.verify', {
        url: '/verify'
    })
    .state('login.verify.success', {
        url: '/success',
        data: {
            notification: {
                message: 'login.verify.success',
                type: 'success'
            }
        }
    })
    .state('login.verify.error', {
        url: '/error',
        data: {
            notification: {
                message: 'login.verify.error',
                type: 'danger'
            }
        }
    });
}])
.controller('LoginCtrl', function ($scope, auth, $state, localizedNotifications, userProfile) {
    
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
                } else                    
                {   
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