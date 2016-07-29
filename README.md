# Cloudmedic's AngularJS dashboard

***

## Introduction

CloudMedic is a fully open-sourced medical application connecting:
* Patients
* Doctors
* Nurses
* Family
* Prescriptions 

CloudMedic's mission is to **accelerate innovations and security in Healthcare IT**. It does so by covering infrastructure and security out of the box while also implementing the most common workflows. And best of all, the total control offered as an open source solution makes customizations or integrations extremely easy.

This is the AngularJS front end for CloudMedic. Note that there is also an open-sourced ASP.NET back-end at this [GitHub repository](https://github.com/crypteron/cloudmedic) that you'll need for a complete solution.

## Getting started

Install [Node.js](http://nodejs.org/download/) and then follow one of the following command line options to get started.

## Command line options

#### Starting from a blank slate
```
git clone https://github.com/crypteron/cloudmedic-angular.git
sudo npm -g install grunt-cli karma bower
npm install
bower install
grunt watch
```

If you need to reinstall npm modules remove everything in `.\node_modules`

#### Run end to end test

`webdriver-manager start` (Starts selenium server for protractor)

`grunt e2e-test`

* One can add the `grunt-protractor-webdriver` task to the gruntfile.js at (example) 
`grunt.registerTask('e2e-test', ['grunt-protractor-webdriver', 'connect:test', 'protractor:e2e']);`
and also at ___________ but it may not display all meaningful stack traces from protractor

Additonal details at __________

#### Build and watch for changes
Update `deploy.config.js` and set URLs for your development and production environment.
Run `grunt build` or `grunt build:production` (defaults to `development`) to build for your environment

Optionally, run `grunt watch` to build in development and watch for changes

**If you add a new file to the build, you need to quit and restart grunt to pick it up.**

#### After adding a new bower component to bower.json, be sure to run
`bower install`

### Running the Angular app 
Finally, open `file:///path/to/cloudmedic-angular/build/index.html` in your browser.


