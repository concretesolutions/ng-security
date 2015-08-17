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
      },
      permissions: [
        'admin'
      ]
    });

    $cookies.remove('ng-security-authorization');
    $cookies.remove('ng-security-user');
    $cookies.remove('ng-security-permissions');
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

  it('should authenticate with permissions', function () {
    $security.login('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9', {
      name: 'Patrick Porto'
    }, [
      'admin'
    ]);

    assert.include($cookies.getObject('ng-security-permissions'), 'admin');
  });

  it('should authenticate by web service', function () {
    $security.loginByUrl('/api/auth', {
      username: 'admin',
      password: 'admin'
    });

    $httpBackend.flush();

    assert.equal($cookies.get('ng-security-authorization'), 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9');
    assert.equal($cookies.getObject('ng-security-user').name, 'Patrick Porto');
    assert.include($cookies.getObject('ng-security-permissions'), 'admin');
  });

  it('should logout user', function () {
    $security.login('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9', {
      name: 'Patrick Porto'
    });
    $security.logout();

    assert.isUndefined($cookies.get('ng-security-authorization'));
    assert.isUndefined($cookies.get('ng-security-user'));
  });

  it('should verify if user has permission', function () {
    $security.login('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9', {
      name: 'Patrick Porto'
    }, [
      'staff'
    ]);

    assert.isFalse($security.hasPermission('admin'), 'user is admin');
    assert.isTrue($security.hasPermission('staff'), 'user is staff');
  });

  it('should verify if user has admin or staff permission', function () {
    $security.login('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9', {
      name: 'Patrick Porto'
    }, [
      'staff'
    ]);

    assert.isTrue($security.hasAnyPermission([
      'staff',
      'admin'
    ]));
  });

  it('should verify if user has admin and staff permission', function () {
    $security.login('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9', {
      name: 'Patrick Porto'
    }, [
      'staff',
      'admin'
    ]);

    assert.isFalse($security.hasAllPermission([
      'staff',
      'admin',
      'root'
    ]));

    assert.isTrue($security.hasAllPermission([
      'staff',
      'admin'
    ]));

    assert.isTrue($security.hasAllPermission([
      'staff'
    ]));
  });

  it('should verify if user is authenticated', function () {
    assert.isFalse($security.isAuthenticated());

    $security.login('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9');

    assert.isTrue($security.isAuthenticated());
  });

  it('should provide user info', function () {
    $security.login('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9', {
      name: 'Patrick Porto'
    });

    assert.equal($security.getUser().name, 'Patrick Porto');
  });
});
