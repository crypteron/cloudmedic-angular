
describe('View Keys Controller', function () {
    // declare the angular variables we'll be using across multiple tests
    var $scope,
        $httpBackend,
        ViewKeyCtrl,
        app,
        key,
        mockKeyData,
        $modal;

    
    beforeEach(function () {
        // load the modules
        module('cloudmedic.keys.detail');       // contains controller we'll be testing
        module('cloudmedic.resources');  // contains resources that make API requests
        module('keys.mocks');           // mock key data
        
        // Override dependency injection for testing
        module(function ($provide) {
            // setup common service stubs (definied in src/app.spec.js)
            crySetupServiceMocks($provide);
        });

        // inject the dependancies
        inject(function ($controller, _$httpBackend_, $rootScope, Apps, Keys, MOCK_KEY_DATA, $state, localizedNotifications, localizedMessages, _$modal_) {
           
            $httpBackend = _$httpBackend_;
            $scope = $rootScope.$new();
            $modal = _$modal_;

            // key is required by controller and usually resolved by state provider.  fetch it here instead.
            mockKeyData = MOCK_KEY_DATA;
            key = Keys.get({ keyId: mockKeyData.KeyId });
            $httpBackend.expectGET(new RegExp("/keys/" + mockKeyData.KeyId + '$')).respond(mockKeyData);

            // Instantiate controller
            ViewKeyCtrl = $controller("ViewKeyCtrl", {
                '$scope': $scope,
                'key': key,
                '$state': $state,
                '$modal': $modal,
                'localizedMessages': localizedMessages,
                'localizedNotifications': localizedNotifications
            });
        });
    });

    // Ensure all tests end with no outstanding expectations or http requests
    afterEach(function () {
        $httpBackend.verifyNoOutstandingExpectation();
        $httpBackend.verifyNoOutstandingRequest();
    });

    it('should load key data from Key service', function () {
        expect($scope.key).toEqualData({});
        $httpBackend.flush();
        expect($scope.key).toEqualData(mockKeyData);
    });
    
    it('should restore Key on failed update', function () {
        // Fetch starting data
        $httpBackend.flush();

        // simulate beforeSave operation of editable directive        
        $scope.copyKey();
        $scope.key.Description = "Some new description";
        var oldDescription = mockKeyData.Description;
        mockKeyData.Description = $scope.key.Description;

        // simulate failed update
        $scope.updateKey();
        $httpBackend.expectPUT(new RegExp('/keys/' + mockKeyData.KeyId + '$'), mockKeyData).respond(400);
        $httpBackend.flush();
        expect($scope.key.Description).toEqual(oldDescription);
    });

    it('refresh key with dismiss should not do anything', function () {
        // Fetch starting data
        $httpBackend.flush();

        // refresh key with modal dismiss should do nothing
        $scope.refreshKey();
        $modal.dismiss();
        $httpBackend.verifyNoOutstandingRequest();
    });

    it('refresh key with close should call create API', function () {
        // Fetch starting data
        $httpBackend.flush();
        
        $scope.refreshKey();
        $modal.close();
        $httpBackend.expectPOST(new RegExp('/keys\\?updateExisting=1$'), mockKeyData).respond(200);
        $httpBackend.flush();
    });

    it('delete key with dismiss should do nothing', function () {
        $httpBackend.flush();
        $scope.deleteKey();
        $modal.dismiss();
        $httpBackend.verifyNoOutstandingRequest();
    });

    it('delete key method should call delete api', function () {
        $httpBackend.flush();
        $scope.deleteKey();
        $modal.close();
        $httpBackend.expectDELETE(new RegExp('/keys/' + mockKeyData.KeyId + '$')).respond(200);
        $httpBackend.flush();
    });

    
});
