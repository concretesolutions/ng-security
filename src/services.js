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
    $cookies.put($securityConfig.storageName.token, $securityConfig.token.prefix + token);
    $cookies.putObject($securityConfig.storageName.user, user);
    $cookies.putObject($securityConfig.storageName.permissions, permissions);
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
    $cookies.remove($securityConfig.storageName.token);
    $cookies.remove($securityConfig.storageName.user);
    $cookies.remove($securityConfig.storageName.permissions);
  }

  function hasPermission (permissionRequired) {
    var permissions = $cookies.getObject($securityConfig.storageName.permissions);
    return permissions.indexOf(permissionRequired) !== -1;
  }

  function hasAllPermission (permissionsRequired) {
    var permissions = $cookies.getObject($securityConfig.storageName.permissions),
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
    var permissions = $cookies.getObject($securityConfig.storageName.permissions),
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
    return !!$cookies.get($securityConfig.storageName.token);
  }

  function getUser () {
    return $cookies.getObject($securityConfig.storageName.user);
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
    config.headers[$securityConfig.token.header] = $cookies.get($securityConfig.storageName.token);
    return config;
  }

  function responseError (response) {
    var events = $securityConfig.responseErrorName;
    if (events[response.status]) {
      $rootScope.$broadcast(events[response.status], response);
    }
    return $q.reject(response);
  }
}
