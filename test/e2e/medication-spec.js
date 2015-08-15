// Medication page spec
describe("medication-page", function () {
    browser.get('#/');

    beforeAll(function () {
        // Login as an provider
        element(by.model("loginData.username")).sendKeys("doctor1");
        element(by.model("loginData.password")).sendKeys("Password1?");
        element(by.buttonText("Login to your account")).click();
        element(by.linkText("Medications")).click();
    });

    it("should load", function () {
        expect(browser.getTitle()).toBe('Medications | CloudMedic Dashboard');
    });

    describe("add-form", function () {
        it("should open on selecting button", function () {
            element(by.buttonText("Add Medication")).click();
            expect(element.all(by.cssContainingText(".modal-title", "Add New Medication")).count()).toEqual(1);
        });

        describe("generic-name-input", function () {
            afterEach(function () {
                element(by.model("medicationsData.GenericName")).clear();
            });

            it("should display error messages for invalid name", function () {
                element(by.model("medicationsData.GenericName")).sendKeys("12345");

                expect(element(by.id("generic-name-error")).isDisplayed()).toBeTruthy();
            });

            it("should accept a valid name", function () {
                element(by.model("medicationsData.GenericName")).sendKeys("Synthroid");

                expect(element(by.id("generic-name-error")).isDisplayed()).toBeFalsy();
            });
        });

        describe("medication-code-input", function () {
            afterEach(function () {
                element(by.model("medicationsData.Code")).clear();
            });

            it("should display error messages for invalid code", function () {
                element(by.model("medicationsData.Code")).sendKeys("abcdef");

                expect(element(by.id("code-error")).isDisplayed()).toBeTruthy();
            });

            it("should accept a valid code", function () {
                element(by.model("medicationsData.Code")).sendKeys("50932");

                expect(element(by.id("code-error")).isDisplayed()).toBeFalsy();
            });
        });

        it("should prevent submitting until fields complete", function () {
            var createMed = element(by.buttonText("Create"));
            expect(createMed.isEnabled()).toBeFalsy();

            element(by.model("medicationsData.GenericName")).sendKeys("Synthroid");
            expect(createMed.isEnabled()).toBeFalsy();

            element(by.model("medicationsData.Code")).sendKeys("50932");
            expect(createMed.isEnabled()).toBeTruthy();
        });

        it("should close on creation", function () {
            element(by.buttonText("Create")).click();
            expect(element.all(by.cssContainingText(".modal-title", "Add New Medication")).count()).toEqual(0);
        });

        it("should successfully create a medication", function () {
            expect(element.all(by.cssContainingText("tbody tr", "Synthroid")).count()).toEqual(1);
        });
    });

    describe("table", function () {
        it("should be sortable by generic name", function () {
            element(by.id("medications-list")).element(by.linkText("Generic Name")).click();
            var string1 = element(by.id("medications-list")).all(by.repeater("medication in medications")).get(0).getText();
            var string2 = element(by.id("medications-list")).all(by.repeater("medication in medications")).get(1).getText();
            protractor.promise.all([string1, string2]).then(function (data) {
                expect(data[0].toLowerCase() >= data[1].toLowerCase()).toBeTruthy();
            });

            element(by.id("medications-list")).element(by.linkText("Generic Name")).click();
            var string3 = element(by.id("medications-list")).all(by.repeater("medication in medications")).get(0).getText();
            var string4 = element(by.id("medications-list")).all(by.repeater("medication in medications")).get(1).getText();
            protractor.promise.all([string3, string4]).then(function (data) {
                expect(data[0].toLowerCase() <= data[1].toLowerCase()).toBeTruthy();
            });
        });

        it("should be sortable by id", function () {
            element(by.id("medications-list")).element(by.linkText("Medication ID")).click();
            var r1 = element(by.id("medications-list")).all(by.repeater("medication in medications")).get(0);
            var string1 = r1.all(by.tagName('td')).get(1).getText();
            var r2 = element(by.id("medications-list")).all(by.repeater("medication in medications")).get(1);
            var string2 = r2.all(by.tagName('td')).get(1).getText();
            protractor.promise.all([string1, string2]).then(function (data) {
                expect(data[0]).toBeGreaterThan(data[1]);
            });

            element(by.id("medications-list")).element(by.linkText("Medication ID")).click();
            var r3 = element(by.id("medications-list")).all(by.repeater("medication in medications")).get(0);
            var string3 = r3.all(by.tagName('td')).get(1).getText();
            var r4 = element(by.id("medications-list")).all(by.repeater("medication in medications")).get(1);
            var string4 = r4.all(by.tagName('td')).get(1).getText();
            protractor.promise.all([string3, string4]).then(function (data) {
                expect(data[0]).toBeLessThan(data[1]);
            });
        });

        it("should be sortable by code", function () {
            element(by.id("medications-list")).element(by.linkText("Code")).click();
            var r1 = element(by.id("medications-list")).all(by.repeater("medication in medications")).get(0);
            var string1 = r1.all(by.tagName('td')).get(2).getText();
            var r2 = element(by.id("medications-list")).all(by.repeater("medication in medications")).get(1);
            var string2 = r2.all(by.tagName('td')).get(2).getText();
            protractor.promise.all([string1, string2]).then(function (data) {
                expect(data[0]).toBeGreaterThan(data[1]);
            });

            element(by.id("medications-list")).element(by.linkText("Code")).click();
            var r3 = element(by.id("medications-list")).all(by.repeater("medication in medications")).get(0);
            var string3 = r3.all(by.tagName('td')).get(2).getText();
            var r4 = element(by.id("medications-list")).all(by.repeater("medication in medications")).get(1);
            var string4 = r4.all(by.tagName('td')).get(2).getText();
            protractor.promise.all([string3, string4]).then(function (data) {
                expect(data[0]).toBeLessThan(data[1]);
            });
        });

        describe("remove-button", function () {
            it("should ask for confirmation when clicked", function () {
                element(by.cssContainingText("tbody tr", "Synthroid")).element(by.id("remove-medication")).click();
                expect(element.all(by.cssContainingText(".modal-title", "Are You Sure?")).count()).toEqual(1);
            });

            it("should delete medication when confirmed", function () {
                element(by.buttonText("Yes, delete medication!")).click();
                expect(element.all(by.cssContainingText("tbody tr", "Synthroid")).count()).toEqual(0);
            });
        });

        describe("prescribe-form", function () {
            it("should open on selecting prescribe button", function () {
                element.all(by.repeater("medication in medications")).get(0).element(by.id("prescribe-medication")).click();
                expect(element.all(by.cssContainingText(".modal-title", "Add New Prescription")).count()).toEqual(1);
            });
            
            describe("medication-name", function () {
                it("should not allow editing", function () {
                    expect(element(by.id("medication-name")).isEnabled()).toBeFalsy();
                });
            });

            describe("patient-filter-results", function () {
                it("should change tabs", function () {
                    element(by.id("patient-name-filter")).sendKeys("z");
                    expect(element(by.cssContainingText("option", "Patient, Example")).isDisplayed()).toBeFalsy();

                    element(by.id("patient-name-filter")).clear();
                    element(by.id("patient-name-filter")).sendKeys("Patient");
                    expect(element(by.cssContainingText("option", "Patient, Example")).isDisplayed()).toBeTruthy();
                });
            });

            it("should prevent submitting until all fields filled", function () {
                var prescribeBtn = element(by.buttonText("Create"));
                expect(prescribeBtn.isEnabled()).toBeFalsy();

                element(by.id("prescription-frequency")).sendKeys("Twice a day");
                expect(prescribeBtn.isEnabled()).toBeFalsy();

                element(by.id("prescription-dosage")).sendKeys("Two tablets");
                expect(prescribeBtn.isEnabled()).toBeFalsy();

                element(by.id("prescription-notes")).sendKeys("Report any symptoms");
                expect(prescribeBtn.isEnabled()).toBeFalsy();

                element(by.cssContainingText("option", "100")).click();
                expect(prescribeBtn.isEnabled()).toBeFalsy();

                element(by.cssContainingText("option", "Patient, Example")).click();
                expect(prescribeBtn.isEnabled()).toBeTruthy();
            });

            it("should close upon successful prescription", function () {
                element(by.buttonText("Create")).click();
                expect(element.all(by.cssContainingText(".modal-title", "Add New Prescription")).count()).toEqual(0);
            });
        });
    });
});