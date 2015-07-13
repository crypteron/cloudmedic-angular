/**
 * This file/module contains all configuration for the deploy process.
 */
module.exports = {
    // these are used by grunt-ng-contant to dynamically assemble our APP_CONFIG based on environment
  ngconstant: {
      // Options for all targets
      options: {
          space: '  ',
          name: 'crypteron.config'
      },
      // Environment targets
      development: {
          options: {
              dest: '<%= build_dir %>/<%= app_config %>'
          },
          constants: {
              APP_CONFIG: {
                  environment: 'development',
                  api_url: 'https://localhost:44300/',                  
                  base_uri: ''
              }
          }
      },     
      production: {
          options: {
              dest: '<%= compile_dir %>/<%= app_config %>'
          },
          constants: {
              APP_CONFIG: {
                  environment: 'production',
                  api_url: 'https://api.cloudmedic.io/v1/',
                  base_uri: 'https://az664324.vo.msecnd.net/dashboard/'
              }
          }
      }
  }

};
