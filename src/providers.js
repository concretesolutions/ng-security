angular
  .module('ngSecurity')
  .provider('$securityConfig', securityConfigProvider);

function securityConfigProvider () {
  var provider = {};
  var config = {
    token: {
      header: 'Authorization',
      storage: 'ng-security-authorization'
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
