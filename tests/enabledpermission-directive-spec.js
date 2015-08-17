'use strict';

describe('Directive:ifAnonymous', function () {
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

  it('should show element if user has admin permission', function () {
    $security.login('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9', {}, ['admin']);

    var element = $compile([
      '<button ng-enabled-permission="admin">',
        'Add User',
      '</button>'
    ].join())($rootScope);

    $rootScope.$digest();

    assert.isUndefined(element.attr('disabled'));
  });

  it('should hide element if user not has admin permission', function () {
    $security.login('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9', {}, ['staff']);

    var element = $compile([
      '<button ng-enabled-permission="admin">',
        'Add User',
      '</button>'
    ].join())($rootScope);

    $rootScope.$digest();

    assert.isDefined(element.attr('disabled'));
  });
});
