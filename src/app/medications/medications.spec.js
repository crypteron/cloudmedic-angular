describe('CareTeamAddCtrl', function () {
    var $controller;
    var $rootScope;
    var $scope;
    var $httpBackend;
    beforeEach(function () {
        module('cloudmedic.resources');
        module('medications.resource');
        module('cloudmedic.medications');
        module('key.mocks');
    });
    beforeEach(inject(function ($injector) {
        $rootScope = $injector.get('$rootScope');
        $controller = $injector.get('$controller');
        $httpbakend = $injector.get('$httpBackend');
        
        $scope = $rootScope.$new();
    }));
    it('Medication Add Test', function () {
        $scope.create();
        var ctrl = $controller('MedAddCtrl', { $scope: $scope });
        var handler = $httpBackend.expectPOST('medications/Add');
        $httpBackend.flush();
    });
    it('Test', function () {
        var ctrl = $controller('MedAddCtrl', { $scope: $scope });
    });
});