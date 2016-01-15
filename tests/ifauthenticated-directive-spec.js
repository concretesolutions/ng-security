'use strict';

describe('Directive:ifAuthenticated', function () {
  beforeEach(module('ngSecurity'));
  var $security,
      $compile,
      $rootScope,
      element;

  beforeEach(inject(function ($injector) {
    $security = $injector.get('$security');
    $compile = $injector.get('$compile');
    $rootScope = $injector.get('$rootScope');

    $security.logout();

    element = $compile('<div><div ng-if-authenticated></div></div>')($rootScope);
  }));

  it('should render element if user is authenticated', function () {
    $security.login('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9');

    $rootScope.$digest();
    assert.equal(element.children().length, 1);
  });

  it('should not render element if user not is authenticated', function () {
    $security.logout();
    $rootScope.$digest();
    assert.equal(element.children().length, 0);
  });

  it('should deregister eventlistener "authChanged" on destroyed scope', function () {
    $rootScope.$digest();
    var deregister = sinon.spy($rootScope, 'deregister');

    $rootScope.$destroy();
    assert(deregister.calledOnce);

    $security.login('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9');

    //element should not be rendered
    assert.equal(element.children().length, 0);
  });
});
