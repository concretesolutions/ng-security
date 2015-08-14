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

  it('should show element if user is authenticated', function () {
    var element = $compile([
      '<div ng-if-anonymous>',
      '</div>'
    ].join())($rootScope);

    $rootScope.$digest();

    assert.equal(element.css('display'), '');
  });

  it('should hide element if user not is authenticated', function () {
    $security.login('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9');

    var element = $compile([
      '<div ng-if-anonymous>',
      '</div>'
    ].join())($rootScope);

    $rootScope.$digest();

    assert.equal(element.css('display'), 'none');
  });
});
