'use strict';

describe('Directive:submitLogin', function () {
  beforeEach(module('ngSecurity'));
  var $security,
      $compile,
      $rootScope,
      $httpBackend;

  beforeEach(inject(function ($injector) {
    $security = $injector.get('$security');
    $compile = $injector.get('$compile');
    $rootScope = $injector.get('$rootScope');
    $httpBackend = $injector.get('$httpBackend');

    $httpBackend.whenPOST('/api/auth/success').respond(201, {
      token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9',
      user: {
        name: 'Patrick Porto'
      },
      permissions: [
        'admin'
      ]
    });

    $httpBackend.whenPOST('/api/auth/fail').respond(403);

    $security.logout();
  }));

  it('should login by url', function () {
    var element = $compile([
      '<form ng-submit-login="/api/auth/success">',
        '<input type="text" name="username" value="admin" />',
        '<input type="password" name="password" value="admin" />',
        '<button type="submit">Login</button>',
      '</form>'
    ].join())($rootScope);

    element.triggerHandler('submit');


    $httpBackend.expectPOST('/api/auth/success', {
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

    $httpBackend.flush();

    assert.isTrue($security.isAuthenticated());
    assert.equal($security.getUser().name, 'Patrick Porto');
  });

  it('should call ng-login-success when success login', function () {
    $rootScope.success = function () {  };
    var loginSuccess = sinon.spy($rootScope, 'success');
    var element = $compile([
      '<form ng-submit-login="/api/auth/success" ng-login-success="success($response)">',
        '<input type="text" name="username" value="admin" />',
        '<input type="password" name="password" value="admin" />',
        '<button type="submit">Login</button>',
      '</form>'
    ].join())($rootScope);

    element.triggerHandler('submit');

    $httpBackend.expectPOST('/api/auth/success', {
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

    $httpBackend.flush();

    assert.isTrue(loginSuccess.calledWith({
      token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9',
      user: {
        name: 'Patrick Porto'
      },
      permissions: [
        'admin'
      ]
    }));
  });

  it('should call ng-login-error when error login', function () {
    $rootScope.error = function () {  };
    var loginError = sinon.spy($rootScope, 'error');
    var element = $compile([
      '<form ng-submit-login="/api/auth/fail" ng-login-error="error($response)">',
        '<input type="text" name="username" value="admin" />',
        '<input type="password" name="password" value="admin" />',
        '<button type="submit">Login</button>',
      '</form>'
    ].join())($rootScope);

    element.triggerHandler('submit');

    $httpBackend.expectPOST('/api/auth/fail', {
      username: 'admin',
      password: 'admin'
    }).respond(403, {'message': 'unknown error'});

    $httpBackend.flush();

    assert.isTrue(loginError.calledWith({'message': 'unknown error'}));
  });
});
