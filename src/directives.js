angular
  .module('ngSecurity')
  .directive('ngIfAuthenticated', ifAuthenticated)
  .directive('ngIfAnonymous', ifAnonymous)
  .directive('ngIfPermission', ifPermission)
  .directive('ngIfAnyPermission', ifAnyPermission);

ifAuthenticated.$inject = ['$cookies'];
ifAnonymous.$inject = ['$cookies'];
ifPermission.$inject = ['$cookies', '$security'];
ifAnyPermission.$inject = ['$cookies', '$security'];

function ifAuthenticated ($cookies) {
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
      return $cookies.get('ng-security-authorization');
    }, function (authorization) {
      if (angular.isDefined(authorization)) {
        element.css('display', defaultStyle);
      } else {
        element.css('display', 'none');
      }
    });
  }
}

function ifAnonymous ($cookies) {
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
      return $cookies.get('ng-security-authorization');
    }, function (authorization) {
      if (angular.isDefined(authorization)) {
        element.css('display', 'none');
      } else {
        element.css('display', defaultStyle);
      }
    });
  }
}

function ifPermission ($cookies, $security) {
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
      return attrs.ngIfPermission;
    }, function (permission) {
      if ($security.hasPermission(permission)) {
        element.css('display', defaultStyle);
      } else {
        element.css('display', 'none');
      }
    });
  }
}

function ifAnyPermission ($cookies, $security) {
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
      return attrs.ngIfAnyPermission;
    }, function (permissions) {
      permissions = permissions.split(',');
      if ($security.hasAnyPermission(permissions)) {
        element.css('display', defaultStyle);
      } else {
        element.css('display', 'none');
      }
    });
  }
}
