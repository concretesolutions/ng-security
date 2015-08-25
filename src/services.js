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
  }, authStrategy = {
    'jwt': authStrategyJWT,
    'simple': authStrategySimple
  };

  return security;

  /** implementation */
  function login () {
    return authStrategy[$securityConfig.strategy].apply(this, arguments);
  }

  function authStrategyJWT(token, permissions) {
    var user,
        userEncoded;
    userEncoded = token.split('.')[1];
    if ((userEncoded.length % 4) === 2) {
      userEncoded += '==';
    } else if ((userEncoded.length % 4) === 3) {
      userEncoded += '=';
    } else if ((userEncoded.length % 4) !== 0) {
      throw 'Invalid token string.';
    }
    user = JSON.parse(atob(userEncoded + '=='));
    $cookies.put($securityConfig.storageName.token, $securityConfig.token.prefix + token);
    $cookies.putObject($securityConfig.storageName.user, user);
    $cookies.putObject($securityConfig.storageName.permissions, permissions);
  }

  function authStrategySimple(token, user, permissions) {
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
    if (!permissions) {
      return false;
    }
    return permissions.indexOf(permissionRequired) !== -1;
  }

  function hasAllPermission (permissionsRequired) {
    var permissions = $cookies.getObject($securityConfig.storageName.permissions),
        exists = true;
    if (!!permissionsRequired && !!permissions) {
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
    if (!!permissionsRequired && !!permissions) {
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
