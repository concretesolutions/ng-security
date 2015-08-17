angular
  .module('ngSecurity')
  .factory('$security', securityFactory)
  .factory('$securityInterceptor', securityInterceptor);

securityFactory.$inject = ['$cookies', '$q', '$http'];
securityInterceptor.$inject = ['$rootScope', '$q', '$cookies'];

function securityFactory ($cookies, $q, $http) {
  /** interface */
  var security = {
    login: login,
    loginByUrl: loginByUrl,
    logout: logout,
    hasPermission: hasPermission,
    hasAllPermission: hasAllPermission,
    hasAnyPermission: hasAnyPermission,
    isAuthenticated: isAuthenticated,
    getUser: getUser
  };

  return security;

  /** implementation */
  function login (token, user, permissions) {
    $cookies.put('ng-security-authorization', token);
    $cookies.putObject('ng-security-user', user);
    $cookies.putObject('ng-security-permissions', permissions);
  }

  function loginByUrl (url, data) {
    return $q(function (resolve, reject) {
      $http.post(url, data).success(function (data) {
        security.login(data.token, data.user, data.permissions);
        resolve(data);
      }).error(reject);
    });
  }

  function logout () {
    $cookies.remove('ng-security-authorization');
    $cookies.remove('ng-security-user');
  }

  function hasPermission (permissionRequired) {
    var permissions = $cookies.getObject('ng-security-permissions');
    return permissions.indexOf(permissionRequired) !== -1;
  }

  function hasAllPermission (permissionsRequired) {
    var permissions = $cookies.getObject('ng-security-permissions'),
        exists = true;
    if (angular.isDefined(permissionsRequired)) {
      angular.forEach(permissionsRequired, function (permission) {
        if (permissions.indexOf(permission) === -1) {
          exists = false;
        }
      });
    } else {
      exists = false;
    }
    return exists;
  }

  function hasAnyPermission (permissionsRequired) {
    var permissions = $cookies.getObject('ng-security-permissions'),
        exists = false;
    if (angular.isDefined(permissionsRequired)) {
      angular.forEach(permissionsRequired, function (permission) {
        if (permissions.indexOf(permission) !== -1) {
          exists = true;
        }
      });
    }
    return exists;
  }

  function isAuthenticated () {
    return !!$cookies.get('ng-security-authorization');
  }

  function getUser () {
    return $cookies.getObject('ng-security-user');
  }
}

function securityInterceptor ($rootScope, $q, $cookies) {
  /** interface */
  var interceptor = {
    request: request,
    responseError: responseError
  };

  return interceptor;

  /** implementation */
  function request (config) {
    config.headers.Authorization = $cookies.get('ng-security-authorization');
    return config;
  }

  function responseError (response) {
    var events = {
      401: 'unauthenticated',
      403: 'permissionDenied'
    };
    if (events[response.status]) {
      $rootScope.$broadcast(events[response.status], response);
    }
    return $q.reject(response);
  }
}
