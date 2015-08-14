// Provider page spec
describe("provider-page", function () {
    //browser.get('#/');

    beforeAll(function () {
        // Login as an provider
        element(by.model("loginData.username")).sendKeys("doctor1");
        element(by.model("loginData.password")).sendKeys("Password1?");
        element(by.buttonText("Login to your account")).click();
    });

    it("should load", function () {
        expect(browser.getTitle()).toBe('Provider | CloudMedic Dashboard');
    });

    describe("patients-table", function () {
        it("should be sortable by patient name", function () {
            element(by.id("careteams-list")).element(by.linkText("Patient")).click();
            var string1 = element(by.id("careteams-list")).all(by.repeater("careTeam in careTeams")).get(0).getText();
            var string2 = element(by.id("careteams-list")).all(by.repeater("careTeam in careTeams")).get(1).getText();
            protractor.promise.all([string1, string2]).then(function (data) {
                expect(data[0].toLowerCase() >= data[1].toLowerCase()).toBeTruthy();
            });

            element(by.id("careteams-list")).element(by.linkText("Patient")).click();
            var string3 = element(by.id("careteams-list")).all(by.repeater("careTeam in careTeams")).get(0).getText();
            var string4 = element(by.id("careteams-list")).all(by.repeater("careTeam in careTeams")).get(1).getText();
            protractor.promise.all([string3, string4]).then(function (data) {
                expect(data[0].toLowerCase() <= data[1].toLowerCase()).toBeTruthy();
            });
        });

        it("should be sortable by dob", function () {
            element(by.id("careteams-list")).element(by.linkText("Date of Birth")).click();
            var r1 = element(by.id("careteams-list")).all(by.repeater("careTeam in careTeams")).get(0);
            var string1 = r1.all(by.tagName('td')).get(1).getText();
            var r2 = element(by.id("careteams-list")).all(by.repeater("careTeam in careTeams")).get(1);
            var string2 = r2.all(by.tagName('td')).get(1).getText();
            protractor.promise.all([string1, string2]).then(function (data) {
                expect(Date.parse(data[0])).toBeGreaterThan(Date.parse(data[1]));
            });

            element(by.id("careteams-list")).element(by.linkText("Date of Birth")).click();
            var r3 = element(by.id("careteams-list")).all(by.repeater("careTeam in careTeams")).get(0);
            var string3 = r3.all(by.tagName('td')).get(1).getText();
            var r4 = element(by.id("careteams-list")).all(by.repeater("careTeam in careTeams")).get(1);
            var string4 = r4.all(by.tagName('td')).get(1).getText();
            protractor.promise.all([string3, string4]).then(function (data) {
                expect(Date.parse(data[0])).toBeLessThan(Date.parse(data[1]));
            });
        });

        //it("should be sortable by gender", function () {
        //    element(by.id("careteams-list")).element(by.linkText("Email")).click();
        //    var r1 = element(by.id("careteams-list")).all(by.repeater("patient in users")).get(0);
        //    var string1 = r1.all(by.tagName('td')).get(2).getText();
        //    var r2 = element(by.id("careteams-list")).all(by.repeater("patient in users")).get(1);
        //    var string2 = r2.all(by.tagName('td')).get(2).getText();
        //    protractor.promise.all([string1, string2]).then(function (data) {
        //        expect((data[0].toLowerCase())).toBeGreaterThan(data[1].toLowerCase());
        //    });

        //    element(by.id("careteams-list")).element(by.linkText("Email")).click();
        //    var r3 = element(by.id("careteams-list")).all(by.repeater("patient in users")).get(0);
        //    var string3 = r3.all(by.tagName('td')).get(2).getText();
        //    var r4 = element(by.id("careteams-list")).all(by.repeater("patient in users")).get(1);
        //    var string4 = r4.all(by.tagName('td')).get(2).getText();
        //    protractor.promise.all([string3, string4]).then(function (data) {
        //        expect((data[0].toLowerCase())).toBeLessThan(data[1].toLowerCase());
        //    });
        //});

        it("should be sortable by careteam name", function () {
            element(by.id("careteams-list")).element(by.linkText("CareTeam Name")).click();
            var r1 = element(by.id("careteams-list")).all(by.repeater("careTeam in careTeams")).get(0);
            var string1 = r1.all(by.tagName('td')).get(4).getText();
            var r2 = element(by.id("careteams-list")).all(by.repeater("careTeam in careTeams")).get(1);
            var string2 = r2.all(by.tagName('td')).get(4).getText();
            protractor.promise.all([string1, string2]).then(function (data) {
                expect((data[0].toLowerCase())).toBeGreaterThan(data[1].toLowerCase());
            });

            element(by.id("careteams-list")).element(by.linkText("CareTeam Name")).click();
            var r3 = element(by.id("careteams-list")).all(by.repeater("careTeam in careTeams")).get(0);
            var string3 = r3.all(by.tagName('td')).get(4).getText();
            var r4 = element(by.id("careteams-list")).all(by.repeater("careTeam in careTeams")).get(1);
            var string4 = r4.all(by.tagName('td')).get(4).getText();
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

            it("should be sortable by start date", function () {
                element(by.id("prescription-list")).element(by.linkText("Start Date")).click();
                var r1 = element(by.id("prescription-list")).all(by.repeater("prescription in prescriptions")).get(0);
                var string1 = r1.all(by.tagName('td')).get(1).getText();
                var r2 = element(by.id("prescription-list")).all(by.repeater("prescription in prescriptions")).get(1);
                var string2 = r2.all(by.tagName('td')).get(1).getText();
                protractor.promise.all([string1, string2]).then(function (data) {
                    expect(Date.parse(data[0])).toBeGreaterThan(Date.parse(data[1]));
                });

                element(by.id("prescription-list")).element(by.linkText("Start Date")).click();
                var r3 = element(by.id("prescription-list")).all(by.repeater("prescription in prescriptions")).get(0);
                var string3 = r3.all(by.tagName('td')).get(1).getText();
                var r4 = element(by.id("prescription-list")).all(by.repeater("prescription in prescriptions")).get(1);
                var string4 = r4.all(by.tagName('td')).get(1).getText();
                protractor.promise.all([string3, string4]).then(function (data) {
                    expect(Date.parse(data[0])).toBeLessThan(Date.parse(data[1]));
                });
            });

            it("should be sortable by end date", function () {
                element(by.id("prescription-list")).element(by.linkText("End Date")).click();
                var r1 = element(by.id("prescription-list")).all(by.repeater("prescription in prescriptions")).get(0);
                var string1 = r1.all(by.tagName('td')).get(2).getText();
                var r2 = element(by.id("prescription-list")).all(by.repeater("prescription in prescriptions")).get(1);
                var string2 = r2.all(by.tagName('td')).get(2).getText();
                protractor.promise.all([string1, string2]).then(function (data) {
                    expect(Date.parse(data[0])).toBeGreaterThan(Date.parse(data[1]));
                });

                element(by.id("prescription-list")).element(by.linkText("End Date")).click();
                var r3 = element(by.id("prescription-list")).all(by.repeater("prescription in prescriptions")).get(0);
                var string3 = r3.all(by.tagName('td')).get(2).getText();
                var r4 = element(by.id("prescription-list")).all(by.repeater("prescription in prescriptions")).get(1);
                var string4 = r4.all(by.tagName('td')).get(2).getText();
                protractor.promise.all([string3, string4]).then(function (data) {
                    expect(Date.parse(data[0])).toBeLessThan(Date.parse(data[1]));
                });
            });
        });
    });

    it("should log out", function () {
        element(by.id("close-btn")).click();
        element(by.linkText("Logout")).click();
        expect(browser.getTitle()).toBe('Login | CloudMedic Dashboard');
    });
});