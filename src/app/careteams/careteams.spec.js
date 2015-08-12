describe('Care Team Add Controller', function () {
    var $scope,
        $httpBackend,
        careTeamCtrl;

    beforeEach(function () {
        module('cloudmedic.careteams');
        module('cloudmedic.resources');

        module(function ($provide) {
            crySetupServiceMocks($provide);
        });

        inject(function ($rootScope, _$httpBackend_, $controller, CareTeams, $modalInstance, localizedNotifications, user, Users) {
            $scope = $rootScope.$new();
            $httpBackend = _$httpBackend_;
            careTeamCtrl = $controller('CareTeamAddCtrl', {
                '$scope': $scope,
                '$modalInstance': $modalInstance,
                'CareTeams': CareTeams,
                'user': user,
                'Users': Users,
                'localizedNotifications': localizedNotifications
            });
        });
    });

    it('should load a dummy test', function () {


    });
});