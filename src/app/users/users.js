angular.module('crypteron.users', [
    'ui.router',
    'chart.js',
    'crypteron.resources',
    'form'
])
.config(['$stateProvider', function config($stateProvider) {
    $stateProvider.state('users', {
        url: '/users',
        views: {
            "main": {
                controller: 'FormCtrl',
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
}]);
//.controller('UsersCtrl', function ($scope, $state, users, reports, localizedNotifications, $modal) {
//        $scope.users = users;

//        $scope.orderByField = 'LastName';
//        $scope.reverseSort = false;

//        $scope.PhysicianOrNurse = function (user) {
//            return user.Roles == 'Nurse' || user.Roles == 'Physician';
//        };
//    });