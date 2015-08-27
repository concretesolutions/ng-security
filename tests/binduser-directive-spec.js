'use strict';

describe('Directive:bindUser', function () {
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

  it('should provide user data', function () {
    $security.login('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9', {
      name: 'Patrick Porto'
    });

    var element = $compile([
      '<div ng-bind-user="name">',
      '</div>'
    ].join())($rootScope);

    $rootScope.$digest();

    assert.equal(element.text(), 'Patrick Porto');
  });
});
