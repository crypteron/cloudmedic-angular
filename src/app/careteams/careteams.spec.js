describe('Care Team Add Controller', function () {
    var $scope,
        $httpBackend,
        $localizedNotifications,
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
        expect($scope.creator.PatientId).toBe('123');
    });
    it('Provider Add Test', function () {
        $scope.selectedProviders = [];
        $scope.providerIds = [];
        $scope.addProvider({ 'Name': 'aa', UserId: '123' });
        $scope.addProvider({ 'Name': 'bb', UserId: '1234' });
        expect($scope.providerIds).toEqual(['123','1234']);
    });
    it('Provider Remove Test', function () {
        $scope.selectedProviders = [{ 'Name': 'aa', UserId: '123' }, { 'Name': 'bb', UserId: '1234' }, { 'Name': 'cc', UserId: '12345' }];
        $scope.removeProvider({ 'Name': 'aa', UserId: '123' });
        expect($scope.selectedProviders).toEqual([{ 'Name': 'bb', UserId: '1234' }, { 'Name': 'cc', UserId: '12345' }]);
    });
});