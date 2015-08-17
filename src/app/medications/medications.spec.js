describe('Medication Add Controller', function () {
    var $scope,
        $httpBackend,
        $localizedNotifications,
        MedAddCtrl;
    beforeEach(function () {
        module('cloudmedic.medications');
        module('cloudmedic.resources');
        module(function ($provide) {
            crySetupServiceMocks($provide);
        });

        inject(function ($rootScope, _$httpBackend_, $controller,$state,$modalInstance, localizedNotifications, Medications) {
            $scope = $rootScope.$new();
            $httpBackend = _$httpBackend_;
            $localizedNotifications = localizedNotifications;
            MedAddCtrl = $controller('MedAddCtrl', {
                '$scope': $scope,
                '$modalInstance': $modalInstance,
                'Medications': Medications,
                'localizedNotifications': $localizedNotifications,
                '$state':$state
            });
        });
    });
    it('should pass a dummy test', inject(function () {
        expect(true).toBeTruthy();
    }));
    it('Medication Create Test', inject(function () {
        $scope.medicationsData.GenericName = "TestMed";
        $scope.medicationsData.Code = 57077;
        $scope.create();
        expect($scope.medicationsCreator.GenericName).toEqual("TestMed");
        expect($scope.medicationsCreator.Code).toEqual(57077);
    }));
});