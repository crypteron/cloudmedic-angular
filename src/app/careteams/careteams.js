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
    $scope.providerEmailFilter = "";
    $scope.providers = [];
    $scope.providerIds = [];
    $scope.selectedProviders = [];
    $scope.supporterEmailFilter = "";
    $scope.supporters = [];
    $scope.supporterIds = [];
    $scope.selectedSupporters = [];
    $scope.data = {
        isSubmitting: false
    };

    $scope.create = function () {
        localizedNotifications.removeForCurrent();
        $scope.data.isSubmitting = true;
        $scope.creator.PatientId = user.UserId;

        $scope.creator.Name = capitalizeTeamName($scope.creator.Name);
        $scope.creator.ProviderIds = $scope.providerIds;
        $scope.creator.SupporterIds = $scope.supporterIds;
        $scope.creator.$create().then(function () {
            localizedNotifications.addForNext('create.success', 'success', { entityType: 'CareTeam' });
            $modalInstance.close();
        }, function () {
            $scope.data.isSubmitting = false;
        });
    };

    // Provider functions
    $scope.searchProviders = function () {
        $scope.providers = [];
        if ($scope.providerEmailFilter.length > 0) {
            $scope.providers = Users.providers({ email: $scope.providerEmailFilter}).$promise.then(function (result) {
                $scope.providers = result;
                filterProviders();
            });
        }
    };

    //Capitalizes every word separated by a space
    var capitalizeTeamName = function (teamname) {

        var string_array = teamname.split(' ');
        var name_holder = "";
        angular.forEach(string_array, function (word) {
            name_holder = name_holder + capitalize(word) + ' ';
        });

        name_holder = name_holder.substr(0, name_holder.length - 1);

        return name_holder;

    };

    var filterProviders = function () {
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
        filterProviders();
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

    // Supporter functions
    $scope.searchSupporters = function () {
        $scope.supporters = [];
        if ($scope.supporterEmailFilter.length > 0) {
            $scope.supporters = Users.supporters({ email: $scope.supporterEmailFilter }).$promise.then(function (result) {
                $scope.supporters = result;
                filterSupporters();
            });
        }
    };

    var filterSupporters = function () {
        var i = $scope.supporters.length;
        while (i--) {
            var id = $scope.supporters[i].UserId;
            for (var j = 0; j < $scope.selectedSupporters.length; j++) {
                var selectedId = $scope.selectedSupporters[j].UserId;
                if (id.localeCompare(selectedId) === 0) {
                    $scope.supporters.splice(i, 1);
                }
            }
        }
    };

    $scope.addSupporter = function (supporter) {
        $scope.selectedSupporters.push(angular.copy(supporter));
        $scope.supporterIds.push(supporter.UserId);
        filterSupporters();
    };

    $scope.removeSupporter = function (supporter) {
        $scope.supporters.push(angular.copy(supporter));
        $scope.supporterIds.splice($scope.supporterIds.indexOf(supporter.UserId), 1);
        for (var i = 0; i < $scope.selectedSupporters.length; i++) {
            if ($scope.selectedSupporters[i].UserId.localeCompare(supporter.UserId) === 0) {
                $scope.selectedSupporters.splice(i, 1);
                break;
            }
        }
    };

    // Bind the enter key on the two search input fields
    $scope.enterProviders = function (key) {
        if (key.which === 13) {
            $scope.searchProviders();
        }
    };
    $scope.enterSupporters = function (key) {
        if (key.which === 13) {
            $scope.searchSupporters();
        }
    };
})
.controller('CareTeamUpdateCtrl', function ($scope, $modalInstance, careTeam, CareTeams, Users, localizedNotifications) {
    // Initialize scope variables
    $scope.careTeam = angular.copy(careTeam);
    $scope.providerEmailFilter = "";
    $scope.providers = [];
    $scope.providerIds = [];
    $scope.selectedProviders = [];
    for (var x = 0; x < $scope.careTeam.Providers.length; x++) {
        var provider = $scope.careTeam.Providers[x];
        $scope.providerIds.push(provider.UserId);
        $scope.selectedProviders.push(angular.copy(provider));
    }
    $scope.supporterEmailFilter = "";
    $scope.supporters = [];
    $scope.supporterIds = [];
    $scope.selectedSupporters = [];
    for (var y = 0; y < $scope.careTeam.Supporters.length; y++) {
        var supporter = $scope.careTeam.Supporters[y];
        $scope.supporterIds.push(supporter.UserId);
        $scope.selectedSupporters.push(angular.copy(supporter));
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
        $scope.Updater.SupporterIds = $scope.supporterIds;
        $scope.Updater.$update().then(function () {
            localizedNotifications.addForNext('update.success', 'success', { entityType: 'CareTeam' });
            $modalInstance.close();
        }, function () {
            $scope.data.isSubmitting = false;
        });
    };

    // Provider functions
    $scope.searchProviders = function () {
        $scope.providers = [];
        if ($scope.providerEmailFilter.length > 0) {
            $scope.providers = Users.providers({ email: $scope.providerEmailFilter }).$promise.then(function (result) {
                $scope.providers = result;
                filterProviders();
            });
        }
    };

    var filterProviders = function () {
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
        filterProviders();
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

    // Supporter functions
    $scope.searchSupporters = function () {
        $scope.supporters = [];
        if ($scope.supporterEmailFilter.length > 0) {
            $scope.supporters = Users.supporters({ email: $scope.supporterEmailFilter }).$promise.then(function (result) {
                $scope.supporters = result;
                filterSupporters();
            });
        }
    };

    var filterSupporters = function () {
        var i = $scope.supporters.length;
        while (i--) {
            var id = $scope.supporters[i].UserId;
            for (var j = 0; j < $scope.selectedSupporters.length; j++) {
                var selectedId = $scope.selectedSupporters[j].UserId;
                if (id.localeCompare(selectedId) === 0) {
                    $scope.supporters.splice(i, 1);
                }
            }
        }
    };

    $scope.addSupporter = function (supporter) {
        $scope.selectedSupporters.push(angular.copy(supporter));
        $scope.supporterIds.push(supporter.UserId);
        filterSupporters();
    };

    $scope.removeSupporter = function (supporter) {
        $scope.supporters.push(angular.copy(supporter));
        $scope.supporterIds.splice($scope.supporterIds.indexOf(supporter.UserId), 1);
        for (var i = 0; i < $scope.selectedSupporters.length; i++) {
            if ($scope.selectedSupporters[i].UserId.localeCompare(supporter.UserId) === 0) {
                $scope.selectedSupporters.splice(i, 1);
                break;
            }
        }
    };

    // Bind the enter key on the two search input fields
    $scope.enterProviders = function (key) {
        if (key.which === 13) {
            $scope.searchProviders();
        }
    };
    $scope.enterSupporters = function (key) {
        if (key.which === 13) {
            $scope.searchSupporters();
        }
    };
});