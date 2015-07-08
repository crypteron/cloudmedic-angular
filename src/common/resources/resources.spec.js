describe('Apps Resource Tests', function () {
    // declare the angular variables we'll be using in our tests
    var $httpBackend,
        Apps,
        mockAppsData,
        mockAppData;


    beforeEach(function () {
        // Add custom matching for equals
        this.addMatchers({
            toEqualData: function (expected) {
                return angular.equals(this.actual, expected);
            }
        });

        // load the modules
        module('crypteron.resources');
        module('apps.mocks');
        
        // inject the dependancies
        inject(function (_$httpBackend_, _Apps_, MOCK_APPS_DATA, MOCK_APP_DATA) {
            $httpBackend = _$httpBackend_;
            Apps = _Apps_;
            mockAppsData = MOCK_APPS_DATA;
            mockAppData = MOCK_APP_DATA;
        });
    });

    it('should get multiple Apps', function () {
        var apps = Apps.query();
        expect(apps).toEqualData([]);
        $httpBackend.expectGET(/\/apps?/).respond(mockAppsData);
        $httpBackend.flush();
        expect(apps).toEqualData(mockAppsData);
    });
    
    it('should get one App', function () {
        var app = Apps.get({ appId: mockAppData.AppId });
        expect(app).toEqualData({});
        $httpBackend.expectGET(new RegExp('/apps/' + mockAppData.AppId)).respond(mockAppData);
        $httpBackend.flush();
        expect(app).toEqualData(mockAppData);
    });

});
