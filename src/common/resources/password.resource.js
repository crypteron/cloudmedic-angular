angular.module('password.resource', ['ngResource'])
.provider('Password', function () {
    var self = this;
    self.apiUrl = '';
    self.setApiUrl = function (apiUrl) {
        self.apiUrl = apiUrl;
    };

    self.$get = ['$resource', function ($resource) {
        var Password = $resource(self.apiUrl + 'account/ChangePassword', {}, {
            update: { method: 'POST', isArray: false }
        });
        return Password;
    }];
});