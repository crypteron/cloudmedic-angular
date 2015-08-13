// Admin page spec
xdescribe("admin-page", function () {
    //browser.get('#/');
    var generateTests;
    var removeTests;

    beforeAll(function () {
        // Login as an administrator
        element(by.model("loginData.username")).sendKeys("administrator");
        element(by.model("loginData.password")).sendKeys("cloudmedicrocks");
        element(by.buttonText("Login to your account")).click();

        generateTests = function () {
            var testNames = ["Mike", "John"];
            for (var i = 0; i < 2; i++) {
                var randNo = Math.floor((Math.random() * 10000) + 1);

                element(by.id("provider-tab")).click();
                element(by.buttonText("Add Physician/Nurse")).click();
                element(by.model('creator.Email')).sendKeys(testNames[i] + "Miller@example.com");
                element(by.model('creator.FirstName')).sendKeys(testNames[i]);
                element(by.model('creator.LastName')).sendKeys("Miller");
                element(by.model('data.PhoneNumber')).sendKeys(" 1234567890");
                element(by.model('dt')).sendKeys("1934-11-01");
                element(by.cssContainingText('option', 'Male')).click();
                element(by.cssContainingText('option', 'Physician')).click();
                element(by.id("register-btn")).click();
            }

            for (var j = 0; j < 2; j++) {
                var randNo = Math.floor((Math.random() * 10000) + 1);

                element(by.id("supporter-tab")).click();
                element(by.buttonText("Add Supporter")).click();
                element(by.model('creator.Email')).sendKeys(testNames[j] + "Johnson@example.com");
                element(by.model('creator.FirstName')).sendKeys(testNames[j]);
                element(by.model('creator.LastName')).sendKeys("Johnson");
                element(by.model('data.PhoneNumber')).sendKeys(" 1234567890");
                element(by.model('dt')).sendKeys("1934-11-01");
                element(by.cssContainingText('option', 'Male')).click();
                element(by.id("register-btn")).click();
            }
        }

        removeTests = function () {
            element(by.id("provider-tab")).click();
            element(by.id("provider-list")).all(by.cssContainingText("tbody tr", "MikeMiller@example.com")).get(0).element(by.id("remove-provider")).click();
            element(by.buttonText("Yes, delete User!")).click();

            element(by.id("provider-tab")).click();
            element(by.id("provider-list")).all(by.cssContainingText("tbody tr", "JohnMiller@example.com")).get(0).element(by.id("remove-provider")).click();
            element(by.buttonText("Yes, delete User!")).click();

            element(by.id("supporter-tab")).click();
            element(by.id("supporter-list")).all(by.cssContainingText("tbody tr", "MikeJohnson@example.com")).get(0).element(by.id("remove-supporter")).click();
            element(by.buttonText("Yes, delete User!")).click();

            element(by.id("supporter-tab")).click();
            element(by.id("supporter-list")).all(by.cssContainingText("tbody tr", "JohnJohnson@example.com")).get(0).element(by.id("remove-supporter")).click();
            element(by.buttonText("Yes, delete User!")).click();
        }
    });

    it("should load", function () {
        expect(browser.getTitle()).toBe('Admin | CloudMedic Dashboard');
    });

    describe("providers-tab", function () {
        var providerEmail;

        it("should be hidden initially", function () {
            expect(element(by.id("provider-list")).isDisplayed()).toBeFalsy();
        })

        it("should load when selected", function () {
            element(by.id("provider-tab")).click();
            expect(element(by.id("provider-list")).isDisplayed()).toBeTruthy();
        });

        describe("providers-table", function () {
            it("should be sortable by name", function () {
                element(by.id("provider-list")).element(by.linkText("Full Name")).click();
                var string1 = element(by.id("provider-list")).all(by.repeater("provider in users")).get(0).getText();
                var string2 = element(by.id("provider-list")).all(by.repeater("provider in users")).get(1).getText();
                protractor.promise.all([string1, string2]).then(function (data) {
                    expect((data[0].toLowerCase())).toBeGreaterThan(data[1].toLowerCase());
                });

                element(by.id("provider-list")).element(by.linkText("Full Name")).click();
                var string3 = element(by.id("provider-list")).all(by.repeater("provider in users")).get(0).getText();
                var string4 = element(by.id("provider-list")).all(by.repeater("provider in users")).get(1).getText();
                protractor.promise.all([string3, string4]).then(function (data) {
                    expect((data[0].toLowerCase())).toBeLessThan(data[1].toLowerCase());
                });
            });

            it("should be sortable by username", function () {
                element(by.id("provider-list")).element(by.linkText("UserName")).click();
                var r1 = element(by.id("provider-list")).all(by.repeater("provider in users")).get(0);
                var string1 = r1.all(by.tagName('td')).get(1).getText();
                var r2 = element(by.id("provider-list")).all(by.repeater("provider in users")).get(1);
                var string2 = r2.all(by.tagName('td')).get(1).getText();
                protractor.promise.all([string1, string2]).then(function (data) {
                    expect((data[0].toLowerCase())).toBeGreaterThan(data[1].toLowerCase());
                });

                element(by.id("provider-list")).element(by.linkText("UserName")).click();
                var r3 = element(by.id("provider-list")).all(by.repeater("provider in users")).get(0);
                var string3 = r3.all(by.tagName('td')).get(1).getText();
                var r4 = element(by.id("provider-list")).all(by.repeater("provider in users")).get(1);
                var string4 = r4.all(by.tagName('td')).get(1).getText();
                protractor.promise.all([string3, string4]).then(function (data) {
                    expect((data[0].toLowerCase())).toBeLessThan(data[1].toLowerCase());
                });
            });

            it("should be sortable by email", function () {
                element(by.id("provider-list")).element(by.linkText("Email")).click();
                var r1 = element(by.id("provider-list")).all(by.repeater("provider in users")).get(0);
                var string1 = r1.all(by.tagName('td')).get(2).getText();
                var r2 = element(by.id("provider-list")).all(by.repeater("provider in users")).get(1);
                var string2 = r2.all(by.tagName('td')).get(2).getText();
                protractor.promise.all([string1, string2]).then(function (data) {
                    expect((data[0].toLowerCase())).toBeGreaterThan(data[1].toLowerCase());
                });

                element(by.id("provider-list")).element(by.linkText("Email")).click();
                var r3 = element(by.id("provider-list")).all(by.repeater("provider in users")).get(0);
                var string3 = r3.all(by.tagName('td')).get(2).getText();
                var r4 = element(by.id("provider-list")).all(by.repeater("provider in users")).get(1);
                var string4 = r4.all(by.tagName('td')).get(2).getText();
                protractor.promise.all([string3, string4]).then(function (data) {
                    expect((data[0].toLowerCase())).toBeLessThan(data[1].toLowerCase());
                });
            });

            it("should be sortable by role", function () {
                element(by.id("provider-list")).element(by.linkText("Role")).click();
                var r1 = element(by.id("provider-list")).all(by.repeater("provider in users")).get(0);
                var string1 = r1.all(by.tagName('td')).get(3).getText().then(function (data) {
                    expect(data).toEqual("Physician");
                });

                element(by.id("provider-list")).element(by.linkText("Email")).click();
                var r2 = element(by.id("provider-list")).all(by.repeater("provider in users")).get(0);
                var string2 = r2.all(by.tagName('td')).get(3).getText().then(function (data) {
                    expect(data).toEqual("Nurse");
                });
            });
        });

        describe("add-button", function () {
            it("should be hidden for other tabs", function () {
                element(by.id("patient-tab")).click();
                expect(element(by.buttonText("Add Physician/Nurse")).isDisplayed()).toBeFalsy();
            });

            it("should be active for provider tab", function () {
                element(by.id("provider-tab")).click();
                expect(element(by.buttonText("Add Physician/Nurse")).isDisplayed()).toBeTruthy();
            });
        });

        describe("add-provider-form", function () {
            var randNo = Math.floor((Math.random() * 10000) + 1);
            providerEmail = "physician" + randNo.toString() + "@example.com";

            it("should open on clicking add button", function () {
                element(by.buttonText("Add Physician/Nurse")).click();
                expect(element.all(by.cssContainingText(".modal-title", "Register New Physician/Nurse")).count()).toEqual(1);
            });

            describe("name-inputs", function () {
                afterEach(function () {
                    element(by.model('creator.FirstName')).clear();
                    element(by.model('creator.LastName')).clear();
                });

                it("should display error message for invalid first name", function () {
                    element(by.model('creator.FirstName')).sendKeys("user1");

                    expect(element(by.id("fn-invalid")).isDisplayed()).toBeTruthy();
                });
                it("should display error message for invalid last name", function () {
                    element(by.model('creator.LastName')).sendKeys("example1");

                    expect(element(by.id("ln-invalid")).isDisplayed()).toBeTruthy();
                });
                it("should accept valid inputs", function () {
                    element(by.model('creator.FirstName')).sendKeys("user");
                    element(by.model('creator.LastName')).sendKeys("example");

                    expect(element(by.id("fn-invalid")).isDisplayed()).toBeFalsy();
                    expect(element(by.id("ln-invalid")).isDisplayed()).toBeFalsy();
                });
            });

            describe("phone-number-input", function () {
                afterEach(function () {
                    element(by.model('data.PhoneNumber')).clear();
                });

                it("should only allow numbers", function () {
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

                element(by.model('creator.Email')).sendKeys(providerEmail);
                expect(registerBtn.isEnabled()).toBeFalsy();

                element(by.model('creator.FirstName')).sendKeys("Example");
                expect(registerBtn.isEnabled()).toBeFalsy();

                element(by.model('creator.LastName')).sendKeys("Physician");
                expect(registerBtn.isEnabled()).toBeFalsy();

                element(by.model('data.PhoneNumber')).sendKeys(" 1234567890");
                expect(registerBtn.isEnabled()).toBeFalsy();

                element(by.model('dt')).sendKeys("1934-11-01");
                expect(registerBtn.isEnabled()).toBeFalsy();

                element(by.cssContainingText('option', 'Male')).click();
                expect(registerBtn.isEnabled()).toBeFalsy();

                element(by.cssContainingText('option', 'Physician')).click();
                expect(registerBtn.isEnabled()).toBeTruthy();
            });

            it("should close the modal upon successful creation", function () {
                element(by.id("register-btn")).click();
                expect(element.all(by.css(".modal-header")).count()).toEqual(0);
            });

            it("should successfully create a provider", function () {
                element(by.id("provider-tab")).click();
                expect(element.all(by.cssContainingText("tbody tr", providerEmail)).count()).toEqual(1);
            });
        });

        describe("remove-button", function () {
            var provider;

            it("should ask for confirmation when clicked", function () {
                provider = element(by.cssContainingText("tbody tr", providerEmail));
                provider.element(by.id("remove-provider")).click();

                expect(element.all(by.cssContainingText(".modal-title", "Are You Sure?")).count()).toEqual(1);
            });

            it("should delete provider when confirmed", function () {
                element(by.buttonText("Yes, delete User!")).click();
                element(by.id("provider-tab")).click();
                expect(element.all(by.cssContainingText("tbody tr", providerEmail)).count()).toEqual(0);
            });
        });
    });

    describe("supporters-tab", function () {
        var supporterEmail;

        it("should be hidden initially", function () {
            expect(element(by.id("supporter-list")).isDisplayed()).toBeFalsy();
        });

        it("should load when selected", function () {
            element(by.id("supporter-tab")).click();
            expect(element(by.id("supporter-list")).isDisplayed()).toBeTruthy();
        });

        describe("supporters-table", function () {
            it("should be sortable by name", function () {
                element(by.id("supporter-list")).element(by.linkText("Full Name")).click();
                var string1 = element(by.id("supporter-list")).all(by.repeater("supporter in users")).get(0).getText();
                var string2 = element(by.id("supporter-list")).all(by.repeater("supporter in users")).get(1).getText();
                protractor.promise.all([string1, string2]).then(function (data) {
                    expect((data[0].toLowerCase())).toBeGreaterThan(data[1].toLowerCase());
                });

                element(by.id("supporter-list")).element(by.linkText("Full Name")).click();
                var string3 = element(by.id("supporter-list")).all(by.repeater("supporter in users")).get(0).getText();
                var string4 = element(by.id("supporter-list")).all(by.repeater("supporter in users")).get(1).getText();
                protractor.promise.all([string3, string4]).then(function (data) {
                    expect((data[0].toLowerCase())).toBeLessThan(data[1].toLowerCase());
                });
            });
            it("should be sortable by username", function () {
                element(by.id("supporter-list")).element(by.linkText("UserName")).click();
                var r1 = element(by.id("supporter-list")).all(by.repeater("supporter in users")).get(0);
                var string1 = r1.all(by.tagName('td')).get(1).getText();
                var r2 = element(by.id("supporter-list")).all(by.repeater("supporter in users")).get(1);
                var string2 = r2.all(by.tagName('td')).get(1).getText();
                protractor.promise.all([string1, string2]).then(function (data) {
                    expect((data[0].toLowerCase())).toBeGreaterThan(data[1].toLowerCase());
                });

                element(by.id("supporter-list")).element(by.linkText("UserName")).click();
                var r3 = element(by.id("supporter-list")).all(by.repeater("supporter in users")).get(0);
                var string3 = r3.all(by.tagName('td')).get(1).getText();
                var r4 = element(by.id("supporter-list")).all(by.repeater("supporter in users")).get(1);
                var string4 = r4.all(by.tagName('td')).get(1).getText();
                protractor.promise.all([string3, string4]).then(function (data) {
                    expect((data[0].toLowerCase())).toBeLessThan(data[1].toLowerCase());
                });
            });
            it("should be sortable by email", function () {
                element(by.id("supporter-list")).element(by.linkText("Email")).click();
                var r1 = element(by.id("supporter-list")).all(by.repeater("supporter in users")).get(0);
                var string1 = r1.all(by.tagName('td')).get(2).getText();
                var r2 = element(by.id("supporter-list")).all(by.repeater("supporter in users")).get(1);
                var string2 = r2.all(by.tagName('td')).get(2).getText();
                protractor.promise.all([string1, string2]).then(function (data) {
                    expect((data[0].toLowerCase())).toBeGreaterThan(data[1].toLowerCase());
                });

                element(by.id("supporter-list")).element(by.linkText("Email")).click();
                var r3 = element(by.id("supporter-list")).all(by.repeater("supporter in users")).get(0);
                var string3 = r3.all(by.tagName('td')).get(2).getText();
                var r4 = element(by.id("supporter-list")).all(by.repeater("supporter in users")).get(1);
                var string4 = r4.all(by.tagName('td')).get(2).getText();
                protractor.promise.all([string3, string4]).then(function (data) {
                    expect((data[0].toLowerCase())).toBeLessThan(data[1].toLowerCase());
                });
            });
        });

        describe("add-button", function () {
            it("should be hidden for other tabs", function () {
                element(by.id("patient-tab")).click();
                expect(element(by.buttonText("Add Supporter")).isDisplayed()).toBeFalsy();
            });

            it("should be active for provider tab", function () {
                element(by.id("supporter-tab")).click();
                expect(element(by.buttonText("Add Supporter")).isDisplayed()).toBeTruthy();
            });
        });

        describe("add-supporter-form", function () {
            var randNo = Math.floor((Math.random() * 10000) + 1);
            supporterEmail = "supporter" + randNo.toString() + "@example.com";

            it("should open on clicking add button", function () {
                element(by.buttonText("Add Supporter")).click();
                expect(element.all(by.cssContainingText(".modal-title", "Register New Supporter")).count()).toEqual(1);
            });

            describe("name-inputs", function () {
                afterEach(function () {
                    element(by.model('creator.FirstName')).clear();
                    element(by.model('creator.LastName')).clear();
                });

                it("should display error message for invalid first name", function () {
                    element(by.model('creator.FirstName')).sendKeys("user1");

                    expect(element(by.id("fn-invalid")).isDisplayed()).toBeTruthy();
                });
                it("should display error message for invalid last name", function () {
                    element(by.model('creator.LastName')).sendKeys("example1");

                    expect(element(by.id("ln-invalid")).isDisplayed()).toBeTruthy();
                });
                it("should accept valid inputs", function () {
                    element(by.model('creator.FirstName')).sendKeys("user");
                    element(by.model('creator.LastName')).sendKeys("example");

                    expect(element(by.id("fn-invalid")).isDisplayed()).toBeFalsy();
                    expect(element(by.id("ln-invalid")).isDisplayed()).toBeFalsy();
                });
            });

            describe("phone-number-input", function () {
                afterEach(function () {
                    element(by.model('data.PhoneNumber')).clear();
                });

                it("should only allow numbers", function () {
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

                element(by.model('creator.Email')).sendKeys(supporterEmail);
                expect(registerBtn.isEnabled()).toBeFalsy();

                element(by.model('creator.FirstName')).sendKeys("example");
                expect(registerBtn.isEnabled()).toBeFalsy();

                element(by.model('creator.LastName')).sendKeys("supporter");
                expect(registerBtn.isEnabled()).toBeFalsy();

                element(by.model('data.PhoneNumber')).sendKeys(" 1234567890");
                expect(registerBtn.isEnabled()).toBeFalsy();

                element(by.model('dt')).sendKeys("1934-11-01");
                expect(registerBtn.isEnabled()).toBeFalsy();

                element(by.cssContainingText('option', 'Male')).click();
                expect(registerBtn.isEnabled()).toBeTruthy();
            });

            it("should close the modal upon successful creation", function () {
                element(by.id("register-btn")).click();
                expect(element.all(by.css(".modal-header")).count()).toEqual(0);
            });

            it("should successfully create a supporter", function () {
                element(by.id("supporter-tab")).click();
                expect(element.all(by.cssContainingText("tbody tr", supporterEmail)).count()).toEqual(1);
            });
        });

        describe("remove-button", function () {
            var supporter;

            it("should ask for confirmation when clicked", function () {
                supporter = element(by.cssContainingText("tbody tr", supporterEmail));

                supporter.element(by.id("remove-supporter")).click();
                expect(element.all(by.cssContainingText(".modal-title", "Are You Sure?")).count()).toEqual(1);
            });

            it("should delete supporter when confirmed", function () {
                element(by.buttonText("Yes, delete User!")).click();
                element(by.id("supporter-tab")).click();
                expect(element.all(by.cssContainingText("tbody tr", supporterEmail)).count()).toEqual(0);
            });
        });
    });

    describe("patients-tab", function () {
        it("should be the default loaded tab", function () {
            browser.get('#/admin');
            expect(element(by.id("patient-list")).isDisplayed()).toBeTruthy();
        });

        describe("patients-table", function () {
            it("should be sortable by name", function () {
                element(by.id("patient-list")).element(by.linkText("Full Name")).click();
                var string1 = element(by.id("patient-list")).all(by.repeater("patient in users")).get(0).getText();
                var string2 = element(by.id("patient-list")).all(by.repeater("patient in users")).get(1).getText();
                protractor.promise.all([string1, string2]).then(function (data) {
                    expect((data[0].toLowerCase())).toBeGreaterThan(data[1].toLowerCase());
                });

                element(by.id("patient-list")).element(by.linkText("Full Name")).click();
                var string3 = element(by.id("patient-list")).all(by.repeater("patient in users")).get(0).getText();
                var string4 = element(by.id("patient-list")).all(by.repeater("patient in users")).get(1).getText();
                protractor.promise.all([string3, string4]).then(function (data) {
                    expect((data[0].toLowerCase())).toBeLessThan(data[1].toLowerCase());
                });
            });

            it("should be sortable by username", function () {
                element(by.id("patient-list")).element(by.linkText("UserName")).click();
                var r1 = element(by.id("patient-list")).all(by.repeater("patient in users")).get(0);
                var string1 = r1.all(by.tagName('td')).get(1).getText();
                var r2 = element(by.id("patient-list")).all(by.repeater("patient in users")).get(1);
                var string2 = r2.all(by.tagName('td')).get(1).getText();
                protractor.promise.all([string1, string2]).then(function (data) {
                    expect((data[0].toLowerCase())).toBeGreaterThan(data[1].toLowerCase());
                });

                element(by.id("patient-list")).element(by.linkText("UserName")).click();
                var r3 = element(by.id("patient-list")).all(by.repeater("patient in users")).get(0);
                var string3 = r3.all(by.tagName('td')).get(1).getText();
                var r4 = element(by.id("patient-list")).all(by.repeater("patient in users")).get(1);
                var string4 = r4.all(by.tagName('td')).get(1).getText();
                protractor.promise.all([string3, string4]).then(function (data) {
                    expect((data[0].toLowerCase())).toBeLessThan(data[1].toLowerCase());
                });
            });

            it("should be sortable by email", function () {
                element(by.id("patient-list")).element(by.linkText("Email")).click();
                var r1 = element(by.id("patient-list")).all(by.repeater("patient in users")).get(0);
                var string1 = r1.all(by.tagName('td')).get(2).getText();
                var r2 = element(by.id("patient-list")).all(by.repeater("patient in users")).get(1);
                var string2 = r2.all(by.tagName('td')).get(2).getText();
                protractor.promise.all([string1, string2]).then(function (data) {
                    expect((data[0].toLowerCase())).toBeGreaterThan(data[1].toLowerCase());
                });

                element(by.id("patient-list")).element(by.linkText("Email")).click();
                var r3 = element(by.id("patient-list")).all(by.repeater("patient in users")).get(0);
                var string3 = r3.all(by.tagName('td')).get(2).getText();
                var r4 = element(by.id("patient-list")).all(by.repeater("patient in users")).get(1);
                var string4 = r4.all(by.tagName('td')).get(2).getText();
                protractor.promise.all([string3, string4]).then(function (data) {
                    expect((data[0].toLowerCase())).toBeLessThan(data[1].toLowerCase());
                });
            });
        });

        describe("remove-button", function () {
            var patient;

            it("should ask for confirmation when clicked", function () {
                patient = element(by.cssContainingText("tbody tr", "user@example.com"))
                patient.element(by.id("remove-patient")).click();
                expect(element.all(by.cssContainingText(".modal-title", "Are You Sure?")).count()).toEqual(1);
            });

            it("should delete user when confirmed", function () {
                element(by.buttonText("Yes, delete User!")).click();
                expect(element.all(by.cssContainingText("tbody tr", "user@example.com")).count()).toEqual(0);
            });
        });

        describe("create-careteam-form", function () {

            it("should open on clicking add button", function () {
                // generate test characters before opening modal
                generateTests();

                element.all(by.id("patient-tab")).click();
                element.all(by.id("create-careteam")).get(0).click();
                expect(element.all(by.cssContainingText(".modal-title", "Create New Care Team")).count()).toEqual(1);
            }, 100000);

            describe("patient-name-input", function () {
                it("should not allow editing", function () {
                    expect(element(by.id("patient-name")).isEnabled()).toBeFalsy();
                });
            });

            describe("provider-search-input", function () {
                afterEach(function () {
                    element(by.model("providerNameFilter")).clear();
                });

                it("should allow searching providers", function () {
                    element(by.model("providerNameFilter")).sendKeys("Example User");
                    element(by.id("search-providers")).click();

                    element.all(by.repeater("provider in providers")).count().then(function (count) {
                        expect(count).toBeGreaterThan(0);
                    });
                });

                it("should capture the enter keypress", function () {
                    element(by.model("providerNameFilter")).sendKeys("Example User");
                    element(by.model("providerNameFilter")).sendKeys(protractor.Key.ENTER);

                    element.all(by.repeater("provider in providers")).count().then(function (count) {
                        expect(count).toEqual(1);
                    });
                });
            });

            describe("provider-search-results", function () {
                beforeEach(function () {
                    // Search with a string likely to turn up a few results
                    element(by.model("providerNameFilter")).sendKeys("Miller");
                    element(by.id("search-providers")).click();
                });

                afterEach(function () {
                    element(by.model("providerNameFilter")).clear();
                });

                var provCount;

                describe("select/add-button", function () {
                    it("should send provider to the selected table", function () {
                        // count variable used later to verify omission of selected providers
                        provCount = element.all(by.repeater("provider in providers")).count();

                        var provider = element(by.repeater("provider in providers").row(0)).getText();
                        provider.element(by.id("select-provider")).click();
                        var selected = element(by.repeater("provider in selectedProviders").row(0)).getText();

                        expect(provider).toEqual(selected);
                    });
                });

                it("should omit selected providers", function () {
                    expect(element.all(by.repeater("provider in providers")).count()).toBeLessThan(provCount);
                });
            });

            describe("selected-providers-field", function () {
                describe("deselect/remove-button", function () {
                    it("should move provider back to search results field", function () {
                        var selected = element(by.repeater("provider in selectedProviders").row(0)).getText();
                        element(by.model("providerNameFilter")).clear();
                        // this will clear the search result list
                        element(by.id("search-providers")).click();

                        element.all(by.id("deselect-provider")).get(0).click();
                        var provider = element(by.repeater("provider in providers").row(0)).getText();
                        expect(selected).toEqual(provider);
                    });
                });
            });

            describe("supporter-search-input", function () {
                afterEach(function () {
                    element(by.model("supporterNameFilter")).clear();
                });

                it("should allow searching supporters", function () {
                    element(by.model("supporterNameFilter")).sendKeys("Example Supporter");
                    element(by.id("search-supporters")).click();

                    element.all(by.repeater("supporter in supporters")).count().then(function (count) {
                        expect(count).toBeGreaterThan(0);
                    });
                });

                it("should capture the enter keypress", function () {
                    element(by.model("supporterNameFilter")).sendKeys("Example Supporter");
                    element(by.model("supporterNameFilter")).sendKeys(protractor.Key.ENTER);

                    element.all(by.repeater("supporter in supporters")).count().then(function (count) {
                        expect(count).toBeGreaterThan(0);
                    });
                });
            });

            describe("supporter-search-results", function () {
                beforeEach(function () {
                    // Search with a string likely to turn up a few results
                    element(by.model("supporterNameFilter")).sendKeys("Miller");

                    element(by.id("search-supporters")).click();
                });

                afterEach(function () {
                    element(by.model("supporterNameFilter")).clear();
                });

                var suppCount;

                describe("select/add-button", function () {
                    it("should send supporter to the selected table", function () {
                        // count variable used later to verify omission of selected supporters
                        suppCount = element.all(by.repeater("supporter in supporters")).count();

                        var supporter = element(by.repeater("supporter in supporters").row(0)).getText();
                        supporter.element(by.id("select-supporter")).click();
                        var selected = element(by.repeater("supporter in selectedSupporters").row(0)).getText();

                        expect(supporter).toEqual(selected);
                    });
                });

                it("should omit selected supporters", function () {
                    expect(element.all(by.repeater("supporter in supporters")).count()).toBeLessThan(suppCount);
                });
            });

            describe("selected-supporters-field", function () {
                describe("deselect/remove-button", function () {
                    it("should move supporter back to search results field", function () {
                        var selected = element(by.repeater("supporter in selectedSupporters").row(0)).getText();
                        element(by.model("supporterNameFilter")).clear();
                        // this will clear the search result list
                        element(by.id("search-supporters")).click();

                        element.all(by.id("deselect-supporter")).get(0).click();
                        var supporter = element(by.repeater("supporter in supporters").row(0)).getText();
                        expect(selected).toEqual(supporter);
                    });
                });
            });

            it("should prevent submission until team is named", function () {
                var createBtn = element(by.id("create-btn"));
                expect(createBtn.isEnabled()).toBeFalsy();

                element(by.id("team-name")).sendKeys("Green Lantern Corps");
                expect(createBtn.isEnabled()).toBeTruthy();
            });

            it("should close the modal upon successful creation", function () {
                element(by.model("providerNameFilter")).clear();
                element(by.model("providerNameFilter")).sendKeys("Miller");
                element(by.id("search-providers")).click();
                var provider = element(by.repeater("provider in providers").row(0)).getText();
                provider.element(by.id("select-provider")).click();

                element(by.model("supporterNameFilter")).clear();
                element(by.model("supporterNameFilter")).sendKeys("Miller");
                element(by.id("search-supporters")).click();
                var supporter = element(by.repeater("supporter in supporters").row(0)).getText();
                supporter.element(by.id("select-supporter")).click();

                element(by.id("create-btn")).click();

                expect(element.all(by.css(".modal-header")).count()).toEqual(0);
            });
        });
    });

    describe("careteams-tab", function () {
        var testCount;

        it("should be hidden initially", function () {
            expect(element(by.id("careteams-list")).isDisplayed()).toBeFalsy();
        });

        it("should load when selected", function () {
            element(by.id("careteam-tab")).click();
            expect(element(by.id("careteams-list")).isDisplayed()).toBeTruthy();
        });

        describe("careteams-table", function () {
            it("should be sortable by name", function () {
                element(by.id("careteams-list")).element(by.linkText("Name")).click();
                var string1 = element(by.id("careteams-list")).all(by.repeater("careTeam in careTeams")).get(0).getText();
                var string2 = element(by.id("careteams-list")).all(by.repeater("careTeam in careTeams")).get(1).getText();
                protractor.promise.all([string1, string2]).then(function (data) {
                    expect((data[0].toLowerCase())).toBeGreaterThan(data[1].toLowerCase());
                });

                element(by.id("careteams-list")).element(by.linkText("Name")).click();
                var string3 = element(by.id("careteams-list")).all(by.repeater("careTeam in careTeams")).get(0).getText();
                var string4 = element(by.id("careteams-list")).all(by.repeater("careTeam in careTeams")).get(1).getText();
                protractor.promise.all([string3, string4]).then(function (data) {
                    expect((data[0].toLowerCase())).toBeLessThan(data[1].toLowerCase());
                });
            });

            it("should be sortable by patient", function () {
                element(by.id("careteams-list")).element(by.linkText("Patient")).click();
                var r1 = element(by.id("careteams-list")).all(by.repeater("careTeam in careTeams")).get(0);
                var string1 = r1.all(by.tagName('td')).get(1).getText();
                var r2 = element(by.id("careteams-list")).all(by.repeater("careTeam in careTeams")).get(1);
                var string2 = r2.all(by.tagName('td')).get(1).getText();
                protractor.promise.all([string1, string2]).then(function (data) {
                    expect((data[0].toLowerCase())).toBeGreaterThan(data[1].toLowerCase());
                });

                element(by.id("careteams-list")).element(by.linkText("Patient")).click();
                var r3 = element(by.id("careteams-list")).all(by.repeater("careTeam in careTeams")).get(0);
                var string3 = r3.all(by.tagName('td')).get(1).getText();
                var r4 = element(by.id("careteams-list")).all(by.repeater("careTeam in careTeams")).get(1);
                var string4 = r4.all(by.tagName('td')).get(1).getText();
                protractor.promise.all([string3, string4]).then(function (data) {
                    expect((data[0].toLowerCase())).toBeLessThan(data[1].toLowerCase());
                });
            });
        });

        it("should display unapproved careteams in separate table", function () {
            // sample Care Team "Green Lantern Corps" created in patient-tab test
            expect(element(by.id("inactive-careteams-list")).all(by.cssContainingText("tbody tr", "Green Lantern Corps")).count()).toBeGreaterThan(0);
        });

        describe("update-form", function () {
            it("should open on clicking update button", function () {
                element(by.id("inactive-careteams-list")).element(by.cssContainingText("tbody tr", "Green Lantern Corps")).element(by.id("update-inactive-careteam")).click();
                expect(element.all(by.cssContainingText(".modal-title", "Update CareTeam")).count()).toBeGreaterThan(0);
            });

            describe("provider-search-input", function () {
                afterEach(function () {
                    element(by.model("providerNameFilter")).clear();
                });

                it("should allow searching providers", function () {
                    element(by.model("providerNameFilter")).sendKeys("Example User");
                    element(by.id("search-providers")).click();

                    element.all(by.repeater("provider in providers")).count().then(function (count) {
                        expect(count).toBeGreaterThan(0);
                    });
                });

                it("should capture the enter keypress", function () {
                    element(by.model("providerNameFilter")).sendKeys("Example User");
                    element(by.model("providerNameFilter")).sendKeys(protractor.Key.ENTER);

                    element.all(by.repeater("provider in providers")).count().then(function (count) {
                        expect(count).toBeGreaterThan(0);
                    });
                });
            });

            describe("provider-search-results", function () {
                beforeEach(function () {
                    // Search with a string likely to turn up a few results
                    element(by.model("providerNameFilter")).sendKeys("Example User");
                    element(by.id("search-providers")).click();
                });

                afterEach(function () {
                    element(by.model("providerNameFilter")).clear();
                });

                describe("select/add-button", function () {
                    it("should send provider to the selected table", function () {
                        var provider = element(by.repeater("provider in providers").row(0)).getText();
                        provider.element(by.id("select-provider")).click();
                        expect(element(by.id("selected-providers")).all(by.cssContainingText("tbody tr", "Example User")).count()).toBeGreaterThan(0);
                    });
                });

                it("should omit selected providers", function () {
                    expect(element(by.id("filter-results")).all(by.cssContainingText("tbody tr", "Example User")).count()).toBe(0);
                });
            });

            describe("selected-providers-field", function () {
                describe("deselect/remove-button", function () {
                    it("should move provider back to search results field", function () {
                        var selected = element(by.repeater("provider in selectedProviders").row(0)).getText();
                        element(by.model("providerNameFilter")).clear();
                        // this will clear the search result list
                        element(by.id("search-providers")).click();

                        element.all(by.id("deselect-provider")).get(0).click();
                        var provider = element(by.repeater("provider in providers").row(0)).getText();
                        expect(selected).toEqual(provider);
                    });
                });
            });

            describe("supporter-search-input", function () {
                afterEach(function () {
                    element(by.model("supporterNameFilter")).clear();
                });

                it("should allow searching supporters", function () {
                    element(by.model("supporterNameFilter")).sendKeys("Example Supporter");
                    element(by.id("search-supporters")).click();

                    element.all(by.repeater("supporter in supporters")).count().then(function (count) {
                        expect(count).toBeGreaterThan(0);
                    });
                });

                it("should capture the enter keypress", function () {
                    element(by.model("supporterNameFilter")).sendKeys("Example Supporter");
                    element(by.model("supporterNameFilter")).sendKeys(protractor.Key.ENTER);

                    element.all(by.repeater("supporter in supporters")).count().then(function (count) {
                        expect(count).toBeGreaterThan(0);
                    });
                });
            });

            describe("supporter-search-results", function () {
                beforeEach(function () {
                    // Search with a string likely to turn up a few results
                    element(by.model("supporterNameFilter")).sendKeys("Example Supporter");
                    element(by.id("search-supporters")).click();
                });

                afterEach(function () {
                    element(by.model("supporterNameFilter")).clear();
                });

                describe("select/add-button", function () {
                    it("should send supporter to the selected table", function () {
                        var supporter = element(by.repeater("supporter in supporters").row(0)).getText();
                        supporter.element(by.id("select-supporter")).click();
                        expect(element(by.id("selected-supporters")).all(by.cssContainingText("tbody tr", "Example Supporter")).count()).toBeGreaterThan(0);
                    });
                });

                it("should omit selected supporters", function () {
                    expect(element(by.id("filter-supporter-results")).all(by.cssContainingText("tbody tr", "Example Supporter")).count()).toBe(0);
                });
            });

            describe("selected-supporters-field", function () {
                describe("deselect/remove-button", function () {
                    it("should move supporter back to search results field", function () {
                        var selected = element(by.repeater("supporter in selectedSupporters").row(0)).getText();
                        element(by.model("supporterNameFilter")).clear();
                        // this will clear the search result list
                        element(by.id("search-supporters")).click();

                        element.all(by.id("deselect-supporter")).get(0).click();
                        var supporter = element(by.repeater("supporter in supporters").row(0)).getText();
                        expect(selected).toEqual(supporter);
                    });
                });
            });

            it("should close the modal upon successful update", function () {
                element(by.model("careTeam.Name")).clear();
                element(by.model("careTeam.Name")).sendKeys("Fantastic Four");
                element(by.buttonText("Update CareTeam")).click();
                expect(element.all(by.css(".modal-header")).count()).toEqual(0);
            });

            it("should successfully modify care team", function () {
                element(by.id("careteam-tab")).click();
                expect(element(by.id("inactive-careteams-list")).all(by.cssContainingText("tbody tr", "Fantastic Four")).count()).toBe(1);
                // testCount variable used later to verify CareTeam deletion
                testCount = testCount = element.all(by.cssContainingText("tbody tr", "Fantastic Four")).count();
            });
        });

        describe("remove-button", function () {
            var careTeam;

            it("should ask for confirmation when clicked", function () {
                careTeam = element(by.id("inactive-careteams-list")).element(by.cssContainingText("tbody tr", "Fantastic Four"));
                careTeam.element(by.id("remove-inactive-careteam")).click();
                expect(element.all(by.cssContainingText(".modal-title", "Are You Sure?")).count()).toEqual(1);
            });

            it("should delete careteam when confirmed", function () {
                element(by.buttonText("Yes, delete care team!")).click();
                element(by.id("careteam-tab")).click();
                expect(element.all(by.cssContainingText("tbody tr", "Fantastic Four")).count()).toBeLessThan(testCount);
            });
        });
    });

    it("should log out", function () {
        // remove test users before logging out
        removeTests();

        element(by.linkText("Logout")).click();
        expect(browser.getTitle()).toBe('Login | CloudMedic Dashboard');
    }, 100000);
});