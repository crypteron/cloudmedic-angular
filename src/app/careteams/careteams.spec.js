describe('Care Team Add Controller', function () {
    var $scope,
        $httpBackend,
        $localizedNotifications,
        careTeamCtrl,
        url;
    beforeEach(function () {
        module('cloudmedic.careteams');
        module('cloudmedic.resources');

        module(function ($provide) {
            crySetupServiceMocks($provide);
        });

        inject(function ($rootScope, _$httpBackend_, $controller, CareTeams, $modalInstance, localizedNotifications, user, Users) {
            $scope = $rootScope.$new();
            url = 'https://localhost:44300/';
            $httpBackend = _$httpBackend_;
            $localizedNotifications = localizedNotifications;
            careTeamCtrl = $controller('CareTeamAddCtrl', {
                '$scope': $scope,
                '$modalInstance': $modalInstance,
                'CareTeams': CareTeams,
                'user': user,
                'Users': Users,
                'localizedNotifications': $localizedNotifications
            });
        });
    });

    it('CareTeam Add Test', function () {
        $scope.create();
        $httpBackend.expectPOST(url + 'CareTeams/Add').respond(201);
        expect($scope.creator.PatientId).toBe('123');
    });
    it('Provider Add Test', function () {
        $scope.selectedProviders = [];
        $scope.providerIds = [];
        $scope.addProvider({ 'Name': 'aa', UserId: '123' });
        $scope.addProvider({ 'Name': 'bb', UserId: '1234' });
        expect($scope.providerIds).toBe(['123','1234']);
    });
});