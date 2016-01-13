'use strict';

describe('Directive:ifAnonymous', function () {
  beforeEach(module('ngSecurity'));
  var $security,
      $compile,
      $rootScope,
      element;

  var html = [
      '<div ng-if-anonymous>',
      '</div>'
    ].join();


  beforeEach(inject(function ($injector) {
    $security = $injector.get('$security');
    $compile = $injector.get('$compile');
    $rootScope = $injector.get('$rootScope');

    $security.logout();
    element = $compile('<div></div>')($rootScope);
  }));

  it('should show element if user is authenticated', function () {
    element.append($compile(html)($rootScope));

    $rootScope.$digest();

    assert.equal(element.children().length, 1);
  });

  it('should hide element if user not is authenticated', function () {
    $security.login('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9');

    element.append($compile(html)($rootScope));

    $rootScope.$digest();

    assert.equal(element.children().length, 0);
  });
});
