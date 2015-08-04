angular.module('cloudmedic.careteams', [
    'ui.router',
    'chart.js',
    'cloudmedic.resources',
    'form'
])
.config(function config($stateProvider) {
    $stateProvider.state('careteams', {
        url: '/careteams',
        views: {
            "main": {
                controller: 'CareTeamsCtrl',
                templateUrl: 'careteams/careteams.tpl.html'
            }
        },
        resolve: {
            security: function ($q, auth) {
                if (!auth.status.token || (!auth.status.token.userRole.contains('SysAdmin') && !auth.status.token.userRole.contains('Physician') && !auth.status.token.userRole.contains('Nurse'))) {
                    return $q.reject("Not Authorized");
                }
            },
            careteams: function (CareTeams) {
                if (auth.status.token.userRole.contains('SysAdmin') || auth.status.token.userRole.contains('Physician') || auth.status.token.userRole.contains('Nurse')) {
                    return CareTeams.query().$promise;
                }
            }
        },
        data: { pageTitle: 'CareTeams' }
    });
})
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
.controller('CareTeamAddCtrl', function ($scope, $modalInstance, user, CareTeams, Users, localizedNotifications) {
    $scope.creator = new CareTeams();
    $scope.creator.ProviderIds = [""];
    $scope.searcher = new Users();
    $scope.patientName = user.FirstName + " " + user.LastName;
    $scope.providerNameFilter = "";
    $scope.providers = [];
    $scope.providerIds = [];
    $scope.selectedProviders = [];
    $scope.data = {
        isSubmitting: false
    };

    $scope.create = function () {
        localizedNotifications.removeForCurrent();
        $scope.data.isSubmitting = true;
        $scope.creator.PatientId = user.UserId;
        $scope.creator.$create().then(function () {
            localizedNotifications.addForNext('create.success', 'success', { entityType: 'CareTeam' });
            $modalInstance.close();
        }, function () {
            $scope.data.isSubmitting = false;
        });
    };

    $scope.search = function () {
        $scope.providers = [];
        if ($scope.providerNameFilter.length > 0) {
            $scope.providers = Users.search({ id: $scope.providerNameFilter }).$promise.then(function (result) {
                $scope.providers = result;
                filterSearch();
            });
        }
    };

    var filterSearch = function () {
        for (var i = 0; i < $scope.providers.length; i++) {
            for (var j = 0; j < $scope.selectedProviders.length; j++) {
                var id = $scope.providers[i].UserId;
                var selectedId = $scope.selectedProviders[j].UserId;
                if (id.localeCompare(selectedId) === 0) {
                    $scope.providers.splice(i, 1);
                }
            }
        }
    };

    $scope.addProvider = function (provider) {
        $scope.selectedProviders.push(angular.copy(provider));
        $scope.providerIds.push(provider.UserId);
        filterSearch();
    };

    $scope.removeProvider = function (provider) {
        $scope.providers.push(angular.copy(provider));
        $scope.providerIds.splice($scope.providerIds.indexOf(provider.UserId), 1);
        for (var i = 0; i < $scope.selectedProviders.length; i++) {
            if ($scope.selectedProviders[i].UserId.localeCompare(provider.UserId) === 0) {
                $scope.selectedProviders.splice(i, 1);
                break;
            }
        }
    };
})
.controller('CareTeamUpdateCtrl', function ($scope, $modalInstance, providers, careTeam, CareTeams, localizedNotifications) {
    // initialize scope variables
    $scope.careTeam = careTeam;
    $scope.ProviderIds = [];
    $scope.providers = angular.copy(providers);
    for (var x = 0; x < $scope.careTeam.Providers.length; x++) {
        $scope.ProviderIds.push($scope.careTeam.Providers[x].UserId);
        for (var y = 0; y < $scope.providers.length; y++) {
            if ($scope.providers[y].UserId == $scope.careTeam.Providers[x].UserId) {
                $scope.providers.splice(y, 1);
            }
        }
    }
    $scope.Updater = new CareTeams();
    $scope.data = {
        isSubmitting: false
    };

    // For adding or removing providers
    $scope.lefttoright = function () {
        var selectedItem = $("#leftValues option:selected");
        for (var i = 0; i < selectedItem.length; i++) {
            var id = selectedItem[i].value;
            if ($scope.ProviderIds.indexOf(id) == -1) {
                $scope.ProviderIds.push(id);
            }
        }
        $("#rightValues").append(selectedItem);
    };
    $scope.righttoleft = function () {
        var selectedItem = $("#rightValues option:selected");
        for (var i = 0; i < selectedItem.length; i++) {
            var id = selectedItem[i].value;
            var index = $scope.ProviderIds.indexOf(id);
            if (index > -1) {
                $scope.ProviderIds.splice(index, 1);
            }
        }
        $("#leftValues").append(selectedItem);
    };

    $scope.update = function () {
        localizedNotifications.removeForCurrent();
        $scope.Updater.TeamId = $scope.careTeam.Id;
        $scope.Updater.TeamName = $scope.careTeam.Name;
        $scope.Updater.ProviderIds = $scope.ProviderIds;
        $scope.Updater.$update().then(function () {
            localizedNotifications.addForNext('update.success', 'success', { entityType: 'CareTeam' });
            $modalInstance.close();
        }, function () {
            $scope.data.isSubmitting = false;
        });
    };
});