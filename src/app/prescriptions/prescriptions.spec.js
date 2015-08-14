describe('Prescription Add Controller', function () {
    var $scope,
        $httpBackend,
        $localizedNotifications,
        PreAddCtrl;
    beforeEach(function () {
        module('cloudmedic.prescriptions');
        module('cloudmedic.resources');
        module(function ($provide) {
            crySetupServiceMocks($provide);
        });

        inject(function ($rootScope, _$httpBackend_, $controller, $state, $modalInstance, $filter, auth,
            Prescriptions, Users, localizedNotifications, Candidates, MedId, MedName, MONTHS) {
            $scope = $rootScope.$new();
            $httpBackend = _$httpBackend_;
            $localizedNotifications = localizedNotifications;
            PreAddCtrl = $controller('AddPrescriptionsCtrl', {
                '$scope': $scope,
                '$modalInstance': $modalInstance,
                'MedId': MedId,
                'MedName': MedName,
                'MONTHS':MONTHS,
                'localizedNotifications': $localizedNotifications,
                '$state': $state,
                'Prescriptions': Prescriptions,
                '$filter':$filter,
                'auth': auth,
                'Users': Users,
                'Candidates': Candidates
            });
        });
    });
    it('should pass a dummy test', inject(function () {
        expect(true).toBeTruthy();
    }));
    it('sort function test', inject(function () {
        $scope.sort();
        expect($scope.CandidatesAI).toEqual([{
            FirstName: 'Armanda',
            LastName: 'Alice'
        },
        {
            FirstName: 'Arm',
            LastName: 'Ali'
        }
        ]);
        expect($scope.CandidatesRZ).toEqual([{
            FirstName: 'Nick',
            LastName: 'Sid'
        }, {
            FirstName: 'Zed',
            LastName: 'Zure'
        },
        {
            FirstName: 'Zara',
            LastName: 'Zuma'
        }]);
    }));
    it('Filter Function Test', inject(function () {
        $scope.data.PatientName = 'Ali';
        $scope.filter();
        expect($scope.Candidates).toEqual([{
            FirstName: 'Armanda',
            LastName: 'Alice'
        },
        {
            FirstName: 'Arm',
            LastName: 'Ali'
        }]);
        expect($scope.AITab).toBeTruthy();
    }));
});