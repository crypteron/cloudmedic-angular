describe('Profile Controller', function () {
    var $scope,
        $httpBackend,
        $localizedNotifications,
        ProfileCtrl;
    beforeEach(function () {
        module('cloudmedic.profile.update');
        module('cloudmedic.resources');

        module(function ($provide) {
            crySetupServiceMocks($provide);
        });

        inject(function ($rootScope, _$httpBackend_, $controller, $state, profile, localizedNotifications) {
            $scope = $rootScope.$new();
            $scope.form = { $setPristine: function () { } };
            $httpBackend = _$httpBackend_;
            $localizedNotifications = localizedNotifications;
            ProfileCtrl = $controller('ProfileCtrl', {
                '$scope': $scope,
                '$state': $state,
                'profile':profile,
                'localizedNotifications': $localizedNotifications
            });
        });
    });

    it('Profile Reset Test', function () {
        $scope.profile.Username = 'Patient';
        $scope.profile.Email = 'mock@mock.com';
        $scope.profile.LastName = 'mock';
        $scope.profile.FirstName = 'mock';
        $scope.resetProfile();
        expect($scope.profile).toEqual({
            Username: 'Doc',
            Email: 'Example@cloudmedic.com',
            LastName: 'User',
            FirstName: 'Example'
        });
    });
});