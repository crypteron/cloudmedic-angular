angular.module('cloudmedic.careteams', [
    'ui.router',
    'chart.js',
    'cloudmedic.resources',
    'form'
])
.config(['$stateProvider', function config($stateProvider) {
    $stateProvider.state('careteams', {
        url: '/careteams',
        views: {
            "main": {
                controller: 'CareTeamsCtrl',
                templateUrl: 'careteams/careteams.tpl.html'
            }
        },
        resolve: {
            security: ['$q', 'auth', function ($q, auth) {
                if (!auth.status.token || (!auth.status.token.userRole.contains('SysAdmin') && !auth.status.token.userRole.contains('Physician') && !auth.status.token.userRole.contains('Nurse'))) {
                    return $q.reject("Not Authorized");
                }
            }],
            careteams: ['CareTeams', function (CareTeams) {
                return CareTeams.query().$promise;
            }]
        },
        data: { pageTitle: 'CareTeams' }
    });
}])
.controller('CareTeamsCtrl', function ($scope, $state, careteams, CareTeams, localizedNotifications, $modal) {

    $scope.careteams = careteams;
    for (var i = 0; i < $scope.careteams.length; i++)
    {
        $scope.careteams[i].patientinfo= "Name: " + $scope.careteams[i].Patient.LastName + "," + $scope.careteams[i].Patient.FirstName+"\n";
        $scope.careteams[i].patientinfo+= "Gender: " + $scope.careteams[i].Patient.Gender+"\n";
        $scope.careteams[i].patientinfo+= "Date of Birth: " + $scope.careteams[i].Patient.DateOfBirth.substring(0, 10)+"\n";
        $scope.careteams[i].patientinfo+= "Email: " + $scope.careteams[i].Patient.Email;
    }
    $scope.careteamRemover = new CareTeams();
    $scope.removecareteam = function (careteam) {
      localizedNotifications.removeForCurrent();
      $modal.open({
        templateUrl: "app.confirm.tpl.html",
        controller: ['$scope', function ($scope) {
          $scope.confirmText = "You will not be able to recover this medication!";
          $scope.confirmButton = "Yes, delete medication!";
        }]
    }).result.then(function () {
          $scope.careteamRemover.$remove({ id: careteam.Id}).then(function () {
          localizedNotifications.addForNext('delete.success', 'success', { entityType: 'CareTeam' });
          $state.go("careteams", null, { reload: true });
    });
    });
    };
});