'use strict';

describe('Directive:ifPermissionModel', function () {
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

  it('should show element if have admin permission', function () {
    $security.login('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9', {}, ['admin']);
    $rootScope.permission = 'admin';
    var element = $compile([
      '<div ng-if-permission-model="permission">',
      '</div>'
    ].join())($rootScope);

    $rootScope.$digest();

    assert.equal(element.css('display'), '');
  });

  it('should hide element if not have admin permission', function () {
    $security.login('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9', {}, ['staff']);
    $rootScope.permission = 'admin';
    var element = $compile([
      '<div ng-if-permission-model="permission">',
      '</div>'
    ].join())($rootScope);

    $rootScope.$digest();

    assert.equal(element.css('display'), 'none');
  });

  it('should show element if have admin or staff permission', function () {
    $security.login('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9', {}, ['admin']);
    $rootScope.permissions = [
      'admin',
      'staff'
    ];
    var element = $compile([
      '<div ng-if-permission-model="permissions">',
      '</div>'
    ].join())($rootScope);

    $rootScope.$digest();

    assert.equal(element.css('display'), '');
  });

  it('should hide element if not have admin or staff permission', function () {
    $security.login('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9', {}, ['readonly']);
    $rootScope.permissions = [
      'admin',
      'staff'
    ];
    var element = $compile([
      '<div ng-if-permission-model="permissions">',
      '</div>'
    ].join())($rootScope);

    $rootScope.$digest();

    assert.equal(element.css('display'), 'none');
  });
});
