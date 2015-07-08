angular.module('crypteron.apps', ['crypteron.apps.list', 'crypteron.apps.detail', 'crypteron.apps.add'])
.config(['$stateProvider', function config($stateProvider) {
    $stateProvider
    .state('apps', {
        abstract: true,
        url: '/apps',
        template: "",
        data: {}
    });
}]);