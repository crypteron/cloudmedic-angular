describe('Medication Controller', function () {
    var $scope,
        $httpBackend,
        $localizedNotifications,
        medCtrl;
    beforeEach(function () {
        module('cloudmedic.medications');
        module('cloudmedic.resources');
        module(function ($provide) {
            crySetupServiceMocks($provide);
        });

        inject(function ($rootScope, _$httpBackend_, $controller,$state,$modal, localizedNotifications, Medications, medications) {
            $scope = $rootScope.$new();
            $httpBackend = _$httpBackend_;
            $localizedNotifications = localizedNotifications;
            careTeamCtrl = $controller('MedicationsCtrl', {
                '$scope': $scope,
                '$modal': $modal,
                'Medications': Medications,
                'medications':medications,
                'localizedNotifications': $localizedNotifications,
                '$state':$state
            });
        });
    });
    it('should pass a dummy test', inject(function () {
        expect(true).toBeTruthy();
    }));

});