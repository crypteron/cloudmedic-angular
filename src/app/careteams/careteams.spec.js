describe('MedAddCtrl', function () {
    var $controller;
    var $rootScope;
    var $scope;
    var $httpBackend;
    beforeEach(function () {
        module('cloudmedic.resources');
        module('careteams.resource');
        module('cloudmedic.careteam');
        module('key.mocks');
    });
    beforeEach(inject(function ($injector) {
        $rootScope = $injector.get('$rootScope');
        $controller =$injector.get('$controller');
        $httpBackend = $injector.get('$httpBackend');
        var ctrl = $controller('CareTeamAddCtrl', { $scope: $scope });
        $scope = $rootScope.$new();
    }));
    it('CareTeam Creator Test', function () {       
        $scope.create();
        var handler = $httpBackend.expectPOST('CareTeams/Add');
        $httpBackend.flush();
    });
    it('CareTeam AddSupporter Test', function () {
        $scope.supporterIds = [];
        var supporter = {'UserId':'12345','FirstName':'Whatever','LastName':'whatever'};
        $scope.addSupporter(supporter);
        supporter = { 'UserId': '54321', 'FirstName': 'Whatever', 'LastName': 'whatever' };
        $scope.addSupporter(supporter);
        expect(supporterIds).toEqual(['12345','54321']);
    });
});