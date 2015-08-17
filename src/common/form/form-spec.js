describe('Form Controller Test', function () {
    var $scope,
        $httpBackend,
        $localizedNotifications,
        FormCtrl,
        $modalInstance,
        $http,
        $compile,
        auth;

    beforeEach(function () {
        module('cloudmedic.admin');
        module('cloudmedic.resources');
        module(function ($provide) {
            crySetupServiceMocks($provide);
        });

        inject(function ($rootScope, _$compile_, _$httpBackend_, _$http_, $controller, $filter, $state, localizedNotifications, Prescriptions, Users, Password, Registration) {
            $scope = $rootScope.$new();
            $httpBackend = _$httpBackend_;
            $http = _$http_;
            $compile = _$compile_;
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
        console.log("Passing dummy test.");
    }));

    it('should set roles and phone number', function () {
        $scope.data.PhoneNumber = "1234567890";
        $scope.dt = "01/01/1970";
        $scope.data.Role = "Supporter";
            
        $scope.create();

        expect($scope.creator.PhoneNumber).toEqual("(123) 456-7890");
        expect($scope.creator.DOB).toEqual("01/01/1970");
        expect($scope.creator.Roles).toEqual(["Supporter"]);

    });

});