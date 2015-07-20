angular.module('cloudmedic.medications', [
    'ui.router',
    'chart.js',
    'crypteron.resources'
])
.config(['$stateProvider', function config($stateProvider) {
    $stateProvider.state('medications', {
        url: '/medications',
        views: {
            "main": {
                controller: 'MedicationsCtrl',
                templateUrl: 'medications/medication.tpl.html'
            }
        },
        resolve: {
            security: ['$q', 'auth', function($q, auth) {
                if(!auth.status.token || !auth.status.token.userRole.contains('SysAdmin') || !auth.status.token.userRole.contains('Physician')) {
                    return $q.reject("Not Authorized");
                }
            }],
            medications: ['Medications', function (Medications) {
                return Medications.query().$promise;
            }]
        },
        data: { pageTitle: 'Medications' }
    });
}])
.controller('MedicationsCtrl', function ($scope, $state, medications, Medications, localizedNotifications, $modal) {



});