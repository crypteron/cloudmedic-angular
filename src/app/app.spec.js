// Helper method used by many tests to replace non essential services with stubs
// TODO: Add Jasmine Spies if needed
var crySetupServiceMocks = function (provide) {
    provide.value('$state', {
        go: function () { }
    });

    provide.value('user', {
        FirstName: 'John',
        LastName: 'Doe',
        UserId: '123'
    });
    provide.value('medications', {
        get: function () { }
    });
    provide.value('localizedNotifications', {
        removeForCurrent: function () { },
        addForCurrent: function () { },
        addForNext: function () {
        },
        addSticky: function () { },
        get: function () { },
        remove: function () { },
        removeAll: function () { }
    });

    provide.value('localizedMessages', {
        get: function () { },
        add: function () { },
        addIfNotExists: function () { }
    });

    // setup custom modal stub that lets us simulate open and close operations
    provide.factory('$modal', function ($q) {
        var deferred = $q.defer();

        return {
            open: function (options) {                
                return {
                    result: deferred.promise
                };
            },
            close: function () {
                deferred.resolve();
            },
            dismiss: function () {
                deferred.reject();
            }
        };
    });

    provide.factory('$modalInstance', function ($q) {
        var deferred = $q.defer();

        return {
            result: deferred.promise,

            close: function () {
                deferred.resolve();
            },
            dismiss: function () {
                deferred.reject();
            }
        };
    });

    
};

beforeEach(function () {
    // Add custom matching for equals
    this.addMatchers({
        toEqualData: function (expected) {
            return angular.equals(this.actual, expected);
        }
    });
});

describe('AppCtrl', function () {
    describe('isCurrentUrl', function () {
    var AppCtrl, $location, $scope;

    beforeEach( module( 'cloudmedic' ) );

    beforeEach( inject( function( $controller, _$location_, $rootScope ) {
      $location = _$location_;
      $scope = $rootScope.$new();
      AppCtrl = $controller( 'AppCtrl', { $location: $location, $scope: $scope });
    }));

    it( 'should pass a dummy test', inject( function() {
      expect( true ).toBeTruthy();
    }));
  });
});
