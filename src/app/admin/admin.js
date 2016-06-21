angular.module('cloudmedic.admin', [
    'ui.router',
    'ui.mask',
    'form',
    'cloudmedic.resources'
])
.config(function config($stateProvider) {
    $stateProvider.state('admin', {
        url: '/admin',
        views: {
            "main": {
                controller: 'AdminCtrl',
                templateUrl: 'admin/admin.tpl.html'
            }
        },
        resolve: {
            security: function ($q, auth) {
                if (!auth.status.token || !auth.status.token.userRole.contains('SysAdmin')) {
                    return $q.reject("Not Authorized");
                }
            },
            usersResp: function (Users, $q, auth) {
                if (auth.status.token.userRole.contains('SysAdmin')) {
                    return Users.query().$promise;
                }
            },
            careTeams: function (CareTeams, $q, auth) {
                if (auth.status.token.userRole.contains('SysAdmin')) {
                    return CareTeams.query().$promise;
                }
            }
        },
        data: { pageTitle: 'Admin' }
    });
})
.controller('AdminCtrl', function ($scope, $state, $modal, usersResp, Users, careTeams, CareTeams, localizedNotifications) {
    // Initialize scope variables
    $scope.users = usersResp.Users;
    $scope.careTeams = angular.copy(careTeams);
    $scope.inactiveTeams = [];
    $scope.inactiveTeamsEmpty = true;
    var x = $scope.careTeams.length;
    while (x--) {
        if (!$scope.careTeams[x].Active) {
            $scope.inactiveTeams.push($scope.careTeams[x]);
            $scope.careTeams.splice(x, 1);
            $scope.inactiveTeamsEmpty = false;
        }
    }
    $scope.userRemover = new Users();
    $scope.careteamRemover = new CareTeams();
    $scope.isProvider = function (user) {
        return user.Roles == 'Nurse' || user.Roles == 'Physician';
    };


    $scope.orderByFieldPatient = 'LastName';
    $scope.reverseSortPatient = false;

    $scope.orderByFieldProvider = 'LastName';
    $scope.reverseSortProvider = false;

    $scope.orderByFieldCareTeam = 'Name';
    $scope.reverseSortCareTeam = false;

    $scope.orderByFieldSupporter = 'Name';
    $scope.reverseSortSupporter = false;

    $scope.PhysicianTabActive = false;
    $scope.SupporterTabActive = false;

    $scope.providers = [];
    for (var i = 0; i < $scope.users.length; i++) {
        if ($scope.isProvider($scope.users[i])) {
            $scope.providers.push($scope.users[i]);
        }
    }

    $scope.removeUser = function (user) {
        localizedNotifications.removeForCurrent();
        $modal.open({
            templateUrl: "app.confirm.tpl.html",
            controller: function ($scope) {
                $scope.confirmText = "You will not be able to recover this User!";
                $scope.confirmButton = "Yes, delete User!";
            }
        }).result.then(function () {
            $scope.userRemover.$remove({ id: user.UserId }).then(function () {
                localizedNotifications.addForNext('delete.success', 'success', { entityType: 'User' });
                $state.go("admin", null, { reload: true }); 
            });
        });
    };

    $scope.removeCareTeam = function (careTeam) {
        localizedNotifications.removeForCurrent();
        $modal.open({
            templateUrl: "app.confirm.tpl.html",
            controller: function ($scope) {
                $scope.confirmText = "You will not be able to recover this care team!";
                $scope.confirmButton = "Yes, delete care team!";
            }
        }).result.then(function () {
            $scope.careteamRemover.$remove({ id: careTeam.Id }).then(function () {
                localizedNotifications.addForNext('delete.success', 'success', { entityType: 'CareTeam' });
                $state.go("admin", null, { reload: true });
            });
        });
    };

    $scope.createProvider = function () {
        localizedNotifications.removeForCurrent();
        $modal.open({
            templateUrl: "provider/provider.add.tpl.html",
            controller: 'FormCtrl'
        }).result.then(function () {
            $state.go("admin", null, { reload: true });
        });
    };

    $scope.createSupporter = function () {
        localizedNotifications.removeForCurrent();
        $modal.open({
            templateUrl: "supporter/supporter.add.tpl.html",
            controller: 'FormCtrl'
        }).result.then(function () {
            $state.go("admin", null, { reload: true });
        });
    };

    $scope.createCareTeam = function (user) {
        localizedNotifications.removeForCurrent();
        $scope.user = user;
        $modal.open({
            templateUrl: "careteams/careteams.add.tpl.html",
            controller: 'CareTeamAddCtrl',
            resolve: {
                user: function () { return $scope.user; }
            }
        }).result.then(function () {
            $state.go("admin", null, { reload: true });
        });
    };

    $scope.updateCareTeam = function (careTeam) {
        localizedNotifications.removeForCurrent();
        $modal.open({
            templateUrl: "careteams/careteams.update.tpl.html",
            controller: 'CareTeamUpdateCtrl',
            resolve: {
                careTeam: function () { return careTeam; },
                providers: function () { return $scope.providers; }
            }
        }).result.then(function () {
            $state.go("admin", null, { reload: true });
        });
    };

    $scope.createSupporter = function () {
        localizedNotifications.removeForCurrent();
        $modal.open({
            templateUrl: "supporter/supporter.add.tpl.html",
            controller: 'FormCtrl'
        }).result.then(function () {
            $state.go("admin", null, { reload: true });
        });
    };
});