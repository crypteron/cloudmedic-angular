angular.module('crypteron.resources', [
        'apps.resource',
        'keys.resource',
        'acl.resource',                
        'profile.resource',
        'password.resource',
        'crypteron.config',        
        'users.resource'
    ])
    .config(
        function(AppsProvider,
            KeysProvider,
            AclProvider,            
            ProfileProvider,
            PasswordProvider,
            APP_CONFIG,            
            UsersProvider) {
                AppsProvider.setApiUrl(APP_CONFIG.api_url);
                KeysProvider.setApiUrl(APP_CONFIG.api_url);
                AclProvider.setApiUrl(APP_CONFIG.api_url);                
                ProfileProvider.setApiUrl(APP_CONFIG.api_url);
                PasswordProvider.setApiUrl(APP_CONFIG.api_url);                
                UsersProvider.setApiUrl(APP_CONFIG.api_url);
        }
    );