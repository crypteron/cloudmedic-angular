describe('Prescription Add Controller', function () {
    var $scope,
        $httpBackend,
        $localizedNotifications,
        PreAddCtrl;
    beforeEach(function () {
        module('cloudmedic.prescriptions');
        module('cloudmedic.resources');
        module(function ($provide) {
            cmSetupServiceMocks($provide);
        });

        inject(function ($rootScope, _$httpBackend_, $controller, $state, $modalInstance, $filter, auth,
            Prescriptions, Users, localizedNotifications, Candidates, MedId, MedName) {
            $scope = $rootScope.$new();
            $httpBackend = _$httpBackend_;
            $localizedNotifications = localizedNotifications;
            PreAddCtrl = $controller('AddPrescriptionsCtrl', {
                '$scope': $scope,
                '$modalInstance': $modalInstance,
                'MedId': MedId,
                'MedName': MedName,
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


    it('should set the correct end date and patient id', inject(function () {
        $scope.data.PatientId[0] = "random-guid";
        $scope.dt = "07/15/1952";
        $scope.data.Duration = 5;
        $scope.data.Units = 1;
        $scope.Creator.Dosage = "1";
        $scope.Creator.Frequency = "111";
        $scope.Creator.Notes = "1";

        $scope.create();
        expect($scope.Creator.Medicationid).toEqual('12345');
        expect($scope.Creator.MedicationName).toEqual('TestMed');
        expect($scope.Creator.EndDate).toEqual('7/20/1952 7:00:00 AM');
        expect($scope.Creator.PatientId).toEqual("random-guid");
    }));
});