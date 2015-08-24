angular
  .module('ngSecurity')
  .provider('$securityConfig', securityConfigProvider);

function securityConfigProvider () {
  var provider = {};
  var config = {
    strategy: 'simple',
    token: {
      header: 'Authorization',
      prefix: ''
    },
    storageName: {
      token: 'ng-security-authorization',
      user: 'ng-security-user',
      permissions: 'ng-security-permissions'
    },
    responseErrorName: {
      401: 'unauthenticated',
      403: 'permissionDenied'
    }
  };

  provider.$get = function () {
    return config;
  };

  provider.configure = function (options) {
    config = angular.merge(config, options);
  };

  return provider;
}
