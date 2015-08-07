angular.module('cloudmedic.patient', [
    'ui.router',
    'chart.js',
    'cloudmedic.resources',
    'form'
])
.config(function config($stateProvider) {
    $stateProvider.state('patient', {
        url: '/users',
        views: {
            "main": {  
                controller: 'PatientCtrl',
                templateUrl: 'patient/patient.tpl.html'
            }
        },
        resolve: {
            security: function ($q, auth) {
                if (!auth.status.token || !auth.status.token.userRole.contains('Patient')) {
                    return $q.reject("Not Authorized");
                }
            },
            prescriptions: function (Users, auth) {
                return Users.meds({ id: auth.status.token.userId }).$promise;
            },
            careTeams: function (Users, $q, auth) {
                if (auth.status.token.userRole.contains('Patient')) {
                    return Users.paTeams({ id: auth.status.token.userId }).$promise;
                }
            }
        },
        data: { pageTitle: 'Patient' }
    });
})
.controller('PatientCtrl', function ($scope, $state, $filter, $modal, prescriptions, careTeams, CareTeams, localizedNotifications) {
    $scope.prescriptions = prescriptions;
    $scope.orderByField = 'MedicationName';
    $scope.reverseSort = false;
    $scope.hasPending = false;
    $scope.CareTeamUpdater = new CareTeams();

    for(var i = 0; i < careTeams.length; i++)
    {
        if(!careTeams[i].Active)
        {
            $scope.hasPending = true;
        }
      
    }

    $scope.careTeams = careTeams;

    $scope.isActive = function (careTeam) {
        return (careTeam.Active);
    };

    $scope.isPending = function (careTeam) {
        return (!careTeam.Active);
    };

    $scope.approveCareTeam = function (careTeam) {
        localizedNotifications.removeForCurrent();
        $modal.open({
            templateUrl: "app.confirm.tpl.html",
            controller: function ($scope) {
                $scope.confirmText = "Are you sure you want to approve this care team?";
                $scope.confirmButton = "Yes";
            }
        }).result.then(function () {
            $scope.CareTeamUpdater.Id = careTeam.id;
            $scope.CareTeamUpdater.$update().then(function () {
                localizedNotifications.addForNext('update.success', 'success', { entityType: 'User' });
                $state.go("patient", null, { reload: true });
            });
        });
    };

});