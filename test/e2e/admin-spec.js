// Admin page spec
xdescribe("admin-page", function () {
    browser.get('#/');
    // Login as an administrator
    element(by.model("loginData.username")).sendKeys("administrator");
    element(by.model("loginData.password")).sendKeys("cloudmedicrocks");
    element(by.buttonText("Login to your account")).click();

    it("should load", function () {
        expect(browser.getTitle()).toBe('Admin | CloudMedic Dashboard');
    });

    describe("patients-tab", function () {
        it("should be the default loaded tab", function () {
            expect(element(by.id("patient-list")).isDisplayed()).toBeTruthy();
        });

        describe("remove-button", function () {
            var patient = element(by.repeater("user in users").row(0));
            var name = patient.getText();

            it("should ask for confirmation when clicked", function () {
                patient.element(by.id("remove-user")).click();
                element(by.css(".modal-title")).getText().then(function (text) {
                    expect(text).toEqual("Are You Sure?");
                });
            });

            it("should delete user when confirmed", function () {
                element(by.buttonText("Yes, delete User!")).click();
                var name2 = element(by.repeater("user in users").row(0)).getText();
                expect(name2).not.toEqual(name);
            });
        });

        describe("create-careteam-form", function () {
            it("should open on clicking add button", function () {
                element(by.id("create-careteam")).click();

                element(by.css(".modal-title")).getText().then(function (text) {
                    expect(text).toEqual("Create New Care Team");
                });
            });

            describe("patient-name-input", function () {
                it("should not allow editing", function () {

                });
            });

            describe("team-name-input", function () {
                
            });

            describe("provider-search-input", function () {
                afterEach(function () {
                    element(by.model("providerNameFilter")).clear();
                });

                it("should allow searching providers", function () {
                    element(by.model("providerNameFilter")).sendKeys("Example User");
                    element(by.id("search-providers")).click();

                    element.all(by.repeater("provider in providers")).count().then(function (count) {
                        expect(count).toEqual(1);
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
                    element(by.model("providerNameFilter")).clear();
                    element(by.model("providerNameFilter")).sendKeys("exa");
                    element(by.id("search-providers")).click();
                });

                describe("select/add-button", function () {
                    it("should send provider to the selected table", function () {
                        var provider = element(by.repeater("provider in providers").row(0)).getText();
                        provider.element(by.id("select-provider")).click();
                        var selected = element(by.repeater("provider in selectedProviders").row(0)).getText();

                        expect(provider).toEqual(selected);
                    });
                });

                it("should omit selected providers", function () {
                    var provider = element(by.repeater("provider in providers").row(0)).getText();
                    var selected = element(by.repeater("provider in selectedProviders").row(0)).getText();

                    expect(provider).not.toEqual(selected);
                });
            });

            describe("selected-providers-field", function () {
                describe("deselect/remove-button", function () {
                    it("should move provider back to search results field", function () {
                        var selected = element(by.repeater("provider in selectedProviders").row(0)).getText();
                        element(by.model("providerNameFilter")).clear();
                        // this will clear the search result list
                        element(by.id("search-providers")).click();
                        selected.element(by.id("deselect-provider")).click();
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
                        expect(count).toEqual(1);
                    });
                });

                it("should capture the enter keypress", function () {
                    element(by.model("supporterNameFilter")).sendKeys("Example Supporter");
                    element(by.model("supporterNameFilter")).sendKeys(protractor.Key.ENTER);

                    element.all(by.repeater("supporter in supporters")).count().then(function (count) {
                        expect(count).toEqual(1);
                    });
                });
            });

            describe("supporter-search-results", function () {
                beforeEach(function () {
                    // Search with a string likely to turn up a few results
                    element(by.model("supporterNameFilter")).clear();
                    element(by.model("supporterNameFilter")).sendKeys("exa");
                    element(by.id("search-supporters")).click();
                });

                describe("select/add-button", function () {
                    it("should send supporter to the selected table", function () {
                        var supporter = element(by.repeater("supporter in supporters").row(0)).getText();
                        supporter.element(by.id("select-supporter")).click();
                        var selected = element(by.repeater("supporter in selectedSupporters").row(0)).getText();

                        expect(supporter).toEqual(selected);
                    });
                });

                it("should omit selected supporters", function () {
                    var supporter = element(by.repeater("supporter in supporters").row(0)).getText();
                    var selected = element(by.repeater("supporter in selectedSupporters").row(0)).getText();

                    expect(supporter).not.toEqual(selected);
                });
            });

            describe("selected-supporters-field", function () {
                describe("deselect/remove-button", function () {
                    it("should move supporter back to search results field", function () {
                        var selected = element(by.repeater("supporter in selectedSupporters").row(0)).getText();
                        element(by.model("supporterNameFilter")).clear();
                        // this will clear the search result list
                        element(by.id("search-supporters")).click();
                        selected.element(by.id("deselect-supporter")).click();
                        var supporter = element(by.repeater("supporter in supporters").row(0)).getText();

                        expect(selected).toEqual(supporter);
                    });
                });
            });

            it("should prevent submission team is named", function () {
                var createBtn = element(by.id("create-btn"));
                expect(createBtn.isEnabled()).toBeFalsy();

                element(by.id("team-name")).sendKeys("Green Lantern Corps");
                expect(createBtn.isEnabled()).toBeTruthy();
            });

            it("should close the modal upon successful creation", function () {
                element(by.model("providerNameFilter")).clear();
                element(by.model("providerNameFilter")).sendKeys("exa");
                element(by.id("search-providers")).click();
                var provider = element(by.repeater("provider in providers").row(0)).getText();
                provider.element(by.id("select-provider")).click();

                element(by.model("supporterNameFilter")).clear();
                element(by.model("supporterNameFilter")).sendKeys("exa");
                element(by.id("search-supporters")).click();
                var supporter = element(by.repeater("supporter in supporters").row(0)).getText();
                supporter.element(by.id("select-supporter")).click();

                element(by.id("create-btn")).click();

                expect(element.all(by.css(".modal-header")).count()).toEqual(0);
            });
        });
    });

    it("should log out", function () {
        element(by.linkText("Logout")).click();
        expect(browser.getTitle()).toBe('Login | CloudMedic Dashboard');
    });
});