'use strict';

describe('Directive:clickLogout', function () {
  beforeEach(module('ngSecurity'));
  var $security,
      $compile,
      $rootScope;

  beforeEach(inject(function ($injector) {
    $security = $injector.get('$security');
    $compile = $injector.get('$compile');
    $rootScope = $injector.get('$rootScope');

    $security.logout();
  }));

  it('should logout user', function () {
    $security.login('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9');

    var element = $compile([
      '<div ng-click-logout>',
      '</div>'
    ].join())($rootScope);

    element.triggerHandler('click');

    assert.isFalse($security.isAuthenticated());
  });
});
