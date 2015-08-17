describe('Form Controller Test', function () {
    var $scope,
        $httpBackend,
        $localizedNotifications,
        FormCtrl,
        $modalInstance;

    beforeEach(function () {
        module('cloudmedic.admin');
        module('cloudmedic.resources');
        module(function ($provide) {
            crySetupServiceMocks($provide);
        });

        inject(function ($rootScope, _$compile_, _$httpBackend_, $controller, $filter, $state, localizedNotifications, Prescriptions, Users, Password, Registration) {
            $scope = $rootScope.$new();
            $httpBackend = _$httpBackend_;
            $localizedNotifications = localizedNotifications;

            FormCtrl = $controller('FormCtrl', {
                '$scope': $scope,
                '$filter': $filter,
                '$state': $state,
                'Users': Users,
                'Password': Password,
                'Registration': Registration,
                'localizedNotifications': $localizedNotifications
            });
        });
    });

    it('should pass a dummy test', inject(function () {
        expect(true).toBeTruthy();
    }));

    it('should set roles and phone number for provider/supporter', function () {
        $scope.data.PhoneNumber = "1234567890";
        $scope.dt = "01/01/1970";
        $scope.data.Role = "Supporter";
            
        $scope.create();

        expect($scope.creator.PhoneNumber).toEqual("(123) 456-7890");
        expect($scope.creator.DOB).toEqual("01/01/1970");
        expect($scope.creator.Roles).toEqual(["Supporter"]);
    });

    it('should set DOB and phone number for patient registration', function () {

        $scope.dt = "04/05/2006";
        $scope.data.PhoneNumber = "6191234567";

        $scope.register();

        expect($scope.registration.DOB).toEqual("04/05/2006");
        expect($scope.registration.PhoneNumber).toEqual("(619) 123-4567");
    });
});