angular.module('cloudmedic.messages', [])
.constant('CRY_MESSAGES',
    {
        'unknown_error': 'An unknown error has occured.  Please contact support.',
        'rename.success': '{{entityType}} renamed successfully.',
        'update.success': '{{entityType}} updated successfully.',
        'update.error': 'Error updating {{entityType}}, {{updateError}}',
        'create.success': 'New {{entityType}} created successfully',
        'delete.success': '{{entityType}} deleted successfully',
        'delete.error': '{{entityType}} could not be deleted',
        'key.refresh.success': 'A new version of Security Partition {{SecPartId}} has been created successfully.',
        'key.refresh.instructions': 'You are about to initiate a key rollover. All new data will use the latest encryption key within this security partition while existing data will continue to use older encryption key. The process takes a couple of seconds and does not disrupt your application availability; though client-side run time caching may delay visibility for up to 10 minutes. Are you sure you want to proceed?',
        'key.refresh.confirm': 'Yes, rollover key',
        'login.verify.success': 'Your account is now verified, please login',
        'login.verify.error': 'Your account could not be verified or link is no longer valid.<br/><a href="/#/login/resendVerify" title="Resend Verification Email">Resend verification email</a>',
        'login.success': 'Welcome to the CloudMedic Dashboard!',                
        'field.required': 'Please provide a value for the {{field}} field.',
        'profile.required': 'Before we begin we ask that you complete your user profile below.',
        'profile.required.force': 'You have to complete your profile before you can navigate to {{pageTitle}}'        
    });