// Supporter page spec
describe("supporter-page", function () {
    //browser.get('#/');

    it("should load", function () {
        // Login as an provider
        element(by.model("loginData.username")).sendKeys("supporter1");
        element(by.model("loginData.password")).sendKeys("Password1.");
        element(by.buttonText("Login to your account")).click();
        expect(browser.getTitle()).toBe('Supporter | CloudMedic Dashboard');
    });

    describe("patients-table", function () {
        it("should be sortable by care team name", function () {
            element(by.id("supporter-list")).element(by.linkText("Care Team")).click();
            var string1 = element(by.id("supporter-list")).all(by.repeater("sTeam in sTeams")).get(0).getText();
            var string2 = element(by.id("supporter-list")).all(by.repeater("sTeam in sTeams")).get(1).getText();
            protractor.promise.all([string1, string2]).then(function (data) {
                expect(data[0].toLowerCase() >= data[1].toLowerCase()).toBeTruthy();
            });

            element(by.id("supporter-list")).element(by.linkText("Care Team")).click();
            var string3 = element(by.id("supporter-list")).all(by.repeater("sTeam in sTeams")).get(0).getText();
            var string4 = element(by.id("supporter-list")).all(by.repeater("sTeam in sTeams")).get(1).getText();
            protractor.promise.all([string3, string4]).then(function (data) {
                expect(data[0].toLowerCase() <= data[1].toLowerCase()).toBeTruthy();
            });
        });

        it("should be sortable by patient name", function () {
            element(by.id("supporter-list")).element(by.linkText("Patient Name")).click();
            var r1 = element(by.id("supporter-list")).all(by.repeater("sTeam in sTeams")).get(0);
            var string1 = r1.all(by.tagName('td')).get(1).getText();
            var r2 = element(by.id("supporter-list")).all(by.repeater("sTeam in sTeams")).get(1);
            var string2 = r2.all(by.tagName('td')).get(1).getText();
            protractor.promise.all([string1, string2]).then(function (data) {
                expect((data[0].toLowerCase())).toBeGreaterThan(data[1].toLowerCase());
            });

            element(by.id("supporter-list")).element(by.linkText("Patient Name")).click();
            var r3 = element(by.id("supporter-list")).all(by.repeater("sTeam in sTeams")).get(0);
            var string3 = r3.all(by.tagName('td')).get(1).getText();
            var r4 = element(by.id("supporter-list")).all(by.repeater("sTeam in sTeams")).get(1);
            var string4 = r4.all(by.tagName('td')).get(1).getText();
            protractor.promise.all([string3, string4]).then(function (data) {
                expect((data[0].toLowerCase())).toBeLessThan(data[1].toLowerCase());
            });
        });
    });

    describe("medication-history-view", function () {
        it("should open on selecting button", function () {
            patient = element(by.cssContainingText("tbody tr", "Patient, Example"));
            patient.element(by.id("medication-info")).click();

            expect(element.all(by.cssContainingText("h2", "Medications for: Patient, Example")).count()).toEqual(1);
        });

        describe("table", function () {
            it("should be sortable by med name", function () {
                element(by.id("prescription-list")).element(by.linkText("Medication")).click();
                var string1 = element(by.id("prescription-list")).all(by.repeater("prescription in prescriptions")).get(0).getText();
                var string2 = element(by.id("prescription-list")).all(by.repeater("prescription in prescriptions")).get(1).getText();
                protractor.promise.all([string1, string2]).then(function (data) {
                    expect(data[0].toLowerCase() >= data[1].toLowerCase()).toBeTruthy();
                });

                element(by.id("prescription-list")).element(by.linkText("Medication")).click();
                var string3 = element(by.id("prescription-list")).all(by.repeater("prescription in prescriptions")).get(0).getText();
                var string4 = element(by.id("prescription-list")).all(by.repeater("prescription in prescriptions")).get(1).getText();
                protractor.promise.all([string3, string4]).then(function (data) {
                    expect(data[0].toLowerCase() <= data[1].toLowerCase()).toBeTruthy();
                });
            });
        });

        it("should close on exit button", function () {
            element(by.id("close-meds-btn")).click();
            expect(element(by.id("supporter-list")).isDisplayed()).toBeTruthy();
        });
    });

    it("should log out", function () {
        element(by.linkText("Logout")).click();
        expect(browser.getTitle()).toBe('Login | CloudMedic Dashboard');
    });
});