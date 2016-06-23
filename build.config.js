/**
 * This file/module contains all configuration for the build process.
 */
module.exports = {
  /**
   * The `build_dir` folder is where our projects are compiled during
   * development and the `compile_dir` folder is where our app resides once it's
   * completely built.
   */
    build_dir: 'build',
    compile_dir: 'bin',
    app_config: 'assets/app.config.js',

  /**
   * This is a collection of file patterns that refer to our app code (the
   * stuff in `src/`). These file paths are used in the configuration of
   * build tasks. `js` is all project javascript, less tests. `ctpl` contains
   * our reusable components' (`src/common`) template HTML files, while
   * `atpl` contains the same, but for our app's code. `html` is just our
   * main HTML file, `less` is our main stylesheet, and `unit` contains our
   * app's unit tests.
   */
  app_files: {
    js: [ 'src/**/*.js', '!src/**/*.spec.js', '!src/assets/**/*.js' ],
    jsunit: [ 'src/**/*.spec.js' ],
    
    coffee: [ 'src/**/*.coffee', '!src/**/*.spec.coffee' ],
    coffeeunit: [ 'src/**/*.spec.coffee' ],

    atpl: [ 'src/app/**/*.tpl.html' ],
    ctpl: [ 'src/common/**/*.tpl.html' ],

    html: [ 'src/index.html' ],
    less: 'src/less/main.less',
      external_css: [{
          name: 'fontAwesome',
          url: 'https://maxcdn.bootstrapcdn.com/font-awesome/4.3.0/css/font-awesome.min.css',
          local: 'assets/font-awesome.css'
      }, {
          name: 'openSans',
          url: 'https://fonts.googleapis.com/css?family=Open+Sans:400,300,600,700,800,300italic,400italic,600italic,700italic,800italic',
          local: 'assets/opensans.css'
      }]
  },

  /**
   * This is a collection of files used during testing only.
   */
  test_files: {
    js: [
        'vendor/angular-mocks/angular-mocks.js',
        'vendor/angular-resource/angular-resource.min.js',
        'vendor/angular-ui-router/release/angular-ui-router.js'
    ]
  },

  /**
   * This is the same as `app_files`, except it contains patterns that
   * reference vendor code (`vendor/`) that we need to place into the build
   * process somewhere. While the `app_files` property ensures all
   * standardized files are collected for compilation, it is the user's job
   * to ensure non-standardized (i.e. vendor-related) files are handled
   * appropriately in `vendor_files.js`.
   *
   * The `vendor_files.js` property holds files to be automatically
   * concatenated and minified with our project source files.
   *
   * The `vendor_files.css` property holds any CSS files to be automatically
   * included in our app.
   *
   * The `vendor_files.assets` property holds any assets to be copied along
   * with our app's assets. This structure is flattened, so it is not
   * recommended that you use wildcards.
   */
  vendor_files: {
      js: [
         'vendor/jquery/dist/jquery.min.js',
         'vendor/angular/angular.js',
         'vendor/angular-bootstrap/ui-bootstrap-tpls.js',
         'vendor/angular-ui-router/release/angular-ui-router.js',
         'vendor/angular-ui-utils/modules/route/route.js',
         'vendor/angular-loading-bar/build/loading-bar.js',
         'vendor/angular-animate/angular-animate.js',
         'vendor/angular-resource/angular-resource.js',
         'vendor/angular-local-storage/dist/angular-local-storage.js',
         'vendor/angular-xeditable/dist/js/xeditable.js',        
         'vendor/angular-sanitize/angular-sanitize.min.js',
         'vendor/flexslider/jquery.flexslider.js',
         'vendor/angulartics/dist/angulartics.min.js',
         'vendor/angulartics/dist/angulartics-ga.min.js',
         'vendor/Chart.js/Chart.min.js',
         'vendor/angular-chart.js/dist/angular-chart.min.js',
         'vendor/angular-ui-mask/dist/mask.js'
    ],
    css: [
        'vendor/angular-loading-bar/build/loading-bar.css',
        'vendor/angular-xeditable/dist/css/xeditable.css',
        'vendor/flexslider/flexslider.css',
        'vendor/angular-chart.js/dist/angular-chart.css'
    ],
    assets: [
        'vendor/bootstrap/dist/fonts/glyphicons-halflings-regular.eot',
        'vendor/bootstrap/dist/fonts/glyphicons-halflings-regular.svg',
        'vendor/bootstrap/dist/fonts/glyphicons-halflings-regular.ttf',
        'vendor/bootstrap/dist/fonts/glyphicons-halflings-regular.woff'        
    ]
  }
};
