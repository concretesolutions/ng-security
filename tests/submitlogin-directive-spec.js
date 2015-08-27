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

    $httpBackend.whenPOST('/api/auth').respond(201, {
      token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9',
      user: {
        name: 'Patrick Porto'
      },
      permissions: [
        'admin'
      ]
    });

    $security.logout();
  }));

  it('should login by url', function () {
    var element = $compile([
      '<form ng-submit-login="/api/auth">',
        '<input type="text" name="username" value="admin" />',
        '<input type="password" name="password" value="admin" />',
        '<button type="submit">Login</button>',
      '</form>'
    ].join())($rootScope);

    element.triggerHandler('submit');


    $httpBackend.expectPOST('/api/auth', {
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
});
