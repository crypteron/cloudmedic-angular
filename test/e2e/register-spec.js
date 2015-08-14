// Registration page spec
describe('registration-page', function () {
    browser.get('#/');

    beforeAll(function () {
        element(by.linkText("Patient registration")).click();
    });

    it("should load", function () {
        expect(browser.getTitle()).toBe('Register | CloudMedic Dashboard');
    });

    describe("username-input", function () {
        afterEach(function () {
            element(by.model('registration.UserName')).clear();
        });

        it("should display error message for invalid length", function () {
            element(by.model('registration.UserName')).sendKeys("a");
            expect(element(by.id('un-invalid-length')).isDisplayed()).toBeTruthy();

            element(by.model('registration.UserName')).sendKeys("bcdefghijklmnopqrstuvwxyz");
            expect(element(by.id('un-invalid-length')).isDisplayed()).toBeTruthy();
        });

        it("should display error message for invalid symbols", function () {
            element(by.model('registration.UserName')).sendKeys("Invalid!@#");

            expect(element(by.id('un-invalid-symbol')).isDisplayed()).toBeTruthy();
        });

        it("should accept valid inputs", function () {
            element(by.model('registration.UserName')).sendKeys("user1");

            expect(element(by.id('un-invalid-length')).isDisplayed()).toBeFalsy();
            expect(element(by.id('un-invalid-symbol')).isDisplayed()).toBeFalsy();
        });
    });

    describe("name-inputs", function () {
        afterEach(function () {
            element(by.model('registration.FirstName')).clear();
            element(by.model('registration.LastName')).clear();
        });

        it("should display error message for invalid first name", function () {
            element(by.model('registration.FirstName')).sendKeys("user1");

            expect(element(by.id("fn-invalid")).isDisplayed()).toBeTruthy();
        });

        it("should display error message for invalid last name", function () {
            element(by.model('registration.LastName')).sendKeys("example1");

            expect(element(by.id("ln-invalid")).isDisplayed()).toBeTruthy();
        });

        it("should accept valid inputs", function () {
            element(by.model('registration.FirstName')).sendKeys("user");
            element(by.model('registration.LastName')).sendKeys("example");

            expect(element(by.id("fn-invalid")).isDisplayed()).toBeFalsy();
            expect(element(by.id("ln-invalid")).isDisplayed()).toBeFalsy();
        });
    });

    describe("password-inputs", function () {
        afterEach(function () {
            element(by.model('registration.Password')).clear();
            element(by.model('registration.ConfirmPassword')).clear();
        });

        it("should display error messages for invalid password", function () {
            element(by.model('registration.Password')).sendKeys("a");

            expect(element(by.id("pw-invalid")).isDisplayed()).toBeTruthy();
        });

        describe("first entry", function () {
            beforeEach(function () {
                element(by.model('registration.Password')).clear();
            });

            it("should check for length", function () {
                element(by.model('registration.Password')).sendKeys("a");

                expect(element(by.id("pw-short")).isDisplayed()).toBeTruthy();
            });

            it("should check for a digit", function () {
                element(by.model('registration.Password')).sendKeys("Password!");

                expect(element(by.id("pw-nodigit")).isDisplayed()).toBeTruthy();
            });

            it("should check for an upper case character", function () {
                element(by.model('registration.Password')).sendKeys("password1!");

                expect(element(by.id("pw-noupper")).isDisplayed()).toBeTruthy();
            });

            it("should check for a lower case character", function () {
                element(by.model('registration.Password')).sendKeys("PASSWORD1!");

                expect(element(by.id("pw-nolower")).isDisplayed()).toBeTruthy();
            });

            it("should check for a special character", function () {
                element(by.model('registration.Password')).sendKeys("Password1");

                expect(element(by.id("pw-nospecial")).isDisplayed()).toBeTruthy();
            });

            it("should accept a valid input", function () {
                element(by.model('registration.Password')).sendKeys("Password1!");

                expect(element(by.id("pw-short")).isDisplayed()).toBeFalsy();
                expect(element(by.id("pw-nodigit")).isDisplayed()).toBeFalsy();
                expect(element(by.id("pw-noupper")).isDisplayed()).toBeFalsy();
                expect(element(by.id("pw-nolower")).isDisplayed()).toBeFalsy();
                expect(element(by.id("pw-nospecial")).isDisplayed()).toBeFalsy();
            });
        });

        it("should match inputs", function () {
            element(by.model('registration.Password')).sendKeys("Password1!");
            element(by.model('registration.ConfirmPassword')).sendKeys("Password1");

            expect(element(by.id("pw-nomatch")).isDisplayed()).toBeTruthy();

            element(by.model('registration.ConfirmPassword')).sendKeys("!");

            expect(element(by.id("pw-nomatch")).isDisplayed()).toBeFalsy();
        });
    })

    describe("phone-number-input", function () {
        afterEach(function () {
            element(by.model('data.PhoneNumber')).clear();
        });

        it("should only allow numbers", function() {
            element(by.model('data.PhoneNumber')).sendKeys("abc");

            expect(element(by.model('data.PhoneNumber')).getAttribute('value')).toEqual("(xxx) xxx-xxxx");
        });

        it("should cap length of input", function () {
            element(by.model('data.PhoneNumber')).sendKeys(" 1234567890123");

            expect(element(by.model('data.PhoneNumber')).getAttribute('value')).toEqual("(123) 456-7890");
        });
    });

    it("should prevent submission until all fields complete", function () {
        var registerBtn = element(by.id("register-btn"));
        expect(registerBtn.isEnabled()).toBeFalsy();

        element(by.model('registration.UserName')).sendKeys("user1");
        expect(registerBtn.isEnabled()).toBeFalsy();

        element(by.model('registration.Email')).sendKeys("user@example.com");
        expect(registerBtn.isEnabled()).toBeFalsy();

        element(by.model('registration.FirstName')).sendKeys("user");
        expect(registerBtn.isEnabled()).toBeFalsy();

        element(by.model('registration.LastName')).sendKeys("example");
        expect(registerBtn.isEnabled()).toBeFalsy();

        element(by.model('registration.Password')).sendKeys("Password1!");
        expect(registerBtn.isEnabled()).toBeFalsy();

        element(by.model('registration.ConfirmPassword')).sendKeys("Password1!");
        expect(registerBtn.isEnabled()).toBeFalsy();

        element(by.model('data.PhoneNumber')).sendKeys(" 1234567890");
        expect(registerBtn.isEnabled()).toBeFalsy();

        element(by.model('dt')).sendKeys("1934-11-01");
        expect(registerBtn.isEnabled()).toBeFalsy();

        element(by.cssContainingText('option', 'Male')).click();
        expect(registerBtn.isEnabled()).toBeTruthy();
    });

    it("should redirect to login page on successful registration", function () {
        element(by.id("register-btn")).click();

        expect(browser.getTitle()).toBe('Login | CloudMedic Dashboard');
    });
});