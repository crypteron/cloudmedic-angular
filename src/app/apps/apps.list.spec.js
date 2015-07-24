describe('Apps List Controller', function () {
    // declare the angular variables we'll be using in our tests
    var $scope,
        $httpBackend,
        AppsListCtrl,
        apps,
        mockAppsData;

    
    beforeEach(function () {
        // load the modules
        module('cloudmedic.apps.list');
        module('cloudmedic.resources');
        module('apps.mocks');

        // Override dependency injection for testing
        module(function ($provide) {
            // setup common service stubs (definied in src/app.spec.js)
            crySetupServiceMocks($provide);
        });

        // inject the dependancies
        inject( function ($controller, _$httpBackend_, $rootScope, Apps, $state, MOCK_APPS_DATA) {
            $httpBackend = _$httpBackend_;
            $scope = $rootScope.$new();

            // Controller expects apps to be resolved by state controller.  Fetch data now.
            mockAppsData = MOCK_APPS_DATA;
            $httpBackend.when("GET", /\/apps$/).respond(mockAppsData);
            apps = Apps.query();
            
            // Instantiate controller
            AppsListCtrl = $controller("AppsListCtrl",{
                    '$scope': $scope,
                    'apps': apps,
                    '$state': $state
                });
        });
    });

    // Ensure all tests end with no outstanding expectations or http requests
    afterEach(function () {
        $httpBackend.verifyNoOutstandingExpectation();
        $httpBackend.verifyNoOutstandingRequest();
    });

    it('should load Apps from Apps service', function () {
        expect($scope.apps).toEqualData([]);
        $httpBackend.expectGET(/\/apps$/).respond(mockAppsData);
        $httpBackend.flush();
        expect($scope.apps).toEqualData(mockAppsData);
    });
});
