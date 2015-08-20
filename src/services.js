angular
  .module('ngSecurity')
  .factory('$security', securityFactory)
  .factory('$securityInterceptor', securityInterceptor);

securityFactory.$inject = ['$cookies', '$q', '$http', '$securityConfig'];
securityInterceptor.$inject = ['$rootScope', '$q', '$cookies', '$securityConfig'];

function securityFactory ($cookies, $q, $http, $securityConfig) {
  /** interface */
  var security = {
    login: login,
    loginByUrl: loginByUrl,
    logout: logout,
    hasPermission: hasPermission,
    hasAllPermission: hasAllPermission,
    hasAnyPermission: hasAnyPermission,
    getPermissionValidation: getPermissionValidation,
    isAuthenticated: isAuthenticated,
    getUser: getUser
  };

  return security;

  /** implementation */
  function login (token, user, permissions) {
    $cookies.put($securityConfig.token.storage, token);
    $cookies.putObject($securityConfig.user.storage, user);
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
    $cookies.remove($securityConfig.token.storage);
    $cookies.remove($securityConfig.user.storage);
    $cookies.remove('ng-security-permissions');
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

  function getPermissionValidation (permissionType) {
    var validations = {
      'ANY': security.hasAnyPermission,
      'ALL': security.hasAllPermission
    };
    if (!permissionType) {
      permissionType = 'ANY';
    }
    return validations[permissionType];
  }

  function isAuthenticated () {
    return !!$cookies.get($securityConfig.token.storage);
  }

  function getUser () {
    return $cookies.getObject($securityConfig.user.storage);
  }
}


function securityInterceptor ($rootScope, $q, $cookies, $securityConfig) {
  /** interface */
  var interceptor = {
    request: request,
    responseError: responseError
  };

  return interceptor;

  /** implementation */
  function request (config) {
    config.headers[$securityConfig.token.header] = $cookies.get($securityConfig.token.storage);
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
