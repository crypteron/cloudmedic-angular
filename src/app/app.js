angular.module('crypteron', [  
  'templates-app',
  'templates-common',
  'crypteron.apps',  
  'crypteron.keys',
  'crypteron.acl',
  'crypteron.profile',  
  'crypteron.login',
  'crypteron.register',
  'crypteron.sso',
  'crypteron.config',
  'crypteron.messages',
  'crypteron.resources',    
  'crypteron.admin',
  'crypteron.users',
  'cloudmedic.medications',
  'cloudmedic.prescriptions',
  'ui.router',
  'ui.mask',
  'auth',
  'form',
  'localizedMessages',
  'localizedNotifications',
  'angular-loading-bar',
  'errorHandler',  
  'userProfile'
])
.config(function ($urlRouterProvider, authProvider, regProvider, APP_CONFIG, localizedMessagesProvider, CRY_MESSAGES) {
        // Configure the localized messages provider with the messages 
        localizedMessagesProvider.setMessages(CRY_MESSAGES);

        // Configure the authentication provider
        authProvider.setOptions({
            apiUrl: APP_CONFIG.api_url,
            loginState: 'login',
            assumePublic: false,
            tokenPath: 'token',
            // These are regular expressions to match
            excludeEndpoints: [
                'account/forgotUsername$',
                'account/forgotPassword$',
                'account/resetPassword$',
                'account/resendVerify$',
                // The registration request
                'Register$',
                // The entire demo route
                'demo/.*$'
            ]
        });

        // Configure the registration provider
        regProvider.setOptions({
            apiUrl: APP_CONFIG.api_url,
            registerPath: 'Account/Register',
            assumePublic: false
        });

        // Enable to 'contains' method for all browsers
        if (!('contains' in String.prototype)) {
            String.prototype.contains = function (str, startIndex) {
                return -1 !== String.prototype.indexOf.call(this, str, startIndex);
            };
        }

        // Set default URL
        $urlRouterProvider.otherwise('/login');
    }
)
.run(['editableOptions', function (editableOptions) {
    editableOptions.theme = 'bs3'; // set xeditable theme to Bootstrap 3
}])
.controller('AppCtrl', function ($scope, localizedNotifications, $state, $rootScope, auth, APP_CONFIG, $window, userProfile) {
        $rootScope.base_uri = APP_CONFIG.base_uri;
        $scope.environment = APP_CONFIG.environment;
        if ($window.hasOwnProperty('Stripe')) {
            $window.Stripe.setPublishableKey(APP_CONFIG.stripe_key);
        }
        auth.init();
        $scope.hideNav = false;
        $rootScope.previous = 'login';
        $rootScope.previousParams = {};

        //// Prevent migrating to any state other than Profile if not yet completed profile        
        //var removeProfileListener = $rootScope.$on("$stateChangeStart", function (event, toState, toParams, fromState, fromParams) {
        //    if (auth.status.isLoggedIn && toState.name != 'profile' && toState.data.public !== true) {
        //        // Fetch the profile singleton from the userProfile service
        //        var profile = userProfile.get();

        //        // Ensure the profile has already been fetched by using it's promise
        //        profile.$promise.then(function () {
        //            // see if the user has complete his/her profile
        //            if (profile.UserMetaData.CompletedProfile === false) {            
        //                event.preventDefault();
        //                // show a custom error for those trying to navigate away from the Update profile page so they don't think that nothing is happening
        //                if (fromState.name == 'profile') {
        //                    localizedNotifications.removeAll();
        //                    localizedNotifications.addForCurrent('profile.required.force', 'warning', { pageTitle: toState.data.pageTitle });
        //                }
        //                $state.go('profile');
        //            } else {
        //                // Remove profile listener whenever CompletedProfile has been found to be true
        //                removeProfileListener();
        //            }
        //        });
        //    }
        //});

        $rootScope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState, fromParams) {
            // Update page title when state changes
            if (angular.isDefined(toState.data.pageTitle)) {
                $scope.pageTitle = toState.data.pageTitle + ' | CloudMedic Dashboard';
            }

            $scope.bodyClass = toState.data.bodyClass;

            // Allow controllers to hide nav bar via state data
            $scope.hideNav = toState.data.hideNav;

            // Store previous state
            $rootScope.previousState = fromState.name;
            $rootScope.previousParams = fromParams;
        });
    }
)
.controller('NavbarCtrl', 
    function ($scope, auth, $state, localizedNotifications, userProfile) {
        $scope.authStatus = auth.status;

        $scope.isAdmin = function () {
            return auth.status.token && auth.status.token.userRole.contains("SysAdmin");
        };
        $scope.isStaff = function () {
            return auth.status.token && (auth.status.token.userRole.contains("Physician") || auth.status.token.userRole.contains("Nurse"));
        };
        $scope.isMedicationViewer = function () {
            return auth.status.token.userRole.contains("Physician");
        };

        //// When the user logs in, fetch the profile whenever the user logs in
        //$scope.$on('authService:login', function () {
        //    $scope.profile = userProfile.get();
        //});

        //// In case the page is refreshed after the user logs in, manually load the profile
        //if (auth.status.isLoggedIn) {
        //    $scope.profile = userProfile.get();
        //}

        $scope.logout = function () {
            localizedNotifications.removeAll();
            auth.logout();
            $state.go('login');
        };
        $scope.$state = $state;
    }
);

