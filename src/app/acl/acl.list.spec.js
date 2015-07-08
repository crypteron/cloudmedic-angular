describe('View ACL Controller', function () {
    // declare the angular variables we'll be using across multiple tests
    var $scope,
        $httpBackend,
        ViewAclCtrl,
        key,
        acl,
        aclPermissions,
        mockKeyData,
        mockAclData,
        $modal,
        aceForm,
        Acl;


    beforeEach(function () {
        // load the modules
        module('crypteron.acl.list');       // contains controller we'll be testing
        module('crypteron.resources');  // contains resources that make API requests
        module('crypteron.aclPermissions');
        module('keys.mocks');
        module('acl.mocks');           // mock acl data

        // Override dependency injection for testing
        module(function ($provide) {
            // setup common service stubs (definied in src/app.spec.js)
            crySetupServiceMocks($provide);
        });

        aceForm = {};
        aceForm.$show = jasmine.createSpy();
        aceForm.$cancel = jasmine.createSpy();

        inject(function ($controller, _$httpBackend_, $rootScope, MOCK_ACL_DATA, MOCK_KEY_DATA, Keys, _aclPermissions_, _Acl_, localizedNotifications, _$modal_) {

            $httpBackend = _$httpBackend_;
            $scope = $rootScope.$new();
            $modal = _$modal_;
            aclPermissions = _aclPermissions_;
            Acl = _Acl_;

            // key is required by controller and usually resolved by state provider.  fetch it here instead.
            mockKeyData = MOCK_KEY_DATA;
            key = Keys.get({ keyId: mockKeyData.KeyId });
            $httpBackend.expectGET(new RegExp("/keys/" + mockKeyData.KeyId + '$')).respond(mockKeyData);
            
            mockAclData = MOCK_ACL_DATA;
            acl = Acl.query({ keyId: mockKeyData.KeyId });
            $httpBackend.expectGET(new RegExp("/keys/" + mockKeyData.KeyId + '/acl$')).respond(mockAclData);

            expect(key).toEqualData({});
            expect(acl).toEqualData([]);
            $httpBackend.flush();

            // acl is modified by controller, must check before instantiated
            expect(acl).toEqualData(mockAclData);
            
            // Instantiate controller
            ViewAclCtrl = $controller("ViewAclCtrl", {
                '$scope': $scope,
                'key': key,
                'acl': acl,
                'aclPermissions': aclPermissions,
                'Acl': Acl,                
                'localizedNotifications': localizedNotifications,
                '$modal': $modal
            });
        });
        
    });

    // Ensure all tests end with no outstanding expectations or http requests
    afterEach(function () {
        $httpBackend.verifyNoOutstandingExpectation();
        $httpBackend.verifyNoOutstandingRequest();
    });
    
    it('should load key data from Key service', function () {
        expect(key).toEqualData(mockKeyData);
    });

    it('should expand acl permissions', inject(function (ACL_PERMISSIONS) {
        // Loop through each ACE
        angular.forEach($scope.acl, function (ace) {
            // Confirm permission list was created with correct length
            expect(ace.permissionList.length).toEqual(ACL_PERMISSIONS.length);

            // Loop through each permission entry
            angular.forEach(ace.permissionList, function (permission, i) {
                // confirm name and label of permission
                expect(permission.name).toEqual(ACL_PERMISSIONS[i].name);
                expect(permission.label).toEqual(ACL_PERMISSIONS[i].label);

                // confirm virtual value function works as expected
                if (ace.Permissions & ACL_PERMISSIONS[i].value) {
                    // check getter
                    expect(permission.value()).toEqual(true);

                    // check setter
                    permission.value(false);
                    expect(permission.value()).toEqual(false);
                } else {
                    // check getter
                    expect(permission.value()).toEqual(false);

                    // check setter
                    permission.value(true);
                    expect(permission.value()).toEqual(true);
                }
            });
        });
    }));

    it('should revert ACE permissions changes on cancel', function () {
        // grab the first ACE
        var ace = $scope.acl[0];
        // confirm its first permission is true
        expect(ace.permissionList[0].value()).toEqual(true);
        // simulate the showForm callback of the editable directive
        $scope.copyPermissions(ace);
        // change the permission
        ace.permissionList[0].value(false);
        expect(ace.permissionList[0].value()).toEqual(false);
        // simulate the onCancel callback of the editable directive
        $scope.revertPermissions(ace);
        // confirm first permission is true again
        expect(ace.permissionList[0].value()).toEqual(true);
    });

    var modifyAndSaveAce = function (ace) {
        // confirm its first permission is true
        expect(ace.permissionList[0].value()).toEqual(true);
        // simulate the showForm callback of the editable directive
        $scope.copyPermissions(ace);
        // simulate the beforeSave callback of the editable directive
        $scope.copyRole(ace);

        // change the permission and role
        ace.permissionList[0].value(false);
        expect(ace.permissionList[0].value()).toEqual(false);
        ace.RoleId = "New Role";

        // simulate the afterSave callback of the editable directive
        $scope.saveAce(ace, aceForm);
    };

    it('should revert ACE permissions and role on failed update', function () {
        // grab the first ace
        var ace = $scope.acl[0];
        
        var oldRoleId = ace.RoleId;
        var oldPermissions = ace.Permissions;

        modifyAndSaveAce(ace);

        // expect put and respond with error
        $httpBackend.expectPUT(new RegExp('/keys/' + mockKeyData.KeyId + '/acl/' + mockAclData[0].AceId + '$'), ace).respond(400);
        $httpBackend.flush();

        // confirm revert
        expect(ace.RoleId).toEqual(oldRoleId);
        expect(ace.permissionList[0].value()).toEqual(true);
        expect(ace.Permissions).toEqual(oldPermissions);
        expect(aceForm.$show).not.toHaveBeenCalled();
    });

    it('should update ACE permissions and role on successful update', function () {
        // grab the first ace
        var ace = $scope.acl[0];

        modifyAndSaveAce(ace);

        var response = angular.copy(mockAclData[0]);
        response.RoleId = ace.RoleId;
        response.Permissions = ace.Permissions;

        // expect put and respond with above response
        $httpBackend.expectPUT(new RegExp('/keys/' + mockKeyData.KeyId + '/acl/' + mockAclData[0].AceId + '$'), ace).respond(response);
        $httpBackend.flush();

        // confirm update and expanded permissions
        expect(ace.RoleId).toEqual(response.RoleId);        
        expect(ace.Permissions).toEqual(response.Permissions);
        expect(ace.permissionList[0].value()).toEqual(false);
        expect(aceForm.$show).not.toHaveBeenCalled();
    });

    it('should add and remove new ACE on new and cancel button presses', function () {
        // add new ace and confirm it was added and its permissions expanded
        $scope.addAce();
        expect($scope.acl.length).toEqual(mockAclData.length + 1);
        var newAce = $scope.acl[$scope.acl.length - 1];
        expect(newAce.AceId).toEqual(0);
        expect(newAce.KeyEntityId).toEqual(mockKeyData.KeyId);
        expect(newAce.RoleId).toEqual('');
        expect(newAce.Permissions).toEqual(0);
        expect(newAce.permissionList[0].value()).toEqual(false);

        // cancel edit
        $scope.cancelEdit(newAce, aceForm, $scope.acl.length - 1);
        expect($scope.acl.length).toEqual(mockAclData.length);
        expect(aceForm.$cancel).toHaveBeenCalled();
    });

    it('should show form on new ACE save failure', function () {
        $scope.addAce();
        var newAce = $scope.acl[$scope.acl.length - 1];
        $scope.saveAce(newAce, aceForm);
        $httpBackend.expectPOST(new RegExp('/keys/' + mockKeyData.KeyId + '/' + 'acl$'), [newAce]).respond(400);
        $httpBackend.flush();
        expect(aceForm.$show).toHaveBeenCalled();
        expect(newAce.AceId).toEqual(0);
    });

    it('should update AceId on successful save', function () {
        $scope.addAce();
        var newAce = $scope.acl[$scope.acl.length - 1];
        newAce.RoleId = "New Role";
        newAce.permissionList[0].value(true);
        $scope.saveAce(newAce, aceForm);

        var response = [{
            AceId: 999,
            RoleId: "New Role",
            Permissions: aclPermissions.permissions[0].value,
            KeyEntityId: mockKeyData.KeyId
        }];

        $httpBackend.expectPOST(new RegExp('/keys/' + mockKeyData.KeyId + '/' + 'acl$'), [newAce]).respond(response);
        $httpBackend.flush();
        expect(aceForm.$show).not.toHaveBeenCalled();
        expect(newAce.AceId).toEqual(999);
        expect(newAce.permissionList[0].value()).toEqual(true);
    });

    it("should not delete Ace on modal dismiss", function () {
        spyOn($modal, 'open').andCallThrough();
        spyOn(Acl, 'remove').andCallThrough();
        var ace = $scope.acl[0];
        $scope.removeAce(ace, 0);
        expect($modal.open).toHaveBeenCalled();
        $modal.dismiss();
        expect($scope.acl.length).toEqual(mockAclData.length);
        expect(Acl.remove).not.toHaveBeenCalled();        
    });

    it("should delete Ace on modal close", function () {
        spyOn(Acl, 'remove').andCallThrough();
        var ace = $scope.acl[0];
        $scope.removeAce(ace, 0);
        $modal.close();
        $httpBackend.expectDELETE(new RegExp('/keys/' + mockKeyData.KeyId + '/acl/' + mockAclData[0].AceId)).respond(200);
        $httpBackend.flush();
        expect($scope.acl.length).toEqual(mockAclData.length - 1);
        expect(Acl.remove).toHaveBeenCalled();
    });


});
