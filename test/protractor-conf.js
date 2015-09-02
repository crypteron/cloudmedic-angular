exports.config = {
    // location of the Selenium JAR file and chromedriver, use these if you installed protractor locally
     //seleniumServerJar: '../node_modules/protractor/selenium/selenium-server-standalone-2.45.0.jar',
     //chromeDriver: '../node_modules/protractor/selenium/chromedriver',
    seleniumAddress: 'http://localhost:4444/wd/hub',

    // location of your E2E test specs
    specs: [
        '../test/e2e/register-spec.js',
        //'../test/e2e/profile-spec.js',
        '../test/e2e/admin-spec.js'
        //'../test/e2e/provider-spec.js',
        //'../test/e2e/patient-spec.js',
        //'../test/e2e/supporter-spec.js',
        //'../test/e2e/medication-spec.js',
        //'../test/e2e/prescription-spec.js'
    ],

    // configure multiple browsers to run tests
    //multiCapabilities: [{
    //    'browserName': 'firefox'
    //}, {
    //    'browserName': 'chrome'
    //}],

    // or configure a single browser
    capabilities: {
      browserName: 'chrome'
    },

    // extend default timeout length for bulky get requests (admin page)
    allScriptsTimeout: 15000,

    // url where your app is running, relative URLs are prepending with this URL
    baseUrl: 'http://localhost:9000/',

    // testing framework, jasmine is the default
    framework: 'jasmine2'
};