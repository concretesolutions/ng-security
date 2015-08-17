angular
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
        permissionType = attrs.ngPermissionType,
        validations = {
          'ANY': $security.hasAnyPermission,
          'ALL': $security.hasAllPermission
        };
    if (!validations[permissionType]) {
      permissionType = 'ANY';
    }
    scope.$watch(function () {
      return attrs.ngIfPermission;
    }, function (permission) {
      var permissions = permission.split(',');
      if (validations[permissionType](permissions)) {
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
        permissionType = attrs.ngPermissionType,
        validations = {
          'ANY': $security.hasAnyPermission,
          'ALL': $security.hasAllPermission
        };
    if (!validations[permissionType]) {
      permissionType = 'ANY';
    }

    scope.$watch(function () {
      return $parse(attrs.ngIfPermissionModel)(scope);
    }, function (permissions) {
      if ($security.hasPermission(permissions) || validations[permissionType](permissions)) {
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
    var permissionType = attrs.ngPermissionType,
        validations = {
          'ANY': $security.hasAnyPermission,
          'ALL': $security.hasAllPermission
        };
    if (!validations[permissionType]) {
      permissionType = 'ANY';
    }
    scope.$watch(function () {
      return attrs.ngEnabledPermission;
    }, function (permission) {
      var permissions = permission.split(',');
      if (validations[permissionType](permissions)) {
        element.removeAttr('disabled');
      } else {
        element.attr('disabled', 'true');
      }
    });
  }
}
