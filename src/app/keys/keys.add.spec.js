
describe('Add Key Controller', function () {
    // declare the angular variables we'll be using across multiple tests
    var $scope,
        $httpBackend,
        AddKeyCtrl,
        $stateParams,
        mockKeyData,
        $modalInstance,
        newKey;
    
    beforeEach(function () {
        // load the modules
        module('crypteron.keys.add');       // contains controller we'll be testing
        module('keys.mocks');           // mock key data

        // Override dependency injection for testing
        module(function ($provide) {
            // setup common service stubs (definied in src/app.spec.js)
            crySetupServiceMocks($provide);

            $provide.factory('$stateParams', function (MOCK_KEY_NEW_DATA) {
                mockKeyData = MOCK_KEY_NEW_DATA;
                return {
                    appId: mockKeyData.AppId
                };
            });
        });

        // inject the dependancies
        inject(function ( $controller, _$httpBackend_, $rootScope, Apps, Keys, $stateParams,  $state, localizedNotifications, _$modalInstance_) {

            $httpBackend = _$httpBackend_;
            $scope = $rootScope.$new();
            $modalInstance = _$modalInstance_;

            newKey = {
                AppId: mockKeyData.AppId,
                SecPartId: mockKeyData.SecPartId,
                Description: mockKeyData.Description
            };
            
            spyOn($modalInstance, 'close');
            spyOn($modalInstance, 'dismiss');

            
            // Instantiate controller
            AddKeyCtrl = $controller("AddKeyCtrl", {
                '$scope': $scope,
                '$state': $state,
                '$stateParams': $stateParams,
                'Keys': Keys,
                '$modalInstance': $modalInstance,
                'localizedNotifications': localizedNotifications
            });
        });
    });

    // Ensure all tests end with no outstanding expectations or http requests
    afterEach(function () {
        $httpBackend.verifyNoOutstandingExpectation();
        $httpBackend.verifyNoOutstandingRequest();
    });

    it('should save new keys and close on success', function () {
        expect($scope.key).toEqualData({
            AppId: mockKeyData.AppId
        });

        $scope.key.SecPartId = mockKeyData.SecPartId;
        $scope.key.Description = mockKeyData.Description;
        $scope.save();
        $httpBackend.expectPOST(/keys$/, newKey)
            .respond(mockKeyData);
        $httpBackend.flush();
        expect($scope.key).toEqualData(mockKeyData);
        expect($modalInstance.close).toHaveBeenCalled();
    });

    it('should not close on failure', function () {
        expect($scope.key).toEqualData({
            AppId: mockKeyData.AppId
        });

        $scope.key.SecPartId = mockKeyData.SecPartId;
        $scope.key.Description = mockKeyData.Description;
        
        $scope.save();
        $httpBackend.expectPOST(/keys$/, newKey)
            .respond(400);
        $httpBackend.flush();
        expect($scope.key).toEqualData(newKey);
        expect($modalInstance.close).not.toHaveBeenCalled();
    });
});
