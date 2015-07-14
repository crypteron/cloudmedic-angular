angular.module('crypteron.users', [
    'ui.router',
    'chart.js',
    'crypteron.resources'
])
.config(['$stateProvider', function config($stateProvider) {
    $stateProvider.state('users', {
        url: '/users',
        views: {
            "main": {
                controller: 'UsersCtrl',
                templateUrl: 'users/users.tpl.html'
            }
        },
        resolve: {
            security: ['$q', 'auth', function ($q, auth) {
                if (!auth.status.token) {
                    return $q.reject("Not Authorized");
                }
            }],
            users: ['Users', function (Users) {
                return Users.query().$promise;
            }]
        },
        data: { pageTitle: 'Users' }
    });
}])
.controller('UsersCtrl', ['$scope', '$state', 'users', 'localizedNotifications', '$modal', 'DROPDOWN_PLANS',
    function ($scope, $state, users, reports, localizedNotifications, $modal, DROPDOWN_PLANS) {
        $scope.users = users;

    }]);