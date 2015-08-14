angular
  .module('ngSecurity')
  .directive('ngIfAuthenticated', ifAuthenticated);

ifAuthenticated.$inject = ['$cookies', '$timeout'];

function ifAuthenticated ($cookies, $timeout) {
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
