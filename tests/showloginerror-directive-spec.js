describe('Directive:showLoginError', function () {
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

  it('should show the HTML element when fail login', function () {
    var element = $compile([
      '<form ng-submit-login="/api/auth/success">',
        '<div ng-show-login-error>',
          '<p>Username or password invalid!</p>',
        '</div>',
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

    var messageSuccess = angular.element(element.find('div')[0]);

    assert.equal(messageSuccess.css('display'), 'none');
  });

  it('should show the HTML element when success login', function () {
    var element = $compile([
      '<form ng-submit-login="/api/auth/fail">',
        '<div ng-show-login-error>',
          '<p>Username or password invalid!</p>',
        '</div>',
        '<input type="text" name="username" value="admin" />',
        '<input type="password" name="password" value="admin" />',
        '<button type="submit">Login</button>',
      '</form>'
    ].join())($rootScope);

    element.triggerHandler('submit');

    $httpBackend.expectPOST('/api/auth/fail', {
      username: 'admin',
      password: 'admin'
    }).respond(403);

    $httpBackend.flush();

    var messageSuccess = angular.element(element.find('div')[0]);

    assert.equal(messageSuccess.css('display'), '');
  });
});
