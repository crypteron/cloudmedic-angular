// Profile page spec
describe("profile-page", function () {
    //browser.get('#/');

    beforeAll(function () {
        // Login as an provider
        element(by.model("loginData.username")).sendKeys("user1");
        element(by.model("loginData.password")).sendKeys("Password1?");
        element(by.buttonText("Login to your account")).click();
        element(by.linkText("Profile")).click();
    });

    it("should load", function () {
        expect(browser.getTitle()).toBe('Profile | CloudMedic Dashboard');
    });

    it("should default to current values", function () {
        var username = element(by.model("profile.Username")).getAttribute('value').then(function (data) {
            expect(data).toEqual("user1");
        });

        var firstname = element(by.model("profile.FirstName")).getAttribute('value').then(function (data) {
            expect(data).toEqual("User");
        });

        var lastname = element(by.model("profile.LastName")).getAttribute('value').then(function (data) {
            expect(data).toEqual("Example");
        });

        var email = element(by.model("profile.Email")).getAttribute('value').then(function (data) {
            expect(data).toEqual("user@example.com");
        });
    });

    describe("username-input", function () {
        beforeEach(function () {
            element(by.model('profile.Username')).clear();
        });

        it("should display error message for invalid length", function () {
            element(by.model('profile.Username')).sendKeys("a");
            expect(element(by.id('un-invalid-length')).isDisplayed()).toBeTruthy();

            element(by.model('profile.Username')).sendKeys("bcdefghijklmnopqrstuvwxyz");
            expect(element(by.id('un-invalid-length')).isDisplayed()).toBeTruthy();
        });

        it("should display error message for invalid symbols", function () {
            element(by.model('profile.Username')).sendKeys("Invalid!@#");

            expect(element(by.id('un-invalid-symbol')).isDisplayed()).toBeTruthy();
        });

        it("should accept valid inputs", function () {
            element(by.model('profile.Username')).sendKeys("User1");

            expect(element(by.id('un-invalid-length')).isDisplayed()).toBeFalsy();
            expect(element(by.id('un-invalid-symbol')).isDisplayed()).toBeFalsy();
        });
    });

    describe("name-inputs", function () {
        beforeEach(function () {
            element(by.model('profile.FirstName')).clear();
            element(by.model('profile.LastName')).clear();
        });

        it("should display error message for invalid first name", function () {
            element(by.model('profile.FirstName')).sendKeys("user1");

            expect(element(by.id("fn-invalid")).isDisplayed()).toBeTruthy();
        });

        it("should display error message for invalid last name", function () {
            element(by.model('profile.LastName')).sendKeys("example1");

            expect(element(by.id("ln-invalid")).isDisplayed()).toBeTruthy();
        });

        it("should accept valid inputs", function () {
            element(by.model('profile.FirstName')).sendKeys("User");
            element(by.model('profile.LastName')).sendKeys("Example");

            expect(element(by.id("fn-invalid")).isDisplayed()).toBeFalsy();
            expect(element(by.id("ln-invalid")).isDisplayed()).toBeFalsy();
        });
    });

    describe("reset-button", function () {
        it("should restore input field values to defaults", function () {
            element(by.id("reset-update-form")).click();

            var username = element(by.model("profile.Username")).getAttribute('value').then(function (data) {
                expect(data).toEqual("user1");
            });

            var firstname = element(by.model("profile.FirstName")).getAttribute('value').then(function (data) {
                expect(data).toEqual("User");
            });

            var lastname = element(by.model("profile.LastName")).getAttribute('value').then(function (data) {
                expect(data).toEqual("Example");
            });

            var email = element(by.model("profile.Email")).getAttribute('value').then(function (data) {
                expect(data).toEqual("user@example.com");
            });
        });

        it("should be hidden before any edits", function () {
            expect(element(by.id("reset-update-form")).isDisplayed()).toBeFalsy();
        });
    });

    describe("change-password-form", function () {
        it("should open on selecting button", function () {
            element(by.linkText("Change Password...")).click();
            expect(element.all(by.cssContainingText(".modal-title", "Change Password")).count()).toBeGreaterThan(0);
        });

        describe("new-password-inputs", function () {
            afterEach(function () {
                element(by.model('password.NewPassword')).clear();
                element(by.model('password.ConfirmPassword')).clear();
            });

            it("should display error messages for invalid password", function () {
                element(by.model('password.NewPassword')).sendKeys("a");

                expect(element(by.id("pw-invalid")).isDisplayed()).toBeTruthy();
            });

            describe("first entry", function () {
                beforeEach(function () {
                    element(by.model('password.NewPassword')).clear();
                });

                it("should check for length", function () {
                    element(by.model('password.NewPassword')).sendKeys("a");

                    expect(element(by.id("pw-short")).isDisplayed()).toBeTruthy();
                });

                it("should check for a digit", function () {
                    element(by.model('password.NewPassword')).sendKeys("Password!");

                    expect(element(by.id("pw-nodigit")).isDisplayed()).toBeTruthy();
                });

                it("should check for an upper case character", function () {
                    element(by.model('password.NewPassword')).sendKeys("password1!");

                    expect(element(by.id("pw-noupper")).isDisplayed()).toBeTruthy();
                });

                it("should check for a lower case character", function () {
                    element(by.model('password.NewPassword')).sendKeys("PASSWORD1!");

                    expect(element(by.id("pw-nolower")).isDisplayed()).toBeTruthy();
                });

                it("should check for a special character", function () {
                    element(by.model('password.NewPassword')).sendKeys("Password1");

                    expect(element(by.id("pw-nospecial")).isDisplayed()).toBeTruthy();
                });

                it("should accept a valid input", function () {
                    element(by.model('password.NewPassword')).sendKeys("Password1!");

                    expect(element(by.id("pw-short")).isDisplayed()).toBeFalsy();
                    expect(element(by.id("pw-nodigit")).isDisplayed()).toBeFalsy();
                    expect(element(by.id("pw-noupper")).isDisplayed()).toBeFalsy();
                    expect(element(by.id("pw-nolower")).isDisplayed()).toBeFalsy();
                    expect(element(by.id("pw-nospecial")).isDisplayed()).toBeFalsy();
                });
            });

            it("should match inputs", function () {
                element(by.model('password.NewPassword')).sendKeys("Password1!");
                element(by.model('password.ConfirmPassword')).sendKeys("Password1");

                expect(element(by.id("pw-nomatch")).isDisplayed()).toBeTruthy();

                element(by.model('password.ConfirmPassword')).sendKeys("!");

                expect(element(by.id("pw-nomatch")).isDisplayed()).toBeFalsy();
            });
        });

        it("should prevent submitting until complete", function () {
            var pwButton = element(by.buttonText("Change Password"));
            expect(pwButton.isEnabled()).toBeFalsy();

            element(by.model('password.OldPassword')).sendKeys("Password1?");
            expect(pwButton.isEnabled()).toBeFalsy();

            element(by.model('password.NewPassword')).sendKeys("Password1!");
            expect(pwButton.isEnabled()).toBeFalsy();

            element(by.model('password.ConfirmPassword')).sendKeys("Password1!");
            expect(pwButton.isEnabled()).toBeTruthy();
        });

        it("should close on successful submission", function () {
            element(by.buttonText("Change Password")).click();
            expect(element.all(by.cssContainingText(".modal-title", "Change Password")).count()).toBe(0);
        });
    });

    it("should prevent submitting until all fields valid", function () {
        var updateBtn = element(by.id("update-profile-btn"));
        expect(updateBtn.isEnabled()).toBeTruthy();

        element(by.model("profile.Username")).clear();
        expect(updateBtn.isEnabled()).toBeFalsy();
        element(by.model("profile.Username")).sendKeys("User1");

        element(by.model("profile.FirstName")).clear();
        expect(updateBtn.isEnabled()).toBeFalsy();
        element(by.model("profile.FirstName")).sendKeys("Person");

        element(by.model("profile.LastName")).clear();
        expect(updateBtn.isEnabled()).toBeFalsy();
        element(by.model("profile.LastName")).sendKeys("Sample");

        element(by.model("profile.Email")).clear();
        expect(updateBtn.isEnabled()).toBeFalsy();
        element(by.model("profile.Email")).sendKeys("person@sample.com");

        expect(updateBtn.isEnabled()).toBeTruthy();
    });

    it("should reload the page after submission", function () {
        element(by.id("update-profile-btn")).click();

        var username = element(by.model("profile.Username")).getAttribute('value').then(function (data) {
            expect(data).toEqual("User1");
        });

        var firstname = element(by.model("profile.FirstName")).getAttribute('value').then(function (data) {
            expect(data).toEqual("Person");
        });

        var lastname = element(by.model("profile.LastName")).getAttribute('value').then(function (data) {
            expect(data).toEqual("Sample");
        });

        var email = element(by.model("profile.Email")).getAttribute('value').then(function (data) {
            expect(data).toEqual("person@sample.com");
        });
    });

    it("should log out", function () {
        element(by.linkText("Logout")).click();
        expect(browser.getTitle()).toBe('Login | CloudMedic Dashboard');
    });
});