

describe('Apps Detail Controller', function () {
    // declare the angular variables we'll be using in our tests
    var $scope,
        $httpBackend,
        AppsDetailCtrl,
        app,
        keys,
        mockAppData,
        mockKeysData;

    beforeEach(function () {
        // load the modules
        module('crypteron.apps.detail');    // contains controller we'll be testing
        module('crypteron.resources');      // contains resources for API calls
        module('apps.mocks');               // contains mock app data
        module('keys.mocks');               // contains mock key data
        

        // Override dependency injection for testing
        module(function ($provide) {
            // setup common service stubs (definied in src/app.spec.js)
            crySetupServiceMocks($provide);
        });


        // inject the dependancies
        inject(function ($controller, _$httpBackend_, $rootScope, Apps, Keys, $state, MOCK_APP_DATA, MOCK_KEYS_DATA, localizedNotifications) {
            $httpBackend = _$httpBackend_;            
            $scope = $rootScope.$new();

            // controller expects state provider to resolve app data
            mockAppData = MOCK_APP_DATA;
            app = Apps.get({ appId: mockAppData.AppId });
            $httpBackend.expectGET(new RegExp('/apps/' + mockAppData.AppId)).respond(mockAppData);

            // controller expects state provider to resolve keys data
            mockKeysData = MOCK_KEYS_DATA;            
            keys = Keys.query({ appId: mockAppData.AppId });
            $httpBackend.expectGET(new RegExp("keys\\?appId=" + mockAppData.AppId)).respond(mockKeysData);


            // custom one time use stub
            var auth = {
                status: null
            };

            // instantiate controller
            AppsDetailCtrl = $controller("AppsDetailCtrl", {
                '$scope': $scope,
                'app': app,
                '$state': $state,
                'keys': keys,
                'localizedNotifications': localizedNotifications,
                'auth': auth                
            });
        });
    });

    // Ensure all tests end with no outstanding expectations or http requests
    afterEach(function () {
        $httpBackend.verifyNoOutstandingExpectation();
        $httpBackend.verifyNoOutstandingRequest();
    });


    it('should toggle secret hidden properly', function () {
        $httpBackend.flush();
        expect($scope.data.secretHidden).toBeTruthy();
        $scope.toggleSecret();
        expect($scope.data.secretHidden).toBeFalsy();    
    });

    it('should load app and key data from App and Keys service', function () {
        expect($scope.app).toEqualData({});
        expect($scope.keys).toEqualData([]);

        $httpBackend.flush();

        expect($scope.app).toEqualData(mockAppData);
        expect($scope.keys).toEqualData(mockKeysData);
    });

    it('should restore app on failed update', function () {
        // Fetch starting data
        $httpBackend.flush();

        // simulate beforeSave operation of editable directive        
        $scope.copyApp();
        $scope.app.AppName = "Invalid Name";
        var oldName = mockAppData.AppName;
        mockAppData.AppName = $scope.app.AppName;

        // simulate failed update
        $scope.renameApp();
        $httpBackend.expectPUT(new RegExp('/apps/' + mockAppData.AppId), mockAppData).respond(400);
        $httpBackend.flush();
        expect($scope.app.AppName).toEqual(oldName);
    });
});
