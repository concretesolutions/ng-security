angular
  .module('ngSecurity')
  .provider('$securityConfig', securityConfigProvider);

function securityConfigProvider () {
  var provider = {};
  var config = {
    token: {
      header: 'Authorization'
    },
    storageName: {
      token: 'ng-security-authorization',
      user: 'ng-security-user',
      permissions: 'ng-security-permissions'
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
