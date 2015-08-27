# Cloudmedic's AngularJS dashboard

***

## Introduction

Install [Node.js](http://nodejs.org/download/) and then follow one of the following command line options to get started.

## Command line options

#### Starting from a blank slate
```
git clone git@bitbucket.org:Crypteron/cloudmedic-angular.git
npm -g install grunt-cli karma bower protractor
npm install
webdriver-manager update
bower install
grunt watch
```

#### Run end to end test

`webdriver-manager start` (Starts selenium server for protractor)

`grunt e2e-test`

* One can add the `grunt-protractor-webdriver` task to the gruntfile.js at (example) 
`grunt.registerTask('e2e-test', ['grunt-protractor-webdriver', 'connect:test', 'protractor:e2e']);`
and also at ___________ but it may not display all meaningful stack traces from protractor

Additonal details at __________

#### Build and watch for changes

`grunt watch` (FYI, this also does a `grunt build` behind the scenes)

**If you add a new file to the build, you need to quit and restart grunt to pick it up.**

#### Prepare for production, including minification etc

`grunt compile` 

#### Update links for the relevant environment

`grunt deploy staging` or `grunt deploy production`  

#### A new 3rd party bower component is added
`bower install`

### Running the Angular app 
Finally, open `file:///path/to/crypteron-dashboard/build/index.html` in your browser.


