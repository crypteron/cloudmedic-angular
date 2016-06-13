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
git clone git@bitbucket.org:Crypteron/crypteron-dashboard.git
sudo npm -g install grunt-cli karma bower
sudo npm install
bower install
grunt watch
```

#### Build and watch for changes

Update `deploy.config.js` for your environment.
NOTE: only the `build` operation works. The `compile` step is triggering annotatino errors to be fixed.

`grunt watch` (FYI, this also does a `grunt build` behind the scenes)

To deploy to a different environment (determined in deploy.config.js) use `grunt build:production` or replace `production` with environment

**If you add a new file to the build, you need to quit and restart grunt to pick it up.**

#### A new 3rd party bower component is added
`bower install`

### Running the Angular app 
Finally, open `file:///path/to/crypteron-dashboard/build/index.html` in your browser.


