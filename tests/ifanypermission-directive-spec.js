'use strict';

describe('Directive:ifAnyPermission', function () {
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

  it('should show element if have admin or staff permission', function () {
    $security.login('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9', {}, ['staff']);

    var element = $compile([
      '<div ng-if-any-permission="admin,staff">',
      '</div>'
    ].join())($rootScope);

    $rootScope.$digest();

    assert.equal(element.css('display'), '');
  });

  it('should hide element if not have admin or staff permission', function () {
    $security.login('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9', {}, ['readonly']);

    var element = $compile([
      '<div ng-if-any-permission="admin,staff">',
      '</div>'
    ].join())($rootScope);

    $rootScope.$digest();

    assert.equal(element.css('display'), 'none');
  });
});
