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

  it('should enabled element if user has admin permission', function () {
    $security.login('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9', {}, ['admin']);

    var element = $compile([
      '<button ng-enabled-permission="admin">',
        'Add User',
      '</button>'
    ].join())($rootScope);

    $rootScope.$digest();

    assert.isUndefined(element.attr('disabled'));
  });

  it('should enabled element if user not has admin permission', function () {
    $security.login('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9', {}, ['staff']);

    var element = $compile([
      '<button ng-enabled-permission="admin">',
        'Add User',
      '</button>'
    ].join())($rootScope);

    $rootScope.$digest();

    assert.isDefined(element.attr('disabled'));
  });

  it('should enabled element if user has admin or staff permission', function () {
    $security.login('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9', {}, ['admin']);

    var element = $compile([
      '<button ng-enabled-permission="admin,staff">',
        'Add User',
      '</button>'
    ].join())($rootScope);

    $rootScope.$digest();

    assert.isUndefined(element.attr('disabled'));
  });

  it('should enabled element if user not has admin or staff permission', function () {
    $security.login('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9', {}, ['readonly']);

    var element = $compile([
      '<button ng-enabled-permission="admin,staff">',
        'Add User',
      '</button>'
    ].join())($rootScope);

    $rootScope.$digest();

    assert.isDefined(element.attr('disabled'));
  });

  it('should enabled element if user has admin and staff permission', function () {
    $security.login('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9', {}, ['admin', 'staff']);

    var element = $compile([
      '<button ng-enabled-permission="admin,staff" ng-permission-type="ALL">',
        'Add User',
      '</button>'
    ].join())($rootScope);

    $rootScope.$digest();

    assert.isUndefined(element.attr('disabled'));
  });

  it('should enabled element if user not has admin and staff permission', function () {
    $security.login('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9', {}, ['admin']);

    var element = $compile([
      '<button ng-enabled-permission="admin,staff" ng-permission-type="ALL">',
        'Add User',
      '</button>'
    ].join())($rootScope);

    $rootScope.$digest();

    assert.isDefined(element.attr('disabled'));
  });
});
