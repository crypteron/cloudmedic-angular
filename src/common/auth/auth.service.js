angular.module('auth.service', ['localizedNotifications','ui.router','LocalStorageModule'])
.provider('auth', function(){
    var self = this;
    self.apiUrl = '';
    self.tokenPath = '';
    self.loginState = 'login';
    self.assumePublic = true;
    self.ssoProviders = {};
    self.excludeEndpoints = [];

    // Provider configuration
    // Set the URL of the Login API
    self.setApiUrl = function (apiUrl) {
        self.apiUrl = apiUrl;        
    };

    // Set the state to be used for logins
    self.setLoginState = function (loginState) {
        self.loginState = loginState;
    };

    // Set whether or not states are assumed to be public or not
    self.setAssumePublic = function (assumePublic) {
        self.assumePublic = assumePublic;
    };

    // Set the path to receive the login token at the API url
    self.setTokenPath = function (tokenPath) {
        // remove the old token path from exclude endpoints
        self.RemoveExcludeEndpoint(tokenPath);

        // set the new token path and add it to the exclude endpoints
        self.excludeEndpoints.push(tokenPath);
        self.tokenPath = tokenPath;
    };

    // Set any additional SSO providers
    self.setSsoProviders = function (ssoProviders) {
        self.ssoProviders = ssoProviders;
    };

    // Add an endpoint to those to exclude
    self.AddExcludeEndpoint = function (excludeEndpoint) {
        self.excludeEndpoints.push(excludeEndpoint);
    };

    // Remove an endpoint from those to exclude
    self.RemoveExcludeEndpoint = function (endpoint) {
        var i = self.excludeEndpoints.indexOf(endpoint);
        if (i > -1) {
            self.excludeEndpoints.splice(i, 1);
        }
    };

    // Set all the provider options at once using JSON
    self.setOptions = function (options) {        
        options = angular.extend({
            apiUrl: '',
            tokenPath: '',
            loginState: 'login',
            assumePublic: true,
            ssoProviders: {},
            excludeEndpoints: []
        }, options);
                
        self.setApiUrl(options.apiUrl);
        self.setTokenPath(options.tokenPath);
        self.setLoginState(options.loginState);
        self.setAssumePublic(options.assumePublic);
        self.setSsoProviders(options.ssoProviders);
        angular.forEach(options.excludeEndpoints, function (endpoint) {
            self.AddExcludeEndpoint(endpoint);
        });
    };

    // Factory 
    self.$get = function ($http, $q, $rootScope, localizedNotifications, $state, localStorageService, AUTH_SSO_PROVIDERS) {
        // Properties
        var _status = {
            token: null,
            userRoles: [],
            userName: '',
            ssoProvider:  null,
            isLoggedIn: false       
        };

        var _ssoProviders = angular.extend(AUTH_SSO_PROVIDERS, self.ssoProviders);

        // Stores the state name and params of an unaccessable state to optionally redirect to after login
        var _redirectState = false;

        // Methods
        // Initialization
        var _init = function () {
            // Fetch the auth status
            _fetchStatus();

            // Redirect users to login if trying to access authenticated state without being logged in
            $rootScope.$on("$stateChangeStart", function (event, toState, toParams, fromState, fromParams) {
                if (((self.assumePublic && toState.data.auth === true) || (!self.assumePublic && toState.data.public !== true) && _status.isLoggedIn === false)) {
                    event.preventDefault();
                    localizedNotifications.addForNext('login.required', 'warning', { pageTitle: toState.data.pageTitle }, null);
                    _setRedirectState(toState.name, toParams);
                    $state.go(self.loginState, {}, { reload: true });
                }
            });
        };

        // Fetch the auth status from local storage
        var _fetchStatus = function () {
            var status = localStorageService.get('cmAuthStatus');
            if (status) {
                _status.isLoggedIn = status.isLoggedIn;
                _status.token = status.token;
                _status.userRoles = angular.fromJson(status.userRoles);
                _status.userName = status.username;
                _status.ssoProvider = status.ssoProvider;
            }
        };

        // Setter method for redirect state
        var _setRedirectState = function (stateName, stateParams) {
            _redirectState = {
                stateName: stateName,
                stateParams: angular.copy(stateParams)
            };
        };

        // Helper method for smart redirection.  Redirects to the stored state if exists or to specified state otherwise
        var _redirectAfterLogin = function (stateName, stateParams) {
            if (_redirectState) {              
                $state.go(_redirectState.stateName, _redirectState.stateParams, { reload: true });
                _redirectState = false;
            } else {                
                $state.go(stateName, stateParams, { reload: true });
            }
        };

        // Log user out
        var _logout = function (withNotification) {
            withNotification = (typeof withNotification === 'undefined') ? true: withNotification;
            _status.token = null;
            _status.userRoles = [];
            _status.userName = '';
            _status.ssoProvider = null;
            _status.isLoggedIn = false;

            localStorageService.remove('cmAuthStatus');
            if (withNotification){
                localizedNotifications.addForNext('logout.success', 'info', null, null);
            }
            $rootScope.$broadcast('authService:logout');            
        };

        // Log user in
        var _login = function (loginData) {
            var data = "grant_type=password&username=" + loginData.username + "&password=" + loginData.password;
            var deferred = $q.defer();
            $http.post(self.apiUrl + self.tokenPath, data, { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } })
                .success(function (response) {
                    _status.token = response;
                    _status.userRoles = angular.fromJson(response.userRole);
                    _status.userName = loginData.username;
                    _status.isLoggedIn = true;
                    _status.ssoProvider = null;
                    _updateStorage();
                    localizedNotifications.addForNext('login.success', 'success', _status, null);
                    $rootScope.$broadcast('authService:login', _status);
                    deferred.resolve(response);
                })
            .error(function (err, status) {
                deferred.reject(err);
            });

            return deferred.promise;
        };
        
        // Log user in via SSO
        var _loginWithSso = function (ssoData) {
            _status.token = {
                access_token: ssoData.token,
                userType: 1
            };
            _status.userName = ssoData.userName;
            _status.isLoggedIn = true;
            _status.ssoProvider = ssoData.ssoProvider;            
            _updateStorage();
            localizedNotifications.addForNext('login.sso.success', 'info', { ssoProvider: _ssoProviders[_status.ssoProvider].label });
            $rootScope.$broadcast('authService:login', _status);
        };

        // Update local storage with auth status
        var _updateStorage = function () {
            localStorageService.set('cmAuthStatus', _status);
        };

        // Service API
        var service =
        {
            status: _status,            
            login: _login,
            logout: _logout,
            loginWithSso: _loginWithSso,
            apiUrl: self.apiUrl,
            tokenPath: self.tokenPath,            
            loginState: self.loginState,
            setRedirectState: _setRedirectState,
            redirectAfterLogin: _redirectAfterLogin,
            init: _init,
            ssoProviders: _ssoProviders,
            excludeEndpoints: self.excludeEndpoints
        };
        return service;
    };

});