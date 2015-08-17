describe('Patient Controller', function () {
    var $scope,
        $httpBackend,
        $localizedNotifications,
        PatientCtrl;
    beforeEach(function () {
        module('cloudmedic.patient');
        module('cloudmedic.resources');
        module(function ($provide) {
            cmSetupServiceMocks($provide);
        });

        inject(function ($rootScope, _$httpBackend_, $controller, $state, $filter, $modal, prescriptions, careTeams, CareTeams, localizedNotifications)
        {
            $scope = $rootScope.$new();
            $httpBackend = _$httpBackend_;
            $localizedNotifications = localizedNotifications;
            PatientCtrl = $controller('PatientCtrl', {
                '$scope': $scope,
                '$modal': $modal,
                'localizedNotifications': $localizedNotifications,
                '$state': $state,           
                '$filter': $filter,
                'CareTeams': CareTeams,
                'careTeams': careTeams,
                'prescriptions':prescriptions
 
            });
        });
    });
    it('Activiation Test', inject(function () {
        var team1 = { Active: true };
        expect($scope.isActive(team1)).toBeTruthy();
    }));
    
});