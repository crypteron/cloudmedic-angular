angular.module('cloudmedic.provider', [
    'ui.router',
    'chart.js',
    'cloudmedic.resources',
    'form'
])
.config(function config($stateProvider) {
    $stateProvider.state('provider', {
        url: '/provider',
        views: {
            "main": {
                controller: 'ProviderCtrl',
                templateUrl: 'provider/provider.tpl.html'
            }
        },
        resolve: {
            security: function ($q, auth) {
                if (!auth.status.token) {
                    return $q.reject("Not Authorized");
                }
            },
            careTeams: function (Users, auth) {
                return Users.prTeams({ id: auth.status.token.userId }).$promise;
            }
        },
        data: { pageTitle: 'Provider' }
    });
})
.controller('ProviderCtrl', function ($scope, $state, careTeams, localizedNotifications) {
    $scope.careTeams = careTeams;
    $scope.orderByField = 'Name';
    $scope.reverseSort = false;
});