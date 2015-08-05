angular.module('cloudmedic.careteams', [
    'ui.router',
    'chart.js',
    'cloudmedic.resources',
    'form'
])
.controller('CareTeamAddCtrl', function ($scope, $modalInstance, CareTeams, user, Users, localizedNotifications) {
    // Initialize scope variables
    $scope.creator = new CareTeams();
    $scope.creator.ProviderIds = [""];
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
        $scope.creator.ProviderIds = $scope.providerIds;
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
        var toRemove = [];
        var i = $scope.providers.length;
        while (i--) {
            var id = $scope.providers[i].UserId;
            for (var j = 0; j < $scope.selectedProviders.length; j++) {
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
.controller('CareTeamUpdateCtrl', function ($scope, $modalInstance, careTeam, CareTeams, Users, localizedNotifications) {
    // Initialize scope variables
    $scope.careTeam = angular.copy(careTeam);
    $scope.providerNameFilter = "";
    $scope.providers = [];
    $scope.providerIds = [];
    $scope.selectedProviders = [];
    for (var x = 0; x < $scope.careTeam.Providers.length; x++) {
        var provider = $scope.careTeam.Providers[x];
        $scope.providerIds.push(provider.UserId);
        $scope.selectedProviders.push(angular.copy(provider));
    }
    $scope.data = {
        isSubmitting: false
    };

    $scope.Updater = new CareTeams();
    $scope.update = function () {
        localizedNotifications.removeForCurrent();
        $scope.Updater.TeamId = $scope.careTeam.Id;
        $scope.Updater.TeamName = $scope.careTeam.Name;
        $scope.Updater.ProviderIds = $scope.providerIds;
        $scope.Updater.$update().then(function () {
            localizedNotifications.addForNext('update.success', 'success', { entityType: 'CareTeam' });
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
        var i = $scope.providers.length;
        while (i--) {
            var id = $scope.providers[i].UserId;
            for (var j = 0; j < $scope.selectedProviders.length; j++) {
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
});