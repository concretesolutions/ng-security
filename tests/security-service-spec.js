'use strict';

describe('Service:security', function () {
  beforeEach(module('ngSecurity'));
  var $cookies,
      $security,
      $httpBackend;

  beforeEach(inject(function ($injector) {
    $cookies = $injector.get('$cookies');
    $security = $injector.get('$security');
    $httpBackend = $injector.get('$httpBackend');

    $httpBackend.whenPOST('/api/auth', {
      username: 'admin',
      password: 'admin'
    }).respond(201, {
      token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9',
      user: {
        name: 'Patrick Porto'
      }
    });

    $cookies.remove('ng-security-authorization');
    $cookies.remove('ng-security-user');
  }));

  it('should authenticate without user object', function () {
    $security.login('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9');

    assert.equal($cookies.get('ng-security-authorization'), 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9');
  });

  it('should authenticate with user object', function () {
    $security.login('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9', {
      name: 'Patrick Porto'
    });

    assert.equal($cookies.getObject('ng-security-user').name, 'Patrick Porto');
  });

  it('should authenticate by web service', function () {
    $security.loginByUrl('/api/auth', {
      username: 'admin',
      password: 'admin'
    });

    $httpBackend.flush();

    assert.equal($cookies.get('ng-security-authorization'), 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9');
    assert.equal($cookies.getObject('ng-security-user').name, 'Patrick Porto');
  });

  it('should logout user', function () {
    $security.login('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9', {
      name: 'Patrick Porto'
    });
    $security.logout();

    assert.isUndefined($cookies.get('ng-security-authorization'));
    assert.isUndefined($cookies.get('ng-security-user'));
  });
});
