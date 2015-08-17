// Prescription page spec
describe("prescription-page", function () {
    //browser.get('#/');

    var createPrescriptions = function () {
        element(by.linkText("Medications")).click();

        var today = new Date();
        var dates = ["1996-01-01", (today.getFullYear() - 8) + "-" + ('0' + (today.getMonth() + 1)).slice(-2) + "-" + ('0' + today.getDate()).slice(-2)];
        for (var i = 0; i < 2; i++) {
            element.all(by.repeater("medication in medications")).get(i).element(by.id("prescribe-medication")).click();
            element(by.id("prescription-frequency")).sendKeys("Twice a day");
            element(by.id("prescription-dosage")).sendKeys("Test Prescription");
            element(by.id("prescription-notes")).sendKeys("Report any symptoms");
            element(by.id("prescription-add-date")).clear();
            element(by.id("prescription-add-date")).sendKeys(dates[i]);
            element(by.cssContainingText("option", "100")).click();
            element(by.cssContainingText("option", "Months")).click();
            element(by.id("patient-name-filter")).clear();
            element(by.id("patient-name-filter")).sendKeys("Patient");
            element(by.cssContainingText("option", "Patient, Example")).click();
            element(by.buttonText("Create")).click();
        }
    }

    var removePrescriptions = function () {
        for (var j = 0; j < 2; j++) {
            element(by.linkText("Prescriptions")).click();
            element(by.id("expired-tab")).click();

            element.all(by.cssContainingText("tbody tr", "Test Prescription")).get(0).element(by.id("remove-prescription")).click();
            element(by.buttonText("Yes, delete prescription!")).click();
        }
    }

    it("should load", function () {
        // Generate test prescriptions before loading
        createPrescriptions();
        element(by.linkText("Prescriptions")).click();
        expect(browser.getTitle()).toBe('Prescriptions | CloudMedic Dashboard');
    }, 100000);

    describe("active-tab", function () {
        it("should be sortable by med description", function () {
            element(by.id("active-prescription-list")).element(by.linkText("Medication")).click();
            var r1 = element(by.id("active-prescription-list")).all(by.repeater("prescription in activePrescriptions")).get(0);
            var string1 = r1.all(by.tagName('td')).get(0).getText();
            var r2 = element(by.id("active-prescription-list")).all(by.repeater("prescription in activePrescriptions")).get(1);
            var string2 = r2.all(by.tagName('td')).get(0).getText();
            protractor.promise.all([string1, string2]).then(function (data) {
                expect(data[0].toLowerCase() >= data[1].toLowerCase()).toBeTruthy();
            });

            element(by.id("active-prescription-list")).element(by.linkText("Medication")).click();
            var r3 = element(by.id("active-prescription-list")).all(by.repeater("prescription in activePrescriptions")).get(0);
            var string3 = r3.all(by.tagName('td')).get(0).getText();
            var r4 = element(by.id("active-prescription-list")).all(by.repeater("prescription in activePrescriptions")).get(1);
            var string4 = r4.all(by.tagName('td')).get(0).getText();
            protractor.promise.all([string3, string4]).then(function (data) {
                expect(data[0].toLowerCase() <= data[1].toLowerCase()).toBeTruthy();
            });
        });

        it("should be sortable by patient", function () {
            element(by.id("active-prescription-list")).element(by.linkText("Patient")).click();
            var r1 = element(by.id("active-prescription-list")).all(by.repeater("prescription in activePrescriptions")).get(0);
            var string1 = r1.all(by.tagName('td')).get(1).getText();
            var r2 = element(by.id("active-prescription-list")).all(by.repeater("prescription in activePrescriptions")).get(1);
            var string2 = r2.all(by.tagName('td')).get(1).getText();
            protractor.promise.all([string1, string2]).then(function (data) {
                expect(data[0].toLowerCase() >= data[1].toLowerCase()).toBeTruthy();
            });

            element(by.id("active-prescription-list")).element(by.linkText("Patient")).click();
            var r3 = element(by.id("active-prescription-list")).all(by.repeater("prescription in activePrescriptions")).get(0);
            var string3 = r3.all(by.tagName('td')).get(1).getText();
            var r4 = element(by.id("active-prescription-list")).all(by.repeater("prescription in activePrescriptions")).get(1);
            var string4 = r4.all(by.tagName('td')).get(1).getText();
            protractor.promise.all([string3, string4]).then(function (data) {
                expect(data[0].toLowerCase() <= data[1].toLowerCase()).toBeTruthy();
            });
        });

        it("should be sortable by start date", function () {
            element(by.id("active-prescription-list")).element(by.linkText("Start Date")).click();
            var r1 = element(by.id("active-prescription-list")).all(by.repeater("prescription in activePrescriptions")).get(0);
            var string1 = r1.all(by.tagName('td')).get(2).getText();
            var r2 = element(by.id("active-prescription-list")).all(by.repeater("prescription in activePrescriptions")).get(1);
            var string2 = r2.all(by.tagName('td')).get(2).getText();
            protractor.promise.all([string1, string2]).then(function (data) {
                expect(Date.parse(data[0]) >= Date.parse(data[1])).toBeTruthy();
            });

            element(by.id("active-prescription-list")).element(by.linkText("Start Date")).click();
            var r3 = element(by.id("active-prescription-list")).all(by.repeater("prescription in activePrescriptions")).get(0);
            var string3 = r3.all(by.tagName('td')).get(2).getText();
            var r4 = element(by.id("active-prescription-list")).all(by.repeater("prescription in activePrescriptions")).get(1);
            var string4 = r4.all(by.tagName('td')).get(2).getText();
            protractor.promise.all([string3, string4]).then(function (data) {
                expect(Date.parse(data[0]) <= Date.parse(data[1])).toBeTruthy();
            });
        });

        it("should be sortable by end date", function () {
            element(by.id("active-prescription-list")).element(by.linkText("End Date")).click();
            var r1 = element(by.id("active-prescription-list")).all(by.repeater("prescription in activePrescriptions")).get(0);
            var string1 = r1.all(by.tagName('td')).get(3).getText();
            var r2 = element(by.id("active-prescription-list")).all(by.repeater("prescription in activePrescriptions")).get(1);
            var string2 = r2.all(by.tagName('td')).get(3).getText();
            protractor.promise.all([string1, string2]).then(function (data) {
                expect(Date.parse(data[0]) >= Date.parse(data[1])).toBeTruthy();
            });

            element(by.id("active-prescription-list")).element(by.linkText("End Date")).click();
            var r3 = element(by.id("active-prescription-list")).all(by.repeater("prescription in activePrescriptions")).get(0);
            var string3 = r3.all(by.tagName('td')).get(3).getText();
            var r4 = element(by.id("active-prescription-list")).all(by.repeater("prescription in activePrescriptions")).get(1);
            var string4 = r4.all(by.tagName('td')).get(3).getText();
            protractor.promise.all([string3, string4]).then(function (data) {
                expect(Date.parse(data[0]) <= Date.parse(data[1])).toBeTruthy();
            });
        });

        describe("update-form", function () {
            var newDate;

            it("should open on selecting update button", function () {
                element(by.id("active-prescription-list")).element(by.cssContainingText("tbody tr", "Test Prescription")).element(by.id("update-prescription")).click();
                expect(element.all(by.cssContainingText(".modal-title", "Update Prescription")).count()).toEqual(1);
            });

            describe("reset-button", function () {
                it("should reset end date", function () {
                    var today = new Date();
                    newDate = (today.getFullYear() - 2) + "-" + ('0' + (today.getMonth() + 1)).slice(-2) + "-" + ('0' + today.getDate()).slice(-2);
                    var oldDate = element(by.id("prescription-date")).getAttribute("value");
                    element(by.id("prescription-date")).clear();
                    element(by.id("prescription-date")).sendKeys(newDate);
                    element(by.id("reset-prescription")).click();

                    var restoredDate = element(by.id("prescription-date")).getAttribute("value");

                    protractor.promise.all([oldDate, restoredDate]).then(function (data) {
                        expect(data[0]).toEqual(data[1]);
                    });
                });

                it("should reset notes box", function () {
                    var oldNotes = element(by.id("prescription-notes")).getAttribute("value");

                    element(by.id("prescription-notes")).clear();
                    element(by.id("reset-prescription")).click();

                    var restoredNotes = element(by.id("prescription-notes")).getAttribute("value");

                    protractor.promise.all([oldNotes, restoredNotes]).then(function (data) {
                        expect(data[0]).toEqual(data[1]);
                    });
                });
            });

            it("should close on successful update", function () {
                element(by.id("prescription-date")).clear();
                element(by.id("prescription-date")).sendKeys(newDate);
                element(by.id("prescription-notes")).clear();
                element(by.id("prescription-notes")).sendKeys("Stop taking if experiencing nausea");

                element(by.buttonText("Update Prescription")).click();
                expect(element.all(by.cssContainingText(".modal-title", "Update Prescription")).count()).toEqual(0);
            });

            it("should successfully update prescription", function () {
                expect(element(by.id("active-prescriptions-list")).all(by.cssContainingText("Test Prescription")).count()).toEqual(0);
            });
        });
    });

    describe("expired-tab", function () {
        it("should be hidden at first", function () {
            element(by.linkText("Prescriptions")).click();
            expect(element(by.id("expired-prescription-list")).isDisplayed()).toBeFalsy();
        });

        it("should load when selected", function () {
            element(by.id("expired-tab")).click();
            expect(element(by.id("expired-prescription-list")).isDisplayed()).toBeTruthy();
        });

        it("should be sortable by med description", function () {
            element(by.id("expired-prescription-list")).element(by.linkText("Medication")).click();
            var r1 = element(by.id("active-prescription-list")).all(by.repeater("prescription in activePrescriptions")).get(0);
            var string1 = r1.all(by.tagName('td')).get(0).getText();
            var r2 = element(by.id("active-prescription-list")).all(by.repeater("prescription in activePrescriptions")).get(1);
            var string2 = r2.all(by.tagName('td')).get(0).getText();
            protractor.promise.all([string1, string2]).then(function (data) {
                expect(data[0].toLowerCase() >= data[1].toLowerCase()).toBeTruthy();
            });

            element(by.id("expired-prescription-list")).element(by.linkText("Medication")).click();
            var r3 = element(by.id("active-prescription-list")).all(by.repeater("prescription in activePrescriptions")).get(0);
            var string3 = r3.all(by.tagName('td')).get(0).getText();
            var r4 = element(by.id("active-prescription-list")).all(by.repeater("prescription in activePrescriptions")).get(1);
            var string4 = r4.all(by.tagName('td')).get(0).getText();
            protractor.promise.all([string3, string4]).then(function (data) {
                expect(data[0].toLowerCase() <= data[1].toLowerCase()).toBeTruthy();
            });
        });

        it("should be sortable by patient", function () {
            element(by.id("expired-prescription-list")).element(by.linkText("Patient")).click();
            var r1 = element(by.id("expired-prescription-list")).all(by.repeater("prescription in expiredPrescriptions")).get(0);
            var string1 = r1.all(by.tagName('td')).get(1).getText();
            var r2 = element(by.id("expired-prescription-list")).all(by.repeater("prescription in expiredPrescriptions")).get(1);
            var string2 = r2.all(by.tagName('td')).get(1).getText();
            protractor.promise.all([string1, string2]).then(function (data) {
                expect(data[0].toLowerCase() >= data[1].toLowerCase()).toBeTruthy();
            });

            element(by.id("expired-prescription-list")).element(by.linkText("Patient")).click();
            var r3 = element(by.id("expired-prescription-list")).all(by.repeater("prescription in expiredPrescriptions")).get(0);
            var string3 = r3.all(by.tagName('td')).get(1).getText();
            var r4 = element(by.id("expired-prescription-list")).all(by.repeater("prescription in expiredPrescriptions")).get(1);
            var string4 = r4.all(by.tagName('td')).get(1).getText();
            protractor.promise.all([string3, string4]).then(function (data) {
                expect(data[0].toLowerCase() <= data[1].toLowerCase()).toBeTruthy();
            });
        });

        it("should be sortable by start date", function () {
            element(by.id("expired-prescription-list")).element(by.linkText("Start Date")).click();
            var r1 = element(by.id("expired-prescription-list")).all(by.repeater("prescription in expiredPrescriptions")).get(0);
            var string1 = r1.all(by.tagName('td')).get(2).getText();
            var r2 = element(by.id("expired-prescription-list")).all(by.repeater("prescription in expiredPrescriptions")).get(1);
            var string2 = r2.all(by.tagName('td')).get(2).getText();
            protractor.promise.all([string1, string2]).then(function (data) {
                expect(Date.parse(data[0]) >= Date.parse(data[1])).toBeTruthy();
            });

            element(by.id("expired-prescription-list")).element(by.linkText("Start Date")).click();
            var r3 = element(by.id("expired-prescription-list")).all(by.repeater("prescription in expiredPrescriptions")).get(0);
            var string3 = r3.all(by.tagName('td')).get(2).getText();
            var r4 = element(by.id("expired-prescription-list")).all(by.repeater("prescription in expiredPrescriptions")).get(1);
            var string4 = r4.all(by.tagName('td')).get(2).getText();
            protractor.promise.all([string3, string4]).then(function (data) {
                expect(Date.parse(data[0]) <= Date.parse(data[1])).toBeTruthy();
            });
        });

        it("should be sortable by end date", function () {
            element(by.id("expired-prescription-list")).element(by.linkText("End Date")).click();
            var r1 = element(by.id("expired-prescription-list")).all(by.repeater("prescription in expiredPrescriptions")).get(0);
            var string1 = r1.all(by.tagName('td')).get(3).getText();
            var r2 = element(by.id("expired-prescription-list")).all(by.repeater("prescription in expiredPrescriptions")).get(1);
            var string2 = r2.all(by.tagName('td')).get(3).getText();
            protractor.promise.all([string1, string2]).then(function (data) {
                expect(Date.parse(data[0]) >= Date.parse(data[1])).toBeTruthy();
            });

            element(by.id("expired-prescription-list")).element(by.linkText("End Date")).click();
            var r3 = element(by.id("expired-prescription-list")).all(by.repeater("prescription in expiredPrescriptions")).get(0);
            var string3 = r3.all(by.tagName('td')).get(3).getText();
            var r4 = element(by.id("expired-prescription-list")).all(by.repeater("prescription in expiredPrescriptions")).get(1);
            var string4 = r4.all(by.tagName('td')).get(3).getText();
            protractor.promise.all([string3, string4]).then(function (data) {
                expect(Date.parse(data[0]) <= Date.parse(data[1])).toBeTruthy();
            });
        });

        describe("remove-button", function () {
            it("should ask for confirmation when clicked", function () {
                element.all(by.cssContainingText("tbody tr", "Example Prescription")).get(0).element(by.id("remove-prescription")).click();
                expect(element.all(by.cssContainingText(".modal-title", "Are You Sure?")).count()).toEqual(1);
            });

            it("should delete prescription when confirmed", function () {
                element(by.buttonText("Yes, delete prescription!")).click();
                expect(element.all(by.cssContainingText("tbody tr", "Example Prescription")).count()).toEqual(0);
            });
        });
    });

    it("should log out", function () {
        removePrescriptions();

        element(by.linkText("Logout")).click();
        expect(browser.getTitle()).toBe('Login | CloudMedic Dashboard');
    });
});