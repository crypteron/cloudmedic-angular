describe('CareTeamAddCtrl', function () {
    var $controller;
    var $rootscope;
    var $scope;
    var $httpbackend;
    beforeEach(function () {
        module('cloudmedic.resources');
        module('careteams.resource');
        module('cloudmedic.careteam');
        module('key.mocks');
    });
    beforeEach(inject(function ($injector) {
        $rootscope = $injector.get('$rootscope');
        $controller =$injector.get('$controller');
        $httpbakend = $injector.get('$httpbackend');
        var ctrl = $controller('CareTeamAddCtrl', { $scope: $scope });
        $scope = $rootscope.$new();
    }));
    it('CareTeam Creator Test', function () {       
        $scope.create();
        var handler = $httpbackend.expectPOST('CareTeams/Add');
        $httpbackend.flush();
    });
    it('CareTeam AddSupporter Test', function () {
        $scope.supporterIds = [];
        var supporter = {'UserId':'12345','FirstName':'Whatever','LastName':'whatever'};
        $scope.addSupporter(supporter);
        expect(supporterIds).toEqual(['12345']);
    });
});