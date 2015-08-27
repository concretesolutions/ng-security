angular
  .module('ngSecurity')
  .directive('ngIfAuthenticated', ifAuthenticated)
  .directive('ngIfAnonymous', ifAnonymous)
  .directive('ngIfPermission', ifPermission)
  .directive('ngIfPermissionModel', ifPermissionModel)
  .directive('ngEnabledPermission', enabledPermission)
  .directive('ngClickLogout', clickLogout)
  .directive('ngBindUser', bindUser)
  .directive('ngSubmitLogin', submitLogin);

ifAuthenticated.$inject = ['$security'];
ifAnonymous.$inject = ['$security'];
ifPermission.$inject = ['$security'];
ifPermissionModel.$inject = ['$security', '$parse'];
enabledPermission.$inject = ['$security'];
clickLogout.$inject = ['$security'];
bindUser.$inject = ['$security'];
submitLogin.$inject = ['$security', '$parse'];

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
        permissions = attrs.ngIfPermission.split(',');

    scope.$watch(function () {
      return $security.getPermissions();
    }, function () {
      if ($security.getPermissionValidation(permissionType)(permissions)) {
        element.css('display', defaultStyle);
      } else {
        element.css('display', 'none');
      }
    }, true);
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

    var updateElement = function (permissions) {
        if ($security.hasPermission(permissions) || $security.getPermissionValidation(permissionType)(permissions)) {
          element.css('display', defaultStyle);
        } else {
          element.css('display', 'none');
        }
    }

    scope.$watch(function () {
      return $parse(attrs.ngIfPermissionModel)(scope);
    }, function (permissions) {
      updateElement(permissions);
    });

    scope.$watch(function () {
      return $security.getPermissions();
    }, function () {
      var permissions = $parse(attrs.ngIfPermissionModel)(scope);
      updateElement(permissions);
    }, true);
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
        permissions = attrs.ngEnabledPermission.split(',');

    scope.$watch(function () {
      return $security.getPermissions();
    }, function () {
      if ($security.getPermissionValidation(permissionType)(permissions)) {
        element.removeAttr('disabled');
      } else {
        element.attr('disabled', 'true');
      }
    }, true);
  }
}

function clickLogout ($security) {
  var directive = {
    link: link,
    restrict: 'A'
  };

  return directive;

  /** implementation */
  function link (scope, element, attrs) {
    element.bind('click', $security.logout);
  }
}

function bindUser ($security) {
  var directive = {
    link: link,
    restrict: 'A'
  };

  return directive;

  /** implementation */
  function link (scope, element, attrs) {
    scope.$watch(function () {
      return $security.getUser();
    }, function (user) {
      element.text(user[attrs.ngBindUser])
    }, true);
  }
}

function submitLogin ($security,  $parse) {
  var directive = {
    link: link,
    restrict: 'A',
    require: '^form'
  };

  return directive;

  /** implementation */
  function link (scope, element, attrs, formCtrl) {
    element.bind('submit', function () {
      var url = attrs.ngSubmitLogin,
          fields = element.find('input'),
          credentials = {};
      angular.forEach(fields, function (input) {
        if (input.type !== 'submit' && !!input.name) {
          credentials[input.name] = input.value;
        }
      })
      $security.loginByUrl(url, credentials);
    });
  }
}
