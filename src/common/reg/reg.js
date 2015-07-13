angular.module('reg', ['reg.service', 'reg.messages', 'localizedMessages', 'reg.interceptor', 'reg.ssoProviders'])
.run(['REG_MESSAGES', 'localizedMessages', function (REG_MESSAGES, localizedMessages) {
    // Add authentication messages to localized message collection but allow app to over write
    localizedMessages.addIfNotExists(REG_MESSAGES);
}
]);
