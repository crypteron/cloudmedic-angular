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

    }));
    it('Test1', function () {
        $scope = $rootscope.$new();
        var ctrl = $controller('CareTeamAddCtrl', { $scope: $scope });
        $scope.creator();
        var handler = $httpbackend.expectPOST('CareTeams/Add');
        $httpbackend.flush();
    });
});