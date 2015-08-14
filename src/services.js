angular
  .module('ngSecurity')
  .factory('$security', securityFactory);

securityFactory.$inject = ['$cookies'];

function securityFactory ($cookies) {
  /** interface */
  var security = {
    login: login
  };

  return security;

  /** implementation */
  function login (token, user) {
    $cookies.put('ng-security-authorization', token);
    $cookies.putObject('ng-security-user', user);
  }
}
