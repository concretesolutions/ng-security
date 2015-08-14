angular
  .module('ngSecurity')
  .factory('$security', securityFactory);

securityFactory.$inject = ['$cookies', '$q', '$http'];

function securityFactory ($cookies, $q, $http) {
  /** interface */
  var security = {
    login: login,
    loginByUrl: loginByUrl,
    logout: logout
  };

  return security;

  /** implementation */
  function login (token, user) {
    $cookies.put('ng-security-authorization', token);
    $cookies.putObject('ng-security-user', user);
  }

  function loginByUrl (url, data) {
    return $q(function (resolve, reject) {
      $http.post(url, data).success(function (data) {
        security.login(data.token, data.user);
        resolve(data);
      }).error(reject);
    });
  }

  function logout () {
    $cookies.remove('ng-security-authorization');
    $cookies.remove('ng-security-user');
  }
}
