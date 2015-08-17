angular
  .module('ngSecurity')
  .directive('ngIfAuthenticated', ifAuthenticated)
  .directive('ngIfAnonymous', ifAnonymous)
  .directive('ngIfPermission', ifPermission);

ifAuthenticated.$inject = ['$cookies'];
ifAnonymous.$inject = ['$cookies'];
ifPermission.$inject = ['$cookies'];

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

function ifPermission ($cookies) {
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
      var permissions = $cookies.getObject('ng-security-permissions');
      if (permissions.indexOf(permission) !== -1) {
        element.css('display', defaultStyle);
      } else {
        element.css('display', 'none');
      }
    });
  }
}
