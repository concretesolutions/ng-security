/*
 ngsecurity v1.0.2
 (c) 2015 Concrete Solutions, Inc.
 License: MIT
*/
'use strict';
(function () {angular
  .module('ngSecurity')
  .directive('ngIfAuthenticated', ifAuthenticated)
  .directive('ngIfAnonymous', ifAnonymous)
  .directive('ngIfPermission', ifPermission)
  .directive('ngIfPermissionModel', ifPermissionModel)
  .directive('ngEnabledPermission', enabledPermission);

ifAuthenticated.$inject = ['$security'];
ifAnonymous.$inject = ['$security'];
ifPermission.$inject = ['$security'];
ifPermissionModel.$inject = ['$security', '$parse'];
enabledPermission.$inject = ['$security'];

function ifAuthenticated ($security) {
  /** interface */
  var directive = {
    link: link,
    restrict: 'A'
  };

  return directive;

  /** implementation */
  function link (scope, element, attrs) {
    var defaultStyle = element.css('display');
    scope.$watch(function () {
      return $security.isAuthenticated();
    }, function (authorization) {
      if (authorization) {
        element.css('display', defaultStyle);
      } else {
        element.css('display', 'none');
      }
    });
  }
}

function ifAnonymous ($security) {
  /** interface */
  var directive = {
    link: link,
    restrict: 'A'
  };

  return directive;

  /** implementation */
  function link (scope, element, attrs) {
    var defaultStyle = element.css('display');
    scope.$watch(function () {
      return $security.isAuthenticated();
    }, function (authorization) {
      if (authorization) {
        element.css('display', 'none');
      } else {
        element.css('display', defaultStyle);
      }
    });
  }
}

function ifPermission ($security) {
  /** interface */
  var directive = {
    link: link,
    restrict: 'A'
  };

  return directive;

  /** implementation */
  function link (scope, element, attrs) {
    var defaultStyle = element.css('display'),
        permissionType = attrs.ngPermissionType;
    scope.$watch(function () {
      return attrs.ngIfPermission;
    }, function (permission) {
      var permissions = permission.split(',');
      if ($security.getPermissionValidation(permissionType)(permissions)) {
        element.css('display', defaultStyle);
      } else {
        element.css('display', 'none');
      }
    });
  }
}

function ifPermissionModel ($security, $parse) {
  /** interface */
  var directive = {
    link: link,
    restrict: 'A'
  };

  return directive;

  /** implementation */
  function link (scope, element, attrs) {
    var defaultStyle = element.css('display'),
        permissionType = attrs.ngPermissionType;

    scope.$watch(function () {
      return $parse(attrs.ngIfPermissionModel)(scope);
    }, function (permissions) {
      if ($security.hasPermission(permissions) || $security.getPermissionValidation(permissionType)(permissions)) {
        element.css('display', defaultStyle);
      } else {
        element.css('display', 'none');
      }
    });
  }
}

function enabledPermission ($security) {
  /** interface */
  var directive = {
    link: link,
    restrict: 'A'
  };

  return directive;

  /** implementation */
  function link (scope, element, attrs) {
    var permissionType = attrs.ngPermissionType;

    scope.$watch(function () {
      return attrs.ngEnabledPermission;
    }, function (permission) {
      var permissions = permission.split(',');
      if ($security.getPermissionValidation(permissionType)(permissions)) {
        element.removeAttr('disabled');
      } else {
        element.attr('disabled', 'true');
      }
    });
  }
}

angular.module('ngSecurity', [
  'ngCookies'
]);

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
    getPermissionValidation: getPermissionValidation,
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
}).call(window);