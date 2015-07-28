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
    for (var i = 0; i < $scope.careteams.length; i++) {
        $scope.careteams[i].patientinfo = "Name: " + $scope.careteams[i].Patient.LastName + "," + $scope.careteams[i].Patient.FirstName + "\n";
        $scope.careteams[i].patientinfo += "Gender: " + $scope.careteams[i].Patient.Gender + "\n";
        $scope.careteams[i].patientinfo += "Date of Birth: " + $scope.careteams[i].Patient.DateOfBirth.substring(0, 10) + "\n";
        $scope.careteams[i].patientinfo += "Email: " + $scope.careteams[i].Patient.Email;
    }
    for ( i = 0; i < $scope.careteams.length; i++) {
        $scope.careteams[i].providersinfo = "";
        for (var j = 0; j < $scope.careteams[i].Providers.length; j++) {
            $scope.careteams[i].providersinfo+= "Name: " + $scope.careteams[i].Providers[j].LastName + "," + $scope.careteams[i].Providers[j].FirstName + "\n";
            $scope.careteams[i].providersinfo += "Role: " + $scope.careteams[i].Providers[j].Roles[0] + "\n";
        }
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
            $scope.careteamRemover.$remove({ id: careteam.Id }).then(function () {
                localizedNotifications.addForNext('delete.success', 'success', { entityType: 'CareTeam' });
                $state.go("careteams", null, { reload: true });
            });
        });
    };
})
.controller('CareTeamAddCtrl', function ($scope, $state, $modalInstance, User,Providers,CareTeams, localizedNotifications) {
    $scope.patient = User;
    $scope.patient.Name = $scope.patient.FirstName + " " + $scope.patient.LastName;
    $scope.Name = "";
    $scope.Providers = Providers;
    $scope.providerid = "";
    $scope.ProviderIds = [];
    $scope.SelectedNames = [];
    $scope.AddSelectedProviders = function () {
        var mySelect = document.getElementById("providersSelect").options;
        var id = mySelect[mySelect.selectedIndex].value;
        if ($scope.ProviderIds.indexOf(id)==-1) {
            $scope.ProviderIds.push(id);
            for (var i = 0; i < $scope.Providers.length; i++)
            {
                if ($scope.Providers[i].UserId == id)
                {
                    $scope.SelectedNames.push($scope.Providers[i].LastName + " " + $scope.Providers[i].FirstName);
                }
            }
        }
    };
    $scope.reset = function () {
        $scope.ProviderIds = [];
        $scope.SelectedNames = [];
    };
    
    $scope.create = function () {
        $scope.creator = new CareTeams();
        $scope.creator.Name = $scope.Name;
        $scope.creator.PatientId = $scope.patient.UserId;
        $scope.creator.ProviderIds = $scope.ProviderIds;
        $scope.creator.$create().then(function () {
            localizedNotifications.addForNext('create.success', 'success', { entityType: 'CareTeam' });
            $modalInstance.close();
        }, function () {
        });

    };

});